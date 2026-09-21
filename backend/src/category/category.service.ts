import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './types/category.model';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getTopCategories(limit: number): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      take: Math.max(1, Math.min(limit, 50)),
      include: {
        subcategories: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
    });

    return categories.map(({ _count, ...category }) => ({
      ...category,
      productCount: _count.products,
    }));
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Категория "${slug}" не найдена`);
    }

    return {
      ...category,
      productCount: category._count.products,
    };
  }

  // ✅ ВОТ ЭТОГО МЕТОДА НЕ ХВАТАЛО
  async getProductsByCategory(slug: string, limit: number = 50) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          take: limit,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Категория "${slug}" не найдена`);
    }

    return category.products;
  }
}
