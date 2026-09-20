import { Request } from 'express';
import { User } from 'generated/prisma/client';

export interface GraphQLContext {
  req: Request & {
    user?: User;
  };
}
