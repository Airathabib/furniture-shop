import { ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import { Request, Response } from 'express';

export const getGraphQLConfig = (
  configService: ConfigService,
): Omit<ApolloDriverConfig, 'driver'> => {
  const isDev = configService.get<string>('NODE_ENV') !== 'production';

  return {
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    playground: isDev,

    context: ({ req, res }: { req: Request; res: Response }) => ({
      req,
      res,
    }),
  };
};
