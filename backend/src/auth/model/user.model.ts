import {
  Field,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

import { Role as UserRole } from 'generated/prisma/enums';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Роль пользователя',
});

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => UserRole)
  role!: UserRole;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;
}
