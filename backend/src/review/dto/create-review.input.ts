import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class CreateReviewDto {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty({ message: 'productId обязателен' })
  productId!: string;

  @Field(() => Int)
  @IsInt({ message: 'Рейтинг должен быть целым числом' })
  @Min(1, { message: 'Минимальный рейтинг: 1' })
  @Max(5, { message: 'Максимальный рейтинг: 5' })
  rating!: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string | null;
}
