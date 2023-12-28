import express from 'express'

import {
  createSampleData,
  getSampleData,
} from '../controllers/sampleController'

const router = express.Router()

router.get(
  '/getSampleData',
  getSampleData,
)

router.post(
  '/createSampleData',
  createSampleData,
)

export default router
