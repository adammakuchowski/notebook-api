import {Request} from 'express'
import {KanbanTasks} from '../task/types'

export interface User {
  _id: string
  email: string
  password: string
  refreshToken: string
  kanbanTasks?: KanbanTasks;
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
