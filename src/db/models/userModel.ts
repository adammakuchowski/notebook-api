import mongoose from 'mongoose'

import {User} from '../../modules/user/types'
import {kanbanTasksSchema} from './kanbanTasksModel'

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      unique: true,
    },
    kanbanTasks: {
      type: kanbanTasksSchema,
    }
  },
  {
    timestamps: true,
  },
)

export const UserModel = mongoose.model<User>('User', userSchema, 'users')
