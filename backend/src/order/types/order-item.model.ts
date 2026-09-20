import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OrderItemModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  productId!: string;

  @Field(() => String)
  productName!: string;

  @Field(() => String, { nullable: true })
  productImage?: string | null;

  @Field(() => Float)
  price!: number;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Float)
  total!: number;
}
