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

export const noteRouter = express.Router()

noteRouter.get(
  '/getNote/:id',
  withAsyncHandler(getNote)
)

noteRouter.get(
  '/getAllNotes',
  withAsyncHandler(getAllNotes)
)

noteRouter.post(
  '/createNote',
  withAsyncHandler(createNote)
)

noteRouter.put(
  '/editNote',
  withAsyncHandler(editNote)
)

noteRouter.patch(
  '/softDeleteNote/:id',
  withAsyncHandler(softDeleteNote)
)

noteRouter.delete(
  '/deleteNote/:id',
  withAsyncHandler(deleteNote)
)
