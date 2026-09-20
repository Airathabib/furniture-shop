import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Product } from '../../product/model/product.model';

@ObjectType()
export class WishlistItemModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  productId!: string;

  @Field(() => Product, { nullable: true })
  product?: Product | null;

  @Field(() => ID)
  userId!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
