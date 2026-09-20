import { Field, ObjectType, GraphQLISODateTime } from '@nestjs/graphql';

@ObjectType()
export class PaymentResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field()
  paymentId!: string;

  @Field()
  message!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  paidAt?: Date | null;
}
