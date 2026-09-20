import { ObjectType, Field } from '@nestjs/graphql';
import { Role as UserRole } from 'generated/prisma/enums';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken!: string;

  @Field()
  refreshToken!: string;

  @Field()
  userId!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  role!: UserRole;
}
