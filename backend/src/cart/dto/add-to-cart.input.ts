import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class AddToCartDto {
  @Field(() => String)
  @IsString({ message: 'productId должен быть строкой' })
  @IsNotEmpty({ message: 'productId обязателен' })
  productId!: string;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, {
    message: 'Количество должно быть не меньше 1',
  })
  @IsOptional()
  quantity?: number;
}
