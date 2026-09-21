import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Subcategory } from './subcategory.model';

@ObjectType()
export class Category {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  image?: string | null;

  @Field(() => Int)
  productCount?: number;

  @Field(() => [Subcategory], { nullable: true })
  subcategories?: Subcategory[] | null;
}
