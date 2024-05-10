import {Response, NextFunction} from 'express'
import {z} from 'zod'

import {logger} from '../app'
import {AuthRequest} from '../modules/user/types'

type RequestKeys = 'body' | 'params' | 'query'

export const validationRequest = (
  schema: z.ZodSchema,
  key: RequestKeys = 'body',
) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const dataToValidate = req[key]

    if (!dataToValidate) {
      const error = 'Invalid body'

      logger.error(error)
      return res.status(400).json({
        error,
      })
    }

    const result = schema.safeParse(dataToValidate)

    if (!result.success) {
      const error = result.error.issues.map((issue) => issue.message).join(', ')

      logger.error(error)

      return res.status(400).json({error})
    }

    next()
  }
}
