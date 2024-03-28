import mongoose from 'mongoose'

import {User} from '../../modules/auth/types/auth'

const userSchema = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true
})

const UserModel = mongoose.model<User>('User', userSchema, 'users')

export default UserModel
