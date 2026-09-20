import { HttpException } from '@nestjs/common';

export const HTTP_ERROR_CODE_MAP: Record<string, string> = {
  BadRequestException: 'BAD_REQUEST',
  UnauthorizedException: 'UNAUTHORIZED',
  ForbiddenException: 'FORBIDDEN',
  NotFoundException: 'NOT_FOUND',
  ConflictException: 'CONFLICT',
  UnprocessableEntityException: 'UNPROCESSABLE_ENTITY',
  TooManyRequestsException: 'TOO_MANY_REQUESTS',
};

export function mapHttpException(exception: HttpException) {
  const name = exception.constructor.name;
  const response = exception.getResponse();

  if (
    typeof response === 'object' &&
    response !== null &&
    'message' in response
  ) {
    const resp = response as { message: string | string[]; code?: string };
    return {
      code: resp.code ?? HTTP_ERROR_CODE_MAP[name] ?? 'HTTP_ERROR',
      message: Array.isArray(resp.message)
        ? resp.message.join('; ')
        : resp.message,
      statusCode: exception.getStatus(),
    };
  }

  return {
    code: HTTP_ERROR_CODE_MAP[name] ?? 'HTTP_ERROR',
    message: typeof response === 'string' ? response : 'Произошла ошибка',
    statusCode: exception.getStatus(),
  };
}
