import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Int,
} from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './types/category.model';
import { Product } from 'src/product/model/product.model';
import { CategoryService } from './category.service';

interface ProductParent {
  categoryId: string;
}

@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}

  @Query(() => Category, {
    name: 'category',
    nullable: true,
    description: 'Получить категорию по ID',
  })
  async getCategoryById(@Args('id', { type: () => String }) id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  @Query(() => Category, {
    name: 'categoryBySlug',
    nullable: true,
    description: 'Получить категорию по slug',
  })
  async getCategoryBySlug(@Args('slug', { type: () => String }) slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Query(() => [Category], { description: 'Получить все категории' })
  async categories() {
    const categories = await this.prisma.category.findMany({
      include: {
        subcategories: true,
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

  @Query(() => [Category], {
    name: 'topCategories',
    description: 'Топ категории для отображения на главной',
  })
  async topCategories(
    @Args('limit', { type: () => Int, defaultValue: 5 }) limit: number,
  ): Promise<Category[]> {
    return this.categoryService.getTopCategories(limit);
  }

  @Query(() => [Product], {
    name: 'productsByCategory',
    description: 'Получить все товары конкретной категории',
  })
  async getProductsByCategory(
    @Args('slug', { type: () => String }) slug: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
  ) {
    return this.categoryService.getProductsByCategory(slug, limit);
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
