import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

@InputType()
export class CheckoutDto {
  @Field({ description: 'Полный адрес доставки с индексом' })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @Field({ description: 'Номер телефона в формате +7...' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @Field(() => String)
  @IsEmail()
  email!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  comment?: string;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @Min(0)
  @IsOptional()
  deliveryCost?: number;

  @Field(() => Float, { nullable: true, defaultValue: 0 })
  @Min(0)
  @IsOptional()
  discount?: number;
}
