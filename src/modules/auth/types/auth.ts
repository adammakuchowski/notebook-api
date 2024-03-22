import {Request} from 'express'

export interface User {
  email: string;
  password: string;
}

export type UserPros = User

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}
