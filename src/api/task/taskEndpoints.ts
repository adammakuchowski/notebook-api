import express, {NextFunction, Request, Response} from 'express'
import withAsyncHandler from 'express-async-handler'

import {authenticateToken} from '../../middlewares/auth'
import {validationRequest} from '../../middlewares/validationRequest'
import {
  deleteColumnSchema,
  updateKanbanTasksSchema,
  createTaskSchema,
  getTaskSchema,
  createColumnSchema,
  editColumnSchema,
  updateTaskSchema,
  deleteTaskSchema,
} from '../../validators/taskValidation'
import {TaskController} from './taskController'

export const taskRouter = express.Router()

taskRouter.get(
  '/getTask/:id',
  authenticateToken,
  validationRequest(getTaskSchema, 'params'),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().getTask(req, res, next)
  }),
)



taskRouter.post(
  '/createTask',
  authenticateToken,
  validationRequest(createTaskSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().createTask(req, res, next)
  }),
)

taskRouter.post(
  '/updateTask',
  authenticateToken,
  validationRequest(updateTaskSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().updateTask(req, res, next)
  }),
)

taskRouter.post(
  '/deleteTask',
  authenticateToken,
  validationRequest(deleteTaskSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().deleteTask(req, res, next)
  }),
)

taskRouter.get(
  '/getKanbanTasks',
  authenticateToken,
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().getKanbanTasks(req, res, next)
  }),
)

taskRouter.put(
  '/updateKanbanTasks',
  authenticateToken,
  validationRequest(updateKanbanTasksSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().updateKanbanTasks(req, res, next)
  }),
)

taskRouter.put(
  '/deleteColumn',
  authenticateToken,
  validationRequest(deleteColumnSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().deleteColumn(req, res, next)
  }),
)

taskRouter.put(
  '/createColumn',
  authenticateToken,
  validationRequest(createColumnSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().createColumn(req, res, next)
  }),
)

taskRouter.put(
  '/editColumn',
  authenticateToken,
  validationRequest(editColumnSchema),
  withAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await new TaskController().editColumn(req, res, next)
  }),
)
