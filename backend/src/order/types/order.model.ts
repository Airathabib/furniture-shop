import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { OrderItemModel } from './order-item.model';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatusEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

registerEnumType(OrderStatusEnum, {
  name: 'OrderStatus',
});

registerEnumType(PaymentStatusEnum, {
  name: 'PaymentStatus',
});

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  orderNumber!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => OrderStatusEnum)
  status!: OrderStatusEnum;

  @Field(() => PaymentStatusEnum)
  paymentStatus!: PaymentStatusEnum;

  @Field(() => Float)
  subtotal!: number;

  @Field(() => Float)
  deliveryCost!: number;

  @Field(() => Float)
  discount!: number;

  @Field(() => Float)
  total!: number;

  @Field(() => String)
  address!: string;

  @Field(() => String)
  phone!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  comment?: string | null;

  @Field(() => [OrderItemModel])
  items!: OrderItemModel[];

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;
}
