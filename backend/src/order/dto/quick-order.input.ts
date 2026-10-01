import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsUUID, Matches } from 'class-validator';

@InputType()
export class QuickOrderDto {
  @Field(() => String, { description: 'ID товара' })
  @IsUUID()
  @IsNotEmpty({ message: 'ID товара обязателен' })
  productId!: string;

  @Field(() => String, { description: 'Имя покупателя' })
  @IsString()
  @IsNotEmpty({ message: 'Пожалуйста, введите ваше имя' })
  name!: string;

  @Field(() => String, { description: 'Номер телефона' })
  @IsString()
  @IsNotEmpty({ message: 'Пожалуйста, введите номер телефона' })
  @Matches(/^\+?\d[\d\s()-]{9,14}$/, {
    message: 'Некорректный формат номера телефона',
  })
  phone!: string;
}
