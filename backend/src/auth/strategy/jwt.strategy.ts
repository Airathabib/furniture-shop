import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from 'generated/prisma/client';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/interface';

// ✅ 1. Создаем локальный тип, который безопасно переопределяет cookies
// Omit удаляет конфликтующий тип из @types/cookie-parser, а мы добавляем свой строгий.
export interface JwtRequest extends Omit<Request, 'cookies'> {
  cookies?: {
    accessToken?: string;
    refreshToken?: string;
    userId?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<{ JWT_SECRET: string }, true>,
    private readonly prisma: PrismaService,
  ) {
    const secret: string = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // ✅ 2. Используем наш безопасный тип JwtRequest вместо стандартного Request
        (req: JwtRequest): string | null => {
          // TypeScript теперь знает точную структуру req.cookies и не ругается на any
          let token = req.cookies?.accessToken;

          // Если в куке нет, пытаемся взять из заголовка (для Postman)
          if (!token && req.headers?.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
          }

          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return user;
  }
}
