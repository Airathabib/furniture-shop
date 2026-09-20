import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum PaymentMethod {
  CARD = 'card',
  SBP = 'sbp',
  CASH = 'cash',
}

registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

@InputType()
export class InitiatePaymentDto {
  @Field(() => String)
  @IsString({ message: 'orderId должен быть строкой' })
  @IsNotEmpty({ message: 'orderId обязателен' })
  orderId!: string;

  @Field(() => PaymentMethod)
  @IsEnum(PaymentMethod, { message: 'Недопустимый метод оплаты' })
  method!: PaymentMethod;
}
