import mongoose, {Document} from 'mongoose'

export interface RefreshToken extends Document<string> {
  userId: mongoose.Schema.Types.ObjectId;
  refreshToken: string;
  used: boolean;
}

const refreshTokenSchema = new mongoose.Schema<RefreshToken>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  refreshToken: {
    type: String,
    required: true,
    unique: true
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
})

const RefreshTokenModel = mongoose.model<RefreshToken>('RefreshToken', refreshTokenSchema, 'refreshTokens')

export default RefreshTokenModel
