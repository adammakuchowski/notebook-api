import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {
  loginUser,
  refreshUserToken,
  registerUser,
  verifyUser,
} from '../controllers/authController'
import {validationRequest} from '../../../middlewares/validationRequest'
import {
  refreshTokenSchema,
  userBodySchema,
} from '../../../validators/userValidation'
import {authenticateToken} from '../../../middlewares/auth'

export const authRouter = express.Router()

authRouter.post(
  '/register',
  validationRequest(userBodySchema),
  withAsyncHandler(registerUser),
)

authRouter.post(
  '/login',
  validationRequest(userBodySchema),
  withAsyncHandler(loginUser),
)

authRouter.get('/verify', authenticateToken, verifyUser)

authRouter.post(
  '/refreshToken',
  validationRequest(refreshTokenSchema),
  authenticateToken,
  withAsyncHandler(refreshUserToken),
)
