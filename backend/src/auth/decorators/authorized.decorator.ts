import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from 'generated/prisma/client';

interface LocalGraphQLContext {
  req: Request & {
    user?: User;
  };
}

export const Authorized = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    const { req } =
      GqlExecutionContext.create(context).getContext<LocalGraphQLContext>();

    if (!req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return req.user;
  },
);
