import bcrypt from 'bcrypt'
import jwt, {JwtPayload} from 'jsonwebtoken'

import {UserModel} from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {logger} from '../../../app'
import {User} from '../types'
import {KanbanTasks} from '../../task/types'

export const getUserByField = async (
  field: string,
  value: unknown,
): Promise<User | null> => {
  try {
    const user = await UserModel.findOne({[field]: value})

    return user
  } catch (error) {
    logger.error(`[getUserByEmail]: ${(error as Error).message}`)

    throw new Error(
      'An error occurred while checking the existence of the user',
    )
  }
}

export const createUser = async (
  email: string,
  hash: string,
): Promise<User> => {
  try {
    const newUser = new UserModel({email, password: hash})
    await newUser.save()

    logger.info(`[createUser]: user with email ${email} created`)
    return newUser
  } catch (error) {
    logger.error(`[createUser]: ${(error as Error).message}`)

    throw new Error('An error occurred during user registration')
  }
}

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const {
      authorization: {saltRounds},
    } = appConfig
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    return hashedPassword
  } catch (error) {
    logger.error(`[hashPassword]: ${(error as Error).message}`)

    throw new Error('An error occurred while hashing the password')
  }
}

export const comparePassword = async (
  password: string,
  userPassword: string,
): Promise<boolean> => {
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
    const {
      authorization: {secretKey},
    } = appConfig

    return jwt.sign({id}, secretKey, {expiresIn: '1h'})
  } catch (error) {
    logger.error(`[createWebToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while create the json web tekon')
  }
}

export const createRefreshToken = async (id: string): Promise<string> => {
  try {
    const {
      authorization: {secretKey},
    } = appConfig

    return jwt.sign({id}, secretKey, {expiresIn: '7d'})
  } catch (error) {
    logger.error(`[createRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while create the json refresh tekon')
  }
}

export const saveRefreshToken = async (
  userId: string,
  refreshToken: string,
): Promise<void> => {
  try {
    const {
      authorization: {saltRounds},
    } = appConfig
    const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds)

    await UserModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    })

    logger.info('Hashed refresh token saved successfully')
  } catch (error) {
    logger.error(`[saveRefreshToken]: ${(error as Error).message}`)

    throw new Error('Error saving hashed refresh token')
  }
}

export const verifyRefreshToken = async (
  refreshToken: string,
): Promise<JwtPayload> => {
  try {
    const {
      authorization: {secretKey},
    } = appConfig
    const data = jwt.verify(refreshToken, secretKey) as JwtPayload

    return data
  } catch (error) {
    logger.error(`[verifyRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while verify the json refresh tekon')
  }
}

export const compareRefreshToken = async (
  refreshToken: string,
  userRefreshToken: string,
): Promise<boolean> => {
  try {
    const compareResulat = await bcrypt.compare(refreshToken, userRefreshToken)

    return compareResulat
  } catch (error) {
    logger.error(`[compareRefreshToken]: ${(error as Error).message}`)

    throw new Error('An error occurred while compare the user password')
  }
}

export const createEmptyKanbanTasks = async (userId: string): Promise<void> => {
  try {
    const kanbanTasks: KanbanTasks = {
      tasks: {},
      columns: {
        column1: {
          id: 'column1',
          title: 'toDo',
          taskIds: [],
          color: '#E4F1FC',
          icons: {
            iconLeft: 'ab2',
            iconRight: 'dots'
          }
        },
        column2: {
          id: 'column2',
          title: 'blocked',
          taskIds: [],
          color: '#00ff00',
          icons: {
            iconLeft: 'iconPlayerPause',
            iconRight: 'dots'
          }
        },
        column3: {
          id: 'column3',
          title: 'inProgess',
          taskIds: [],
          color: '#FF3333',
          icons: {
            iconLeft: 'iconRun',
            iconRight: 'dots'
          }
        },
        column4: {
          id: 'column4',
          title: 'done',
          taskIds: [],
          color: '#808080',
          icons: {
            iconLeft: 'iconFileCheck',
            iconRight: 'dots'
          }
        },
      },
      columnOrder: ['column1', 'column2', 'column3', 'column4'],
    }

    await UserModel.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          kanbanTasks,
        },
      },
      {
        new: true,
        lean: true,
      },
    )

    logger.info(
      `[createEmptyKanbanTasks]: empty kanban tasks for user ${userId} created`,
    )
  } catch (error) {
    logger.error(`[createEmptyKanbanTasks]: ${(error as Error).message}`)

    throw new Error('An error occurred during create empty kanban tasks')
  }
}
