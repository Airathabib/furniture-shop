import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from 'generated/prisma/client';
import { Request } from 'express'; // ✅ 1. Импортируем тип Request из express

interface EnvVariables {
  JWT_SECRET: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<EnvVariables, true>,
    private readonly prisma: PrismaService,
  ) {
    const secret: string = configService.getOrThrow<string>('JWT_SECRET');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // ✅ 2. Заменяем `any` на `Request`
        (req: Request): string | null => {
          // 1. Сначала пытаемся взять токен из куки (так делает наш фронтенд)
          // req.cookies доступен благодаря middleware cookie-parser
          let token = req.cookies?.accessToken;

          // 2. Если в куке нет, пытаемся взять из заголовка (для Postman/GraphQL Playground)
          if (!token && req.headers?.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
          }

          // ✅ 3. Возвращаем строку или null (так ожидает passport-jwt)
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
