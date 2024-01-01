import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {
  getNote,
  createNote
} from '../controllers/noteController'

const router = express.Router()

router.get(
  '/getNote',
  withAsyncHandler(getNote)
)

router.post(
  '/createNote',
  withAsyncHandler(createNote)
)

export default router
