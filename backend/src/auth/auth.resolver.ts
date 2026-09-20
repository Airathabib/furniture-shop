import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { Authorized } from './decorators/authorized.decorator';
import { Authorization } from './decorators/authorization.decorator';
import { RegisterDto } from './dto/register.input';
import { LoginDto } from './dto/login.input';
import type { User as PrismaUser } from 'generated/prisma/client';
import { User } from './model/user.model';
import { LogoutResponse } from './types/logout-response.type';
import { UnauthorizedException } from '@nestjs/common';

interface AuthCookies {
  userId?: string;
  refreshToken?: string;
  accessToken?: string;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  private setCookies(res: Response, tokens: AuthResponse) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 минут
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    res.cookie('userId', tokens.userId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  @Mutation(() => AuthResponse)
  async register(
    @Args('input') input: RegisterDto,
    @Context('res') res: Response,
  ): Promise<AuthResponse> {
    const tokens = await this.authService.register(input);
    this.setCookies(res, tokens);
    return tokens;
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('input') input: LoginDto,
    @Context('res') res: Response,
  ): Promise<AuthResponse> {
    const tokens = await this.authService.login(input);
    this.setCookies(res, tokens);
    return tokens;
  }

  @Mutation(() => AuthResponse, { description: 'Обновить access token' })
  async refresh(
    @Context('req') req: Request, // ← Читаем из запроса
    @Context('res') res: Response,
  ): Promise<AuthResponse> {
    // Читаем куки, которые браузер прислал автоматически
    const cookies = (req.cookies ?? {}) as AuthCookies;
    const userId = cookies.userId;
    const refreshToken = cookies.refreshToken;
    if (!userId || !refreshToken) {
      throw new UnauthorizedException(
        'Refresh token или userId отсутствуют в cookies',
      );
    }

    const tokens = await this.authService.refresh(userId, refreshToken);
    this.setCookies(res, tokens); // Устанавливаем новые куки
    return tokens;
  }

  @Mutation(() => LogoutResponse, { description: 'Выйти из системы' })
  async logout(
    @Context('req') req: Request,
    @Context('res') res: Response,
  ): Promise<LogoutResponse> {
    const cookies = (req.cookies as AuthCookies) ?? {};
    const userId = cookies.userId;

    if (userId) {
      try {
        await this.authService.logout(userId);
      } catch (error) {
        console.warn('Не удалось удалить токен из БД при выходе:', error);
      }
    }

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.clearCookie('userId', { path: '/' });

    return { success: true };
  }

  @Query(() => User, {
    description: 'Получить данные текущего авторизованного пользователя',
  })
  @Authorization()
  getMe(@Authorized() user: PrismaUser): PrismaUser {
    return user;
  }
}
