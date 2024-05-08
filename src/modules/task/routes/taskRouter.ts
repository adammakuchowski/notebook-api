import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {authenticateToken} from '../../../middlewares/auth'
import {validationRequest} from '../../../middlewares/validationRequest'
import {
  taskBodySchema,
  taskParamsSchema,
} from '../../../validators/taskValidation'
import {createTask, getTask} from '../controllers/taskController'

export const taskRouter = express.Router()

taskRouter.get(
  '/getTask/:id',
  authenticateToken,
  validationRequest(taskParamsSchema, 'params'),
  withAsyncHandler(getTask),
)

taskRouter.post(
  '/createTask',
  authenticateToken,
  validationRequest(taskBodySchema),
  withAsyncHandler(createTask),
)
