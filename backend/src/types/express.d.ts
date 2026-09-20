import { AuthUser } from 'src/auth/interfaces/interface';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
