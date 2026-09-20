import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

import { Category } from '../../category/types/category.model';

@ObjectType()
export class Product {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  sku?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  fullDescription?: string | null;

  @Field(() => String, { nullable: true })
  warranty?: string | null;

  @Field(() => Float)
  price!: number;

  @Field(() => Float, { nullable: true })
  oldPrice?: number | null;

  @Field(() => String)
  image!: string;

  @Field(() => [String])
  images!: string[];

  @Field(() => Boolean)
  inStock!: boolean;

  @Field(() => Float)
  rating!: number;

  @Field(() => Int)
  reviewCount!: number;

  @Field(() => Category, { nullable: true })
  category?: Category | null;

  @Field(() => Boolean, { nullable: true })
  isInWishlist?: boolean | null;

  @Field(() => String, { nullable: true })
  collection?: string | null;

  @Field(() => String, { nullable: true })
  size?: string | null;

  @Field(() => String, { nullable: true })
  configuration?: string | null;

  @Field(() => String, { nullable: true })
  color?: string | null;

  @Field(() => String, { nullable: true })
  material?: string | null;
}
