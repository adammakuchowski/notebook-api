import {Response} from 'express'

export const sendBadRequest = (res: Response, message: string): Response => res.status(400).json({message})
