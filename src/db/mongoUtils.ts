import {Model} from 'mongoose'

import {logger} from '../app'

export const canCreateDocument = async <T>(
  mongooseModel: Model<T>,
  limit: number,
  filters = {}
): Promise<boolean | undefined> => {
  try {
    if (!mongooseModel) {
      throw new Error('No mongoose model provided. Cannot proceed')
    }
    const documentsCount = await mongooseModel.countDocuments(filters)

    return !(documentsCount >= limit)
  } catch (error) {
    logger.error(`[canCreateDocument]:${(error as Error).message}`)
  }
}
