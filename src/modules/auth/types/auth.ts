import {Request} from 'express'

export interface User {
  _id: string
  email: string
  password: string
  refreshToken: string
}

export type RegisterUserPros = User

export type LoginUserPros = User

export type RefreshUserTokenProps = {
  refreshToken: string
}

export interface AuthRequest extends Request {
  user?: {
    id: string
  }
}
