import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {
  loginUser,
  refreshUserToken,
  registerUser,
  verifyUser,
} from '../controllers/userController'
import {validationRequest} from '../../../middlewares/validationRequest'
import {
  refreshTokenSchema,
  userBodySchema,
} from '../../../validators/userValidation'
import {authenticateToken} from '../../../middlewares/auth'

export const userRouter = express.Router()

userRouter.post(
  '/register',
  validationRequest(userBodySchema),
  withAsyncHandler(registerUser),
)

userRouter.post(
  '/login',
  validationRequest(userBodySchema),
  withAsyncHandler(loginUser),
)

userRouter.get('/verify', authenticateToken, verifyUser)

userRouter.post(
  '/refreshToken',
  validationRequest(refreshTokenSchema),
  withAsyncHandler(refreshUserToken),
)
