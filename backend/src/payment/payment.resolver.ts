import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { PaymentResponse } from './types/payment-response.type';
import { PaymentStatusType } from './types/payment-status.type';
import { InitiatePaymentDto } from './dto/initiate-payment.input';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';
import type { User } from 'generated/prisma/client';

@Resolver()
export class PaymentResolver {
  constructor(private paymentService: PaymentService) {}

  @Mutation(() => PaymentResponse, {
    description: 'Оплатить заказ (демо-режим)',
  })
  @Authorization()
  async initiatePayment(
    @Authorized() user: User,
    @Args('input') input: InitiatePaymentDto,
  ) {
    return this.paymentService.initiatePayment(
      user.id,
      input.orderId,
      input.method,
    );
  }

  @Query(() => PaymentStatusType, {
    description: 'Получить текущий статус оплаты конкретного заказа',
  })
  @Authorization()
  async paymentStatus(
    @Authorized() user: User,
    @Args('orderId', { type: () => String }) orderId: string,
  ) {
    return this.paymentService.getPaymentStatus(orderId);
  }
}
