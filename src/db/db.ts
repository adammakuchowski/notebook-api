import mongoose, {ConnectOptions} from 'mongoose'

import appConfig from '../configs/appConfig'
import {logger} from '../app'

const {database: {host, port, name, mongoUrl}} = appConfig
const DB_URL = mongoUrl ?? `mongodb://${host}:${port}/${name}`

export const connectDB = async (): Promise<void> => {
  const dbOptions: ConnectOptions = {}

  try {
    await mongoose.connect(DB_URL, dbOptions)
    logger.info('Connected to MongoDB')
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB:' ${error.message}`)
  }
}
