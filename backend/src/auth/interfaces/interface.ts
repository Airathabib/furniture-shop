export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// ✅ Оставляем расширение только для user.
// Cookies трогать не будем, чтобы не конфликтовать с @types/cookie-parser
declare module 'express' {
  interface Request {
    user?: AuthUser;
  }
}
