import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class WishlistDto {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty({ message: 'productId обязателен' })
  productId!: string;
}
