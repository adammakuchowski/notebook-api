import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {
  getNote,
  createNote,
  getAllNotes,
  deleteNote,
  softDeleteNote,
  editNote
} from '../controllers/noteController'
import {authenticateToken} from '../../../middlewares/auth'
import {validationRequest} from '../../../middlewares/validationRequest'
import {noteBodySchema, noteParamsSchema} from '../../../validators/noteValidation'

export const noteRouter = express.Router()

noteRouter.get(
  '/getNote/:id',
  authenticateToken,
  validationRequest(noteParamsSchema, 'params'),
  withAsyncHandler(getNote)
)

noteRouter.get(
  '/getAllNotes',
  authenticateToken,
  withAsyncHandler(getAllNotes)
)

noteRouter.post(
  '/createNote',
  authenticateToken,
  validationRequest(noteBodySchema, 'params'),
  withAsyncHandler(createNote)
)

noteRouter.put(
  '/editNote',
  authenticateToken,
  withAsyncHandler(editNote)
)

noteRouter.patch(
  '/softDeleteNote/:id',
  authenticateToken,
  withAsyncHandler(softDeleteNote)
)

noteRouter.delete(
  '/deleteNote/:id',
  authenticateToken,
  withAsyncHandler(deleteNote)
)
