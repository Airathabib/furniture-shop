import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponse } from './types/auth-response.type';
import { RegisterDto } from './dto/register.input';
import { LoginDto } from './dto/login.input';
import { Role, User } from 'generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { getRefreshSignOptions, EnvVariables } from '../config/jwt.config';
import { LogoutResponse } from './types/logout-response.type';

interface TokenPayload {
  sub: string;
  email: string;
  role: Role;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService<EnvVariables, true>,
  ) {}

  async register(input: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user: User = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        name: input.name,
      },
    });

    return this.generateAuthResponse(user);
  }

  async login(input: LoginDto): Promise<AuthResponse> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return this.generateAuthResponse(user);
  }

  async refresh(
    userId: string,
    oldRefreshToken: string,
  ): Promise<AuthResponse> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      oldRefreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    return this.generateAuthResponse(user);
  }

  async logout(userId: string): Promise<LogoutResponse> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { success: true };
  }

  private async generateAuthResponse(user: User): Promise<AuthResponse> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshSignOptions = getRefreshSignOptions(this.configService);
    const refreshToken = this.jwtService.sign(payload, refreshSignOptions);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
      userId: user.id,
      email: user.email,
      name: user.name ?? undefined,
      role: user.role,
    };
  }
}
