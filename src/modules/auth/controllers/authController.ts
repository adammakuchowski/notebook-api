import {NextFunction, Request, Response} from 'express'

import {logger} from '../../../app'
import {
  comparePassword,
  createRefreshToken,
  createUser,
  createWebToken,
  getUserByEmail,
  hashPassword,
  saveRefreshToken
} from '../services/authService'
import {canCreateDocument} from '../../../db/mongoUtils'
import User from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {UserPros} from '../types/auth'

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password}: UserPros = req.body
    const {database: {userLimit}} = appConfig

    const canCreate = await canCreateDocument(User, userLimit)
    if (!canCreate) {
      throw new Error('Limit of user documents reached.')
    }

    // TODO: Regex to email validation

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      logger.warn(`[registerUser]: user with this email ${email} already exists`)

      res
        .status(400)
        .json({message: 'A user with this email already exists.'})

      return
    }

    const hash = await hashPassword(password)
    await createUser(email, hash)

    res
      .status(201)
      .json({message: 'The user has been successfully registered.'})
  } catch (error) {
    logger.error('A server error occurred during user registration.')

    next(error)
  }
}

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {email, password}: UserPros = req.body

    const user = await getUserByEmail(email)
    if (!user?._id) {
      logger.warn(`[loginUser]: user with this email ${email} does not exists`)

      res
        .status(401)
        .json({message: 'Invalid login details.'})

      return
    }

    const passwordMatch = await comparePassword(password, user.password)
    if (!passwordMatch) {
      logger.warn('[loginUser]: incorrect password')

      res
        .status(401)
        .json({message: 'Invalid login details.'})

      return
    }

    const {_id} = user
    const token = await createWebToken(_id)
    const refreshToken = await createRefreshToken(_id)
    await saveRefreshToken(_id, refreshToken)

    res
      .status(200)
      .json({token})
  } catch (error) {
    logger.error('A server error occurred during user login.')

    next(error)
  }
}

export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    logger.info('[verifyUser]: user verified')

    res
      .status(200)
      .json({
        message: 'Token verification successful'
      })
  } catch (error) {
    next(error)
  }
}
