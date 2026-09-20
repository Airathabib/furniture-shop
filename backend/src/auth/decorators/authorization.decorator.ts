import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from 'generated/prisma/enums';
import { JwtGuard } from '../guard/jwt.guard';
import { RolesGuard } from '../guard/roles.guard';

export function Authorization(...roles: Role[]) {
  if (roles.length > 0) {
    return applyDecorators(Roles(...roles), UseGuards(JwtGuard, RolesGuard));
  }
  return applyDecorators(UseGuards(JwtGuard));
}
