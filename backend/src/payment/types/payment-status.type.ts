import { ObjectType, Field, GraphQLISODateTime, Float } from '@nestjs/graphql';
import {
  PaymentStatusEnum,
  OrderStatusEnum,
} from '../../order/types/order.model';

@ObjectType({ description: 'Статус оплаты заказа' })
export class PaymentStatusType {
  @Field(() => PaymentStatusEnum)
  paymentStatus!: PaymentStatusEnum;

  @Field(() => OrderStatusEnum)
  status!: OrderStatusEnum;

  @Field({ nullable: true, description: 'Способ оплаты (card, sbp, cash)' })
  paymentMethod?: string;

  @Field({ nullable: true, description: 'ID транзакции во внешней системе' })
  paymentId?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  paidAt?: Date;

  @Field(() => Float, { description: 'Итоговая сумма заказа' })
  total!: number;
}
