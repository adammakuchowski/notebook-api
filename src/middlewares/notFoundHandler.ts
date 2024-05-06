import {NextFunction, Request, Response} from 'express'

const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404)
  const error = new Error(`Not Found: ${req.originalUrl}`)

  next(error)
}

export default notFound
