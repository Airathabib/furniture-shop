import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { CreateProductDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { calculateDiscount, generateSafeSlug } from 'src/utils/product.utils';

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  private getSafeLimit(limit: number): number {
    return Math.min(Math.max(limit, 1), 100);
  }

  async findAll(
    limit: number = 50,
    categorySlugs?: string[],
    minPrice?: number,
    maxPrice?: number,
    discountFilters?: string[],
    colorFilters?: string[],
    search?: string, // ✅ 1. Добавлен параметр поиска
  ): Promise<ProductWithCategory[]> {
    const safeLimit = this.getSafeLimit(limit);
    const where: Prisma.ProductWhereInput = {};
    const andConditions: Prisma.ProductWhereInput[] = [];

    // ✅ 2. Условие поиска по названию (нечувствительно к регистру)
    if (search && search.trim() !== '') {
      andConditions.push({
        name: {
          contains: search.trim(),
          mode: 'insensitive' as const,
        },
      });
    }

    // 3. Фильтр по категориям
    if (categorySlugs?.length) {
      andConditions.push({ category: { slug: { in: categorySlugs } } });
    }

    // 4. Фильтр по цене
    if (minPrice !== undefined || maxPrice !== undefined) {
      andConditions.push({
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice }),
        },
      });
    }

    // 5. Фильтр по цвету
    if (colorFilters?.length) {
      const colorMap: Record<string, string[]> = {
        brown: ['коричнев', 'дуб', 'орех', 'венге', 'каштан', 'бук'],
        black: ['чёрн', 'черн', 'антрацит'],
        beige: ['бежев', 'песочн', 'капучин', 'кремов', 'слонов'],
        gray: ['сер', 'графит', 'серебр'],
        white: ['бел', 'шагрен', 'молочн'],
        blue: ['син', 'голуб', 'аквамарин', 'бирюз'],
        orange: ['оранж', 'рыж', 'терракот'],
        yellow: ['желт', 'лимон', 'горчич'],
        green: ['зелен', 'зелён', 'изумруд', 'мятн', 'олив'],
        gold: ['золот', 'латун', 'бронз'],
        multicolor: ['мультиколор', 'разноцвет', 'пестр', 'принт'],
      };

      const colorConditions: Prisma.ProductWhereInput[] = [];
      for (const filterId of colorFilters) {
        const keywords = colorMap[filterId];
        if (keywords) {
          colorConditions.push({
            OR: keywords.map((keyword) => ({
              color: { contains: keyword, mode: 'insensitive' as const },
            })),
          });
        }
      }
      if (colorConditions.length > 0) {
        andConditions.push({ OR: colorConditions });
      }
    }

    // 6. Фильтр по скидкам
    if (discountFilters?.length) {
      const discountConditions: Prisma.ProductWhereInput[] = [];
      if (discountFilters.includes('more5000')) {
        discountConditions.push({ discountAmount: { gte: 5000 } });
      }
      if (discountFilters.includes('less5000')) {
        discountConditions.push({
          AND: [
            { discountAmount: { gt: 0 } },
            { discountAmount: { lt: 5000 } },
          ],
        });
      }
      if (discountFilters.includes('no-discount')) {
        discountConditions.push({
          OR: [{ discountAmount: { lte: 0 } }, { discountAmount: null }],
        });
      }
      if (discountConditions.length > 0) {
        andConditions.push({ OR: discountConditions });
      }
    }

    // 7. Финальная сборка where
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // 8. Выполнение запроса
    return this.prisma.product.findMany({
      where,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async findOne(id: string): Promise<ProductWithCategory> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) throw new NotFoundException(`Товар с ID ${id} не найден`);
    return product;
  }

  async findBySlug(slug: string): Promise<ProductWithCategory> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!product)
      throw new NotFoundException(`Товар с адресом "${slug}" не найден`);
    return product;
  }

  async getSpecialOffers(limit: number = 10): Promise<ProductWithCategory[]> {
    const safeLimit = this.getSafeLimit(limit);
    return this.prisma.product.findMany({
      where: {
        inStock: true,
        discountAmount: { gt: 0 },
      },
      orderBy: [{ discountAmount: 'desc' }, { updatedAt: 'desc' }],
      take: safeLimit,
      include: { category: true },
    });
  }

  async getTopRated(limit: number = 8): Promise<ProductWithCategory[]> {
    const safeLimit = this.getSafeLimit(limit);
    return this.prisma.product.findMany({
      where: { inStock: true, rating: { gt: 0 } },
      orderBy: { rating: 'desc' },
      take: safeLimit,
      include: { category: true },
    });
  }

  async create(input: CreateProductDto): Promise<ProductWithCategory> {
    const baseSlug = generateSafeSlug(input.slug || input.name);
    const discountAmount = calculateDiscount(input.price, input.oldPrice);

    for (let counter = 0; counter < 100; counter++) {
      const slug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`;

      try {
        return await this.prisma.product.create({
          data: {
            ...input,
            slug,
            rating: 0,
            reviewCount: 0,
            discountAmount,
          },
          include: { category: true },
        });
      } catch (error) {
        // ✅ FIX #1: Безопасная обработка ошибки уникальности (Race Condition)
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }
    throw new ConflictException(
      'Не удалось создать уникальный slug после 100 попыток',
    );
  }

  async update(
    id: string,
    input: UpdateProductDto,
  ): Promise<ProductWithCategory> {
    await this.findOne(id);

    const normalizedSlug =
      input.slug !== undefined ? generateSafeSlug(input.slug) : undefined;

    if (input.categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: input.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Категория с ID ${input.categoryId} не найдена`,
        );
      }
    }

    const currentPrice =
      input.price !== undefined ? Number(input.price) : undefined;
    const currentOldPrice =
      input.oldPrice !== undefined ? Number(input.oldPrice) : undefined;

    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { price: true, oldPrice: true },
    });
    const priceForCalc = currentPrice ?? Number(product?.price ?? 0);
    const oldPriceForCalc =
      currentOldPrice !== undefined
        ? currentOldPrice
        : Number(product?.oldPrice ?? 0);

    const discountAmount = calculateDiscount(
      priceForCalc,
      oldPriceForCalc || null,
    );

    const data: Prisma.ProductUpdateInput = {
      ...(input.name !== undefined && { name: input.name }),
      ...(normalizedSlug !== undefined && { slug: normalizedSlug }),
      ...(input.sku !== undefined && { sku: input.sku }),
      ...(currentPrice !== undefined && { price: currentPrice }),
      ...(currentOldPrice !== undefined && { oldPrice: currentOldPrice }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.fullDescription !== undefined && {
        fullDescription: input.fullDescription,
      }),
      ...(input.collection !== undefined && { collection: input.collection }),
      ...(input.size !== undefined && { size: input.size }),
      ...(input.configuration !== undefined && {
        configuration: input.configuration,
      }),
      ...(input.color !== undefined && { color: input.color }),
      ...(input.material !== undefined && { material: input.material }),
      ...(input.warranty !== undefined && { warranty: input.warranty }),
      ...(input.image !== undefined && { image: input.image }),
      ...(input.images !== undefined && { images: input.images }),
      ...(input.inStock !== undefined && { inStock: input.inStock }),
      ...(input.categoryId !== undefined && {
        category: { connect: { id: input.categoryId } },
      }),
      discountAmount,
    };

    try {
      return await this.prisma.product.update({
        where: { id },
        data,
        include: { category: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Такой slug уже используется другим товаром',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<ProductWithCategory> {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
      include: { category: true },
    });
  }
}
