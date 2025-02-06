import mongoose, {ConnectOptions} from 'mongoose'

import appConfig from '../configs/appConfig'
import {logger} from '../app'

const getMongoOptions = (): ConnectOptions => {
  const {
    database: {name, user, password},
    env,
  } = appConfig

  return env === 'development'
    ? {dbName: name}
    : {dbName: name, user, pass: password}
}

const getMongoConfig = (): {
  uri: string
  options?: ConnectOptions
} => {
  const {
    database: {host, port},
  } = appConfig

  return {
    uri: `mongodb://${host}:${port}/`,
    options: getMongoOptions(),
  }
}

export const connectDB = async (): Promise<void> => {
  const {uri, options} = getMongoConfig()

  try {
    await mongoose.connect(uri, options)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error(`Error connecting to MongoDB:' ${(error as Error).message}`)
  }
}
