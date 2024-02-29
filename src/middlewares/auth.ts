import {Request, Response, NextFunction} from 'express'
import jwt, {JwtPayload, VerifyErrors} from 'jsonwebtoken'

import appConfig from '../configs/appConfig'

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader = req.header('Authorization')
  const {authorization: {secretKey}} = appConfig

  if (!authorizationHeader) {
    res.status(401).json({message: 'Access denied - missing JWT token'})

    return
  }

  const token = authorizationHeader.replace('Bearer ', '')

  jwt.verify(token, secretKey, (err: VerifyErrors | null, user?: JwtPayload | string) => {
    if (err) {
      res.status(403).json({message: 'Invalid JWT token'})

      return
    }
    req.user = user

    next()
  })
}
