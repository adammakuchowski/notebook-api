import express, {Request, Response, NextFunction} from 'express'
import withAsyncHandler from 'express-async-handler'

import {NoteController} from './noteController'
import {authenticateToken} from '../../middlewares/auth'
import {validationRequest} from '../../middlewares/validationRequest'
import {noteBodySchema, noteParamsSchema} from '../../validators/noteValidation'

export const noteRouter = express.Router()

noteRouter.get(
  '/getNote/:id',
  authenticateToken,
  validationRequest(noteParamsSchema, 'params'),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new NoteController().getNote(req, res, next)
  }),
)

noteRouter.get(
  '/getAllNotes',
  authenticateToken,
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new NoteController().getAllNotes(req, res, next)
  }),
)

noteRouter.post(
  '/createNote',
  authenticateToken,
  validationRequest(noteBodySchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new NoteController().createNote(req, res, next)
  }),
)

noteRouter.put(
  '/editNote',
  authenticateToken,
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new NoteController().editNote(req, res, next)
  }),
)

noteRouter.delete(
  '/deleteNote/:id',
  authenticateToken,
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new NoteController().deleteNote(req, res, next)
  }),
)
