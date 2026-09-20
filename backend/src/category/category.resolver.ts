import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './types/category.model';

interface ProductParent {
  categoryId: string;
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => Category, {
    name: 'category',
    nullable: true,
    description: 'Получить категорию по ID',
  })
  async getCategoryById(@Args('id', { type: () => String }) id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  @Query(() => [Category], { description: 'Получить все категории' })
  async categories() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((cat) => ({
      ...cat,
      productCount: cat._count.products,
    }));
  }

  @ResolveField(() => Category, {
    name: 'category',
    nullable: true,
  })
  async resolveProductCategory(@Parent() product: ProductParent) {
    if (!product.categoryId) return null;

    return this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });
  }
}
