import express from 'express'

import {
  getNote,
  createNote,
} from '../controllers/noteController'

const router = express.Router()

router.get(
  '/getNote',
  getNote,
)

router.post(
  '/createNote',
  createNote,
)

export default router
