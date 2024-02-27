import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

import appConfig from '../configs/appConfig'

interface User {
  id: string;
  [key: string]: unknown;
}

interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.header('Authorization')
  const {authorization: {secretKey}} = appConfig

  if (!authorizationHeader) {
    res.status(401).json({message: 'Access denied - missing JWT token.'})

    return
  }

  const token = authorizationHeader.replace('Bearer ', '')

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({message: 'Invalid JWT token.'})
    }
    req.user = user

    next()
  })
}
