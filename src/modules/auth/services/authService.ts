import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import UserModel, {User} from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {logger} from '../../../app'

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const existingUser = await UserModel.findOne({email})

    return existingUser
  } catch (error) {
    logger.error(`[getUserByEmail]: ${(error as Error).message}`)
    throw new Error('An error occurred while checking the existence of the user.')
  }
}

export const createUser = async (email: string, hash: string): Promise<void> => {
  try {
    const newUser = new UserModel({email, password: hash})
    await newUser.save()

    logger.info(`[createUser]: user with email ${email} created`)
  } catch (error) {
    logger.error(`[createUser]: ${(error as Error).message}`)
    throw new Error('An error occurred during user registration.')
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const {authorization: {saltRounds}} = appConfig

    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return hashedPassword
  } catch (error) {
    logger.error(`[hashPassword]: ${(error as Error).message}`)
    throw new Error('An error occurred while hashing the password.')
  }
}

export const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
  try {
    const compareResulat = await bcrypt.compare(password, userPassword)

    return compareResulat
  } catch (error) {
    logger.error(`[comparePassword]: ${(error as Error).message}`)
    throw new Error('An error occurred while compare the user password.')
  }
}

export const createWebToken = async (id: string): Promise<string> => {
  try {
    const {authorization: {secretKey}} = appConfig

    return jwt.sign({id}, secretKey, {expiresIn: '1h'})
  } catch (error) {
    logger.error(`[createWebToken]: ${(error as Error).message}`)
    throw new Error('An error occurred while create the json web tekon.')
  }
}
