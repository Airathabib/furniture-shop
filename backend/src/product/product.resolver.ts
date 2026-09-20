import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
  Int,
} from '@nestjs/graphql';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt'; // <-- 1. Импортируем JwtService
import { Role, type User as PrismaUser } from 'generated/prisma/client';

import { ProductService } from './product.service';
import { WishlistService } from '../wishlist/wishlist.service';
import { CreateProductDto } from './dto/create-product.input';
import { UpdateProductDto } from './dto/update-product.input';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { Product } from './model/product.model';

interface GraphqlContext {
  req: Request & {
    user?: PrismaUser;
  };
}

interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
}

@Resolver(() => Product)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly wishlistService: WishlistService,
    private readonly jwtService: JwtService,
  ) {}

  @Query(() => [Product], { description: 'Получить все товары' })
  async products() {
    return this.productService.findAll();
  }

  @Query(() => Product, { nullable: true, description: 'Получить товар по ID' })
  async product(@Args('id', { type: () => String }) id: string) {
    return this.productService.findOne(id);
  }

  @Mutation(() => Product, { description: 'Создать товар (Только ADMIN)' })
  @Authorization(Role.ADMIN)
  async createProduct(
    @Args('input') input: CreateProductDto,
    @Authorized() adminUser: PrismaUser,
  ) {
    console.log(`Admin ${adminUser.email} created product: ${input.name}`);
    return this.productService.create(input);
  }

  @Query(() => Product, {
    name: 'productBySlug',
    description: 'Получить товар по его slug',
  })
  async productBySlug(
    @Args('slug', { type: () => String }) slug: string,
  ): Promise<Product> {
    return this.productService.findBySlug(slug);
  }

  @Query(() => [Product], {
    name: 'topRated',
    description: 'Товары с высоким рейтингом',
  })
  async topRated(
    @Args('limit', { type: () => Int, defaultValue: 8 }) limit: number,
  ): Promise<Product[]> {
    return this.productService.getTopRated(limit);
  }

  @Mutation(() => Product, { description: 'Обновить товар (Только ADMIN)' })
  @Authorization(Role.ADMIN)
  async updateProduct(
    @Args('id', { type: () => String }) id: string,
    @Args('input') input: UpdateProductDto,
  ) {
    return this.productService.update(id, input);
  }

  @Query(() => [Product], {
    description: 'Получить товары со скидкой (специальные предложения)',
  })
  async specialOffers(
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<Product[]> {
    return this.productService.getSpecialOffers(limit);
  }

  @Mutation(() => Product, { description: 'Удалить товар (Только ADMIN)' })
  @Authorization(Role.ADMIN)
  async removeProduct(@Args('id', { type: () => String }) id: string) {
    return this.productService.remove(id);
  }

  @ResolveField(() => Boolean, {
    name: 'isInWishlist',
    description: 'Находится ли товар в избранном у текущего пользователя',
    nullable: true,
  })
  async isInWishlist(
    @Parent() product: { id: string },
    @Context() context: GraphqlContext,
  ): Promise<boolean> {
    const authHeader = context.req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = this.jwtService.verify<TokenPayload>(token);
      const userId = payload.sub;

      const ids = await this.wishlistService.getWishlistProductIds(userId, [
        product.id,
      ]);

      return ids.includes(product.id);
    } catch {
      return false;
    }
  }
}
