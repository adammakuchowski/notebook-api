import mongoose, {Document} from 'mongoose'

export interface User extends Document<string> {
  email: string;
  password: string;
}

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
  }
}, {
  timestamps: true
})

const UserModel = mongoose.model<User>('User', userSchema, 'users')

export default UserModel
