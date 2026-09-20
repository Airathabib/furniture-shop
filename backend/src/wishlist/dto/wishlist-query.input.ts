import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

@InputType()
export class WishlistQueryDto {
  @Field(() => Int, {
    nullable: true,
    defaultValue: 1,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  page?: number;

  @Field(() => Int, {
    nullable: true,
    defaultValue: 12,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}
