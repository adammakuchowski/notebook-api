import bcrypt from 'bcrypt'
import jwt, {JwtPayload} from 'jsonwebtoken'

import UserModel from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {logger} from '../../../app'
import {User} from '../types/auth'

export const getUserByField = async (field: string, value: unknown): Promise<User | null> => {
  try {
    const user = await UserModel.findOne({[field]: value})

    return user
  } catch (error) {
    logger.error(`[getUserByEmail]: ${(error as Error).message}`)

    throw new Error('An error occurred while checking the existence of the user')
  }
}

export const createUser = async (email: string, hash: string): Promise<void> => {
  try {
    const newUser = new UserModel({email, password: hash})
    await newUser.save()

    logger.info(`[createUser]: user with email ${email} created`)
  } catch (error) {
    logger.error(`[createUser]: ${(error as Error).message}`)

    throw new Error('An error occurred during user registration')
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const {authorization: {saltRounds}} = appConfig
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return hashedPassword
  } catch (error) {
    logger.error(`[hashPassword]: ${(error as Error).message}`)

    throw new Error('An error occurred while hashing the password')
  }
}

export const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
  try {
    const compareResulat = await bcrypt.compare(password, userPassword)

    return compareResulat
  } catch (error) {
    logger.error(`[comparePassword]: ${(error as Error).message}`)

    throw new Error('An error occurred while compare the user password')
  }
}

export const createWebToken = async (id: string): Promise<string> => {
  try {
    const {authorization: {secretKey}} = appConfig

    return jwt.sign({id}, secretKey, {expiresIn: '1h'})
  } catch (error) {
    logger.error(`[createWebToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while create the json web tekon')
  }
}

export const createRefreshToken = async (id: string): Promise<string> => {
  try {
    const {authorization: {secretKey}} = appConfig

    return jwt.sign({id}, secretKey, {expiresIn: '7d'})
  } catch (error) {
    logger.error(`[createRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while create the json refresh tekon')
  }
}

export const saveRefreshToken = async (userId: string, refreshToken: string): Promise<void> => {
  try {
    const {authorization: {saltRounds}} = appConfig
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds)

    await UserModel.findByIdAndUpdate(userId, {refreshToken: hashedRefreshToken})

    logger.info('Hashed refresh token saved successfully')
  } catch (error) {
    logger.error(`[saveRefreshToken]: ${(error as Error).message}`)

    throw new Error('Error saving hashed refresh token')
  }
}

export const verifyRefreshToken = async (refreshToken: string): Promise<JwtPayload> => {
  try {
    const {authorization: {secretKey}} = appConfig
    const data = jwt.verify(refreshToken, secretKey) as JwtPayload

    return data
  } catch (error) {
    logger.error(`[verifyRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while verify the json refresh tekon')
  }
}

export const compareRefreshToken = async (refreshToken: string, userRefreshToken: string): Promise<boolean> => {
  try {
    const compareResulat = await bcrypt.compare(refreshToken, userRefreshToken)

    return compareResulat
  } catch (error) {
    logger.error(`[compareRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while compare the user password')
  }
}
