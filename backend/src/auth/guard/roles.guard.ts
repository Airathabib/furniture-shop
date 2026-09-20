import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import { Role } from 'generated/prisma/enums';
import { User } from 'generated/prisma/client';

interface GraphQLContext {
  req: Request & {
    user?: User;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const gqlContext = ctx.getContext<GraphQLContext>();
    const user = gqlContext.req.user;

    if (!user) {
      return false;
    }
    const hasRole = requiredRoles.some((role) => user.role === role);

    return hasRole;
  }
}
