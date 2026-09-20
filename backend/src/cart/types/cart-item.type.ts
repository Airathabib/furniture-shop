import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/model/product.model';

@ObjectType()
export class CartItemType {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  quantity!: number;

  @Field(() => Product)
  product!: Product;

  @Field(() => Float)
  totalPrice!: number;
}

@ObjectType()
export class CartType {
  @Field(() => [CartItemType])
  items!: CartItemType[];

  @Field(() => Float)
  totalAmount!: number;
}
