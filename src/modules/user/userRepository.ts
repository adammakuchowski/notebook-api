import {UserModel} from '../../db/models/userModel'
import {User} from './types'

// export class UserRepository implements Repository<User> {
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findOne({
      _id: id,
      deletedAt: {$eq: null},
    }).lean()

    return user
  }

  async findByField(field: string, value: unknown): Promise<User | null> {
    const user = await UserModel.findOne({[field]: value})

    return user
  }

  //   async findAll(): Promise<User[]> {}

  async create(userData: Pick<User, 'email' | 'password'>): Promise<User> {
    const {email, password} = userData

    const newUser = new UserModel({email, password})
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

  //   async delete(id: string): Promise<boolean> {}
}
