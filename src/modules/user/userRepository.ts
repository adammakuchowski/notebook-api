import {UserModel} from '../../db/models/userModel'
import {Repository} from '../types'
import {User} from './types'

export class UserRepository implements Repository<User> {
  async findById(id: string, projection?: Record<string, unknown>): Promise<User | null> {
    const user = await UserModel.findOne({
      _id: id,
      deletedAt: {$eq: null},
    },
    projection,
  ).lean()

    return user
  }

  async findByField(field: string, value: unknown): Promise<User | null> {
    const user = await UserModel.findOne({[field]: value})

    return user
  }

  async create(userData: Pick<User, 'email' | 'password'>): Promise<User> {
    const newUser = new UserModel(userData)
    await newUser.save()

    return newUser
  }

  async update(
    id: string,
    userDelta: Record<string, unknown>,
  ): Promise<User | null> {
    const result = await UserModel.findByIdAndUpdate(id, userDelta)

    return result
  }

  async softDelete(ids: string[]): Promise<boolean> {
    const result = await UserModel.updateMany(
      {
        _id: {$in: ids},
      },
      {
        deletedAt: new Date(),
      },
    )

    return result.acknowledged
  }
}
