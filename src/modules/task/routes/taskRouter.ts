import express from 'express'
import withAsyncHandler from 'express-async-handler'

import {authenticateToken} from '../../../middlewares/auth'
import {validationRequest} from '../../../middlewares/validationRequest'
import {
  deleteColumnSchema,
  updateKanbanTasksSchema,
  createTaskSchema,
  getTaskSchema,
  createColumnSchema,
  editColumnSchema,
  updateTaskSchema,
} from '../../../validators/taskValidation'
import {
  createColumn,
  createTask,
  deleteColumn,
  editColumn,
  getKanbanTasks,
  getTask,
  updateKanbanTasks,
  updateTask,
} from '../controllers/taskController'

export const taskRouter = express.Router()

taskRouter.get(
  '/getTask/:id',
  authenticateToken,
  validationRequest(getTaskSchema, 'params'),
  withAsyncHandler(getTask),
)

taskRouter.post(
  '/createTask',
  authenticateToken,
  validationRequest(createTaskSchema),
  withAsyncHandler(createTask),
)

taskRouter.post(
  '/updateTask',
  authenticateToken,
  validationRequest(updateTaskSchema),
  withAsyncHandler(updateTask),
)

taskRouter.get(
  '/getKanbanTasks',
  authenticateToken,
  withAsyncHandler(getKanbanTasks),
)

taskRouter.put(
  '/updateKanbanTasks',
  authenticateToken,
  validationRequest(updateKanbanTasksSchema),
  withAsyncHandler(updateKanbanTasks),
)

taskRouter.put(
  '/deleteColumn',
  authenticateToken,
  validationRequest(deleteColumnSchema),
  withAsyncHandler(deleteColumn),
)

taskRouter.put(
  '/createColumn',
  authenticateToken,
  validationRequest(createColumnSchema),
  withAsyncHandler(createColumn),
)

taskRouter.put(
  '/editColumn',
  authenticateToken,
  validationRequest(editColumnSchema),
  withAsyncHandler(editColumn),
)
