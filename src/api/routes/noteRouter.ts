import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {
  getNote,
  createNote,
  getAllNotes
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

export default router
