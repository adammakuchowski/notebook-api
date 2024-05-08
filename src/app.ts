import express, {Request, Response} from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import winston from 'winston'

import appConfig from './configs/appConfig'
import corsOptions from './configs/corsConfig'
import loggerConfig from './configs/winstonConfig'

import errorHandler from './middlewares/errorHandler'
import notFound from './middlewares/notFoundHandler'
import {connectDB} from './db/db'
import {authRouter} from './modules/auth'
import {noteRouter} from './modules/note'
import {taskRouter} from './modules/task'

const {port} = appConfig
export const logger = winston.createLogger(loggerConfig)

connectDB()
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req: Request, res: Response): void => {
  res.send('Every day you must ask yourself: Did you do enough?')
})

app.use('/auth', authRouter)
app.use('/note', noteRouter)
app.use('/task', taskRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => {
  logger.info(`API is listening on port: ${port}`)
})

export default app
