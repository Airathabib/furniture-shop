import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'node:path';
import { Request, Response } from 'express';
import { GraphQLError } from 'graphql';
import { HttpException } from '@nestjs/common';
import { mapPrismaError } from './common/errors/prisma-error.mapper';
import { mapHttpException } from './common/errors/http-error.mapper';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ReviewModule } from './review/review.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { PaymentModule } from './payment/payment.module';

function isPrismaError(error: unknown): error is {
  code: string;
  meta?: Record<string, unknown>;
} {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  return typeof err.code === 'string' && err.code.startsWith('P2');
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') !== 'production';

        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          playground: isDev,

          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),

          formatError: (formattedError, error) => {
            const graphQlError = error as GraphQLError;
            const originalError =
              graphQlError.originalError ??
              graphQlError.extensions?.originalError;

            if (isPrismaError(originalError)) {
              const info = mapPrismaError({
                code: originalError.code,
                meta: originalError.meta,
              });

              return {
                message: info.message,
                extensions: {
                  code: info.code,
                  originalCode: originalError.code,
                  field: info.field,
                  model: info.model,
                },
              };
            }

            if (originalError instanceof HttpException) {
              const info = mapHttpException(originalError);
              return {
                message: info.message,
                extensions: {
                  code: info.code,
                  statusCode: info.statusCode,
                },
              };
            }

            if (error instanceof GraphQLError && error.extensions?.code) {
              return {
                message: error.message,
                extensions: error.extensions,
              };
            }

            return {
              message: isDev
                ? formattedError.message
                : 'Внутренняя ошибка сервера',
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                ...(isDev
                  ? { stacktrace: formattedError.extensions?.stacktrace }
                  : {}),
              },
            };
          },
        };
      },
    }),

    PrismaModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
    ReviewModule,
    WishlistModule,
    PaymentModule,
  ],
})
export class AppModule {}
