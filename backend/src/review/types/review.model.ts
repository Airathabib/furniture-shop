import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

import { User } from '../../auth/model/user.model';

@ObjectType()
export class ReviewModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  rating!: number;

  @Field(() => String, { nullable: true })
  comment?: string | null;

  @Field(() => ID)
  userId!: string;

  @Field(() => User, { nullable: true })
  user?: User | null;

  @Field(() => ID)
  productId!: string;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
