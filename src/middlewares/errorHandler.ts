import {NextFunction, Request, Response} from 'express'

import {ErrorResponse} from '../interfaces/errorResponse'
import {logger} from '../app'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
): void => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  const {method, originalUrl} = req

  const responseBody = {
    method,
    originalUrl,
    message: err.message,
    stack: err.stack
  }

  logger.error(`Error: ${JSON.stringify(responseBody)}`)

  res
    .status(statusCode)
    .json(responseBody)
}

export default errorHandler
