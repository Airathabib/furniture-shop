import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

@InputType()
export class UpdateCartItemDto {
  @Field(() => String)
  @IsString({ message: 'productId должен быть строкой' })
  @IsNotEmpty({ message: 'productId обязателен' })
  productId!: string;

  @Field(() => Int)
  @IsInt({ message: 'Количество должно быть целым числом' })
  @Min(1, {
    message: 'Количество должно быть не меньше 1',
  })
  quantity!: number;
}
