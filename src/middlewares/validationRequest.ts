import {Request, Response, NextFunction} from 'express'
import {z} from 'zod'

import {logger} from '../app'

export const validationRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.body) {
      const error = 'Invalid body'

      logger.error(error)
      return res.status(400).json({
        error
      })
    }

    const result = schema.safeParse(req.body)

    if (!result.success) {
      const error = result.error.issues.map((issue) => issue.message).join(', ')

      logger.error(error)

      return res
        .status(400)
        .json({error})
    }

    next()
  }
}
