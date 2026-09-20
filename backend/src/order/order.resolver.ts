import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { OrderModel } from './types/order.model';
import { CheckoutDto } from './dto/checkout.input';
import { ChangeOrderStatusDto } from './dto/change-status.input';
import { Authorized } from '../auth/decorators/authorized.decorator';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Role } from 'generated/prisma/enums';
import type { User } from 'generated/prisma/client';

@Resolver(() => OrderModel)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  /**
   * Оформить заказ из корзины. Только авторизованный пользователь.
   */
  @Mutation(() => OrderModel)
  @Authorization() // JwtGuard — просто проверка авторизации
  async checkout(@Authorized() user: User, @Args('input') input: CheckoutDto) {
    return this.orderService.checkout(user.id, input);
  }

  /**
   * Мои заказы.
   */
  @Query(() => [OrderModel])
  @Authorization()
  async myOrders(@Authorized() user: User) {
    return this.orderService.findMyOrders(user.id);
  }

  /**
   * Получить заказ по ID. Свой (USER) или любой (ADMIN).
   */
  @Query(() => OrderModel, { nullable: true })
  @Authorization()
  async order(@Args('id') id: string, @Authorized() user: User) {
    const isAdmin = user.role === Role.ADMIN;
    return this.orderService.findOne(id, user.id, isAdmin);
  }

  /**
   * Все заказы — только админ.
   */
  @Query(() => [OrderModel])
  @Authorization(Role.ADMIN) // JwtGuard + RolesGuard с ролью ADMIN
  async allOrders() {
    return this.orderService.findAll();
  }

  /**
   * Сменить статус заказа — только админ.
   */
  @Mutation(() => OrderModel)
  @Authorization(Role.ADMIN)
  async changeOrderStatus(@Args('input') input: ChangeOrderStatusDto) {
    return this.orderService.changeStatus(input);
  }
}
