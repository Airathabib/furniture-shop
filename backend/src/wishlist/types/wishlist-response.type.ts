import { ObjectType, Field, Int } from '@nestjs/graphql';
import { WishlistItemModel } from './wishlist-item.model';

@ObjectType()
export class WishlistResponse {
  @Field(() => [WishlistItemModel])
  items!: WishlistItemModel[];

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Boolean)
  hasNextPage!: boolean;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}
