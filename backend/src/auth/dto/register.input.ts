import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @Field()
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MinLength(6, {
    message: 'Пароль должен содержать минимум 6 символов',
  })
  @MaxLength(20, {
    message: 'Пароль не должен превышать 20 символов',
  })
  password!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, {
    message: 'Имя должно содержать минимум 2 символа',
  })
  @MaxLength(50, {
    message: 'Имя не должно превышать 50 символов',
  })
  name?: string;
}
