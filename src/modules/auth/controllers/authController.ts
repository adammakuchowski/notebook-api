import {NextFunction, Request, Response} from 'express'

import {logger} from '../../../app'
import {
  comparePassword,
  compareRefreshToken,
  createRefreshToken,
  createUser,
  createWebToken,
  getUserByField,
  hashPassword,
  saveRefreshToken,
  verifyRefreshToken,
} from '../services/authService'
import {canCreateDocument} from '../../../db/mongoUtils'
import {UserModel} from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {
  User,
  RegisterUserPros,
  LoginUserPros,
  RefreshUserTokenProps,
} from '../types/auth'

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {email, password}: RegisterUserPros = req.body
    const {
      database: {userLimit},
    } = appConfig

    const canCreate = await canCreateDocument<User>(UserModel, userLimit)
    if (!canCreate) {
      throw new Error('Limit of user documents reached')
    }

    // TODO: Regex to email validation

    const user = await getUserByField('email', email)
    if (user) {
      logger.warn(
        `[registerUser]: user with this email ${email} already exists`,
      )

      res.status(400).json({message: 'A user with this email already exists'})

      return
    }

    const hash = await hashPassword(password)
    await createUser(email, hash)

    res.status(201).json({message: 'The user has been successfully registered'})
  } catch (error) {
    logger.error('A server error while user registration')

    next(error)
  }
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {email, password}: LoginUserPros = req.body

    const user = await getUserByField('email', email)
    if (!user?._id) {
      logger.warn(`[loginUser]: user with this email ${email} does not exists`)

      res.status(404).json({message: 'Invalid login details'})

      return
    }

    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      logger.warn('[loginUser]: incorrect password')

      res.status(401).json({message: 'Invalid login details'})

      return
    }

    const {_id} = user
    const token = await createWebToken(_id)
    const refreshToken = await createRefreshToken(_id)
    await saveRefreshToken(_id, refreshToken)

    res.status(200).json({token, refreshToken})
  } catch (error) {
    logger.error('A server error while user login')

    next(error)
  }
}

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    logger.info('[verifyUser]: user verified')

    res.status(200).json({
      message: 'Token verification successful',
    })
  } catch (error) {
    next(error)
  }
}

export const refreshUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {refreshToken}: RefreshUserTokenProps = req.body

    const data = await verifyRefreshToken(refreshToken)
    const user = await getUserByField('_id', data.id)

    if (!user?._id) {
      logger.warn('[refreshUserToken]: user does not exists')

      res.status(404).json({message: 'Invalid refresh token details'})

      return
    }

    const isRefreshTokenMatch = await compareRefreshToken(
      refreshToken,
      user.refreshToken,
    )
    if (!isRefreshTokenMatch) {
      res.status(401).json({message: 'Invalid refresh token'})

      return
    }

    const newToken = await createWebToken(user._id)
    const newRefreshToken = await createRefreshToken(user._id)
    await saveRefreshToken(user._id, newRefreshToken)

    res.status(201).json({token: newToken, refreshToken: newRefreshToken})
  } catch (error) {
    logger.error('A server error while refresh user token')

    next(error)
  }
}
