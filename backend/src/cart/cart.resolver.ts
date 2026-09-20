import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartType } from './types/cart-item.type';
import { AddToCartDto } from './dto/add-to-cart.input';
import { UpdateCartItemDto } from './dto/update-cart-item.input';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import type { User } from 'generated/prisma/client';

@Resolver(() => CartType)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartType, {
    description: 'Получить корзину текущего пользователя',
  })
  @Authorization() // Требуется авторизация (любая роль)
  async getCart(@Authorized() user: User): Promise<CartType> {
    return this.cartService.getCart(user.id);
  }

  @Mutation(() => CartType, { description: 'Добавить товар в корзину' })
  @Authorization()
  async addToCart(
    @Authorized() user: User,
    @Args('input') input: AddToCartDto,
  ): Promise<CartType> {
    return this.cartService.addToCart(user.id, input);
  }

  @Mutation(() => CartType, {
    description: 'Обновить количество товара в корзине',
  })
  @Authorization()
  async updateCartItem(
    @Authorized() user: User,
    @Args('input') input: UpdateCartItemDto,
  ): Promise<CartType> {
    return this.cartService.updateCartItem(user.id, input);
  }

  @Mutation(() => CartType, { description: 'Удалить товар из корзины' })
  @Authorization()
  async removeFromCart(
    @Authorized() user: User,
    @Args('productId', { type: () => String }) productId: string,
  ): Promise<CartType> {
    return this.cartService.removeFromCart(user.id, productId);
  }

  @Mutation(() => CartType, { description: 'Очистить корзину' })
  @Authorization()
  async clearCart(@Authorized() user: User): Promise<CartType> {
    return this.cartService.clearCart(user.id);
  }
}
