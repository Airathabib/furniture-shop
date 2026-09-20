import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { CreateProductDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.input';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './model/product.model';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private generateSafeSlug(text: string): string {
    const translitMap: Record<string, string> = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'sch',
      ъ: '',
      ы: 'y',
      ь: '',
      э: 'e',
      ю: 'yu',
      я: 'ya',
      ' ': '-',
      '"': '',
      "'": '',
    };

    return text
      .toLowerCase()
      .split('')
      .map((char) => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Товар с адресом "${slug}" не найден`);
    }

    return product;
  }

  async getSpecialOffers(limit: number = 10): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        oldPrice: {
          not: null,
        },
        inStock: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit * 2,
    });

    const withDiscount = products.filter(
      (p) => p.oldPrice !== null && p.oldPrice > p.price,
    );

    return withDiscount.slice(0, limit);
  }

  async getTopRated(limit: number = 8): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        inStock: true,
        rating: {
          gt: 0,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: limit,
    });
  }

  async create(input: CreateProductDto) {
    // 1. Берем переданный slug, а если его нет — генерируем из названия
    const rawSlug = input.slug || input.name;
    let safeSlug = this.generateSafeSlug(rawSlug);

    // 2. Проверяем уникальность (защита от дубликатов)
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug: safeSlug },
      });

      if (!existingProduct) {
        isUnique = true; // Slug свободен, можно использовать
      } else {
        // Если занят, добавляем число: kreslo-agata-1, kreslo-agata-2 и т.д.
        safeSlug = `${this.generateSafeSlug(input.name)}-${counter}`;
        counter++;
      }
    }

    // 3. Создаем товар с гарантированно безопасным и уникальным slug
    return this.prisma.product.create({
      data: {
        ...input,
        slug: safeSlug, // <-- Перезаписываем slug на отформатированный
        rating: 0,
        reviewCount: 0,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, input: UpdateProductDto) {
    await this.findOne(id);

    const {
      categoryId,
      name,
      slug,
      sku,
      price,
      oldPrice,
      description,
      collection,
      size,
      configuration,
      color,
      material,
      fullDescription,
      warranty,
      image,
      images,
      inStock,
    } = input;

    const data: Prisma.ProductUpdateInput = {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(sku !== undefined && { sku }),
      ...(price !== undefined && { price }),
      ...(oldPrice !== undefined && { oldPrice }),
      ...(description !== undefined && { description }),
      ...(fullDescription !== undefined && {
        fullDescription,
      }),
      ...(collection !== undefined && { collection }),
      ...(size !== undefined && { size }),
      ...(configuration !== undefined && { configuration }),
      ...(color !== undefined && { color }),
      ...(material !== undefined && { material }),
      ...(warranty !== undefined && { warranty }),
      ...(image !== undefined && { image }),
      ...(images !== undefined && { images }),
      ...(inStock !== undefined && { inStock }),

      ...(categoryId !== undefined && {
        category: {
          connect: {
            id: categoryId,
          },
        },
      }),
    };

    return this.prisma.product.update({
      where: {
        id,
      },
      data,
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
