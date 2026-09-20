import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class DeleteReviewResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;
}
