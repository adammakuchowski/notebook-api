import bcrypt from 'bcrypt'
import jwt, {JwtPayload} from 'jsonwebtoken'
import {Container} from 'typedi'

import {UserModel} from '../../../db/models/userModel'
import appConfig from '../../../configs/appConfig'
import {logger} from '../../../app'
import {User} from '../types'
import {KanbanTasks} from '../../task/types'
import {UserRepository} from '../userRepository'

export class UserService {
  private readonly userRepository

  constructor() {
    this.userRepository = Container.get(UserRepository)
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(id)

      return user
    } catch (error) {
      logger.error(`[getUserById]: ${(error as Error).message}`)

      throw new Error(
        'An error occurred while checking the existence of the user',
      )
    }
  }

  async getUserByField(field: string, value: unknown): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneByField(field, value)

      return user
    } catch (error) {
      logger.error(`[getUserByEmail]: ${(error as Error).message}`)

      throw new Error(
        'An error occurred while checking the existence of the user',
      )
    }
  }

  async createUser(email: string, hash: string): Promise<User> {
    try {
      const newUser = await this.userRepository.create({email, password: hash})
      logger.info(`[createUser]: user with email ${email} created`)

      return newUser
    } catch (error) {
      logger.error(`[createUser]: ${(error as Error).message}`)

      throw new Error('An error occurred during user registration')
    }
  }

  async hashPassword(password: string): Promise<string> {
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

  async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    try {
      const compareResulat = await bcrypt.compare(password, userPassword)

      return compareResulat
    } catch (error) {
      logger.error(`[comparePassword]: ${(error as Error).message}`)

      throw new Error('An error occurred while compare the user password')
    }
  }

  async createWebToken(id: string): Promise<string> {
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

  async createRefreshToken(id: string): Promise<string> {
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

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const {
        authorization: {saltRounds},
      } = appConfig
      const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds)

      await this.userRepository.update(userId, {
        refreshToken: hashedRefreshToken,
      })

      logger.info('Hashed refresh token saved successfully')
    } catch (error) {
      logger.error(`[saveRefreshToken]: ${(error as Error).message}`)

      throw new Error('Error saving hashed refresh token')
    }
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
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

  async compareRefreshToken(
    refreshToken: string,
    userRefreshToken: string,
  ): Promise<boolean> {
    try {
      const compareResulat = await bcrypt.compare(
        refreshToken,
        userRefreshToken,
      )

      return compareResulat
    } catch (error) {
      logger.error(`[compareRefreshToken]: ${(error as Error).message}`)

      throw new Error('An error occurred while compare the user password')
    }
  }

  async createEmptyKanbanTasks(userId: string): Promise<void> {
    try {
      const kanbanTasks: KanbanTasks = {
        tasks: {},
        columns: {
          1: {
            id: '1',
            title: 'To do',
            taskIds: [],
          },
          2: {
            id: '2',
            title: 'Blocked',
            taskIds: [],
          },
          3: {
            id: '3',
            title: 'In progess',
            taskIds: [],
          },
          4: {
            id: '4',
            title: 'Done',
            taskIds: [],
          },
        },
        columnOrder: ['1', '2', '3', '4'],
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
}
