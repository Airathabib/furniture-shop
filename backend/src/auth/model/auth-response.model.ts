import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.model';

@ObjectType()
export class AuthResponse {
  @Field(() => String, {
    description: 'JWT access token',
  })
  accessToken!: string;
  @Field(() => User)
  user!: User;
}
