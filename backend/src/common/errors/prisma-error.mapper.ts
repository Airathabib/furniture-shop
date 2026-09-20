export const PRISMA_ERROR_MAP: Record<
  string,
  { code: string; message: string }
> = {
  P2002: {
    code: 'UNIQUE_CONSTRAINT_VIOLATION',
    message: 'Запись с такими данными уже существует',
  },
  P2025: {
    code: 'RECORD_NOT_FOUND',
    message: 'Запись не найдена',
  },
  P2003: {
    code: 'FOREIGN_KEY_VIOLATION',
    message: 'Связанная запись не существует',
  },
  P2014: {
    code: 'RELATION_VIOLATION',
    message: 'Нарушение связи между записями',
  },
  P2017: {
    code: 'CONNECT_RECORD_NOT_FOUND',
    message: 'Связываемая запись не найдена',
  },
};

// Специфичные маппинги по полям (для P2002 — уникальность)
export const PRISMA_FIELD_MESSAGES: Record<string, Record<string, string>> = {
  User: {
    email: 'Пользователь с таким email уже зарегистрирован',
  },
  Product: {
    slug: 'Товар с таким URL уже существует',
  },
  Category: {
    slug: 'Категория с таким URL уже существует',
    name: 'Категория с таким названием уже существует',
  },
  Review: {
    userId_productId: 'Вы уже оставляли отзыв на этот товар',
  },
  CartItem: {
    userId_productId: 'Товар уже в корзине',
  },
  Order: {
    orderNumber: 'Номер заказа уже существует',
  },
};

export interface PrismaErrorInfo {
  code: string;
  message: string;
  field?: string;
  model?: string;
}

export function mapPrismaError(error: {
  code: string;
  meta?: Record<string, unknown>;
}): PrismaErrorInfo {
  const mapping = PRISMA_ERROR_MAP[error.code] ?? {
    code: 'PRISMA_ERROR',
    message: 'Ошибка базы данных',
  };

  if (error.code === 'P2002' && error.meta) {
    const modelName = error.meta.modelName as string;
    const target = error.meta.target as string[] | undefined;
    const field = target?.[0];

    const specificMessage =
      field && modelName
        ? PRISMA_FIELD_MESSAGES[modelName]?.[field]
        : undefined;

    return {
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
      message: specificMessage ?? mapping.message,
      field,
      model: modelName,
    };
  }

  return { code: mapping.code, message: mapping.message };
}
