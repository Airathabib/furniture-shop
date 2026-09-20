import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  const publicPath = join(process.cwd(), 'public');

  // Раздаем всю папку public на корень
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use('/', express.static(publicPath));

  const PORT = process.env.PORT || 4200;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(PORT);
  console.log(`🚀 Бэкенд запущен на http://localhost:${PORT}`);
  console.log(`📁 Статика раздается из: ${publicPath}`);
}

void bootstrap();
