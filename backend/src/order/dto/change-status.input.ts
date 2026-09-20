import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderStatusEnum, PaymentStatusEnum } from '../types/order.model';

@InputType()
export class ChangeOrderStatusDto {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @Field(() => OrderStatusEnum, { nullable: true })
  @IsEnum(OrderStatusEnum)
  @IsOptional()
  status?: OrderStatusEnum;

  @Field(() => PaymentStatusEnum, { nullable: true })
  @IsEnum(PaymentStatusEnum)
  @IsOptional()
  paymentStatus?: PaymentStatusEnum;
}
