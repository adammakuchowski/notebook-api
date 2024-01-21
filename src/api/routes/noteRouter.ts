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

const router = express.Router()

router.get(
  '/getNote/:id',
  withAsyncHandler(getNote)
)

router.get(
  '/getAllNotes',
  withAsyncHandler(getAllNotes)
)

router.post(
  '/createNote',
  withAsyncHandler(createNote)
)

router.put(
  '/editNote',
  withAsyncHandler(editNote)
)

router.patch(
  '/softDeleteNote/:id',
  withAsyncHandler(softDeleteNote)
)

router.delete(
  '/deleteNote/:id',
  withAsyncHandler(deleteNote)
)

export default router
