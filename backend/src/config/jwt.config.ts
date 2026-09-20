import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

// 1. Строго типизируем переменные окружения
export interface EnvVariables {
  JWT_SECRET: string;
  JWT_REFRESH_SECRET?: string;
}

export function getJwtConfig(
  configService: ConfigService<EnvVariables, true>,
): JwtModuleOptions {
  return {
    secret: configService.getOrThrow('JWT_SECRET'),
    signOptions: {
      expiresIn: '15m',
      algorithm: 'HS256',
    },
    verifyOptions: {
      algorithms: ['HS256'],
      ignoreExpiration: false,
    },
  };
}

export function getRefreshSignOptions(
  configService: ConfigService<EnvVariables, true>,
): JwtSignOptions {
  return {
    secret:
      configService.get('JWT_REFRESH_SECRET') ||
      configService.getOrThrow('JWT_SECRET'),
    expiresIn: '30d', // 30 дней
    algorithm: 'HS256',
  };
}
