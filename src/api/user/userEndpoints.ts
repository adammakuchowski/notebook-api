import express, {Request, Response, NextFunction} from 'express'
import withAsyncHandler from 'express-async-handler'

import {validationRequest} from '../../middlewares/validationRequest'
import {
  refreshTokenSchema,
  userBodySchema,
} from '../../validators/userValidation'
import {authenticateToken} from '../../middlewares/auth'
import {UserController} from './userController'

export const userRouter = express.Router()

userRouter.post(
  '/register',
  validationRequest(userBodySchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new UserController().registerUser(req, res, next)
  }),
)

userRouter.post(
  '/login',
  validationRequest(userBodySchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new UserController().loginUser(req, res, next)
  }),
)

userRouter.get(
  '/verify',
  authenticateToken,
  (req: Request, res: Response, next: NextFunction) => {
    new UserController().verifyUser(req, res, next)
  },
)

userRouter.post(
  '/refreshToken',
  validationRequest(refreshTokenSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new UserController().refreshUserToken(req, res, next)
  }),
)
