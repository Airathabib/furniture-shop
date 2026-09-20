import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsEmail({}, { message: 'Некорректный email' })
  email!: string;

  @Field()
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  @MaxLength(20, {
    message: 'Пароль не должен превышать 20 символов',
  })
  password!: string;
}
