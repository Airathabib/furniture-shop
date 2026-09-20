import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from 'generated/prisma/client';

interface GraphQLContext {
  req: Request & {
    user?: User;
  };
}

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): GraphQLContext['req'] {
    const ctx = GqlExecutionContext.create(context);

    const gqlContext = ctx.getContext<GraphQLContext>();

    return gqlContext.req;
  }
}
