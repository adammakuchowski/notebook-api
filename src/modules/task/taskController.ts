import {NextFunction, Response} from 'express'

import {logger} from '../../app'
import {AuthRequest} from '../user/types'
import {sendBadRequest} from '../utils/responseUtils'
import {TaskService} from './services/taskService'
import {
  CreateColumnBody,
  CreateTaskBody,
  DeleteColumnBody,
  DeleteTaskBody,
  EditColumnBody,
  UpdateKanbanTasksBody,
  UpdateTaskBody,
} from './types'
import {Container} from 'typedi/Container'

export class TaskController {
  private readonly taskService

  constructor() {
    this.taskService = Container.get(TaskService)
  }

  async getTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {id} = req.params
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const task = await this.taskService.getTaskById(id)

      res.status(200).json(task)
    } catch (error: unknown) {
      logger.error(`[getTask] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async createTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        columnId,
        task: {title, description, priority, eventDate},
      }: CreateTaskBody = req.body

      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const newTask = await this.taskService.createTask({
        title,
        description,
        priority,
        userId,
        eventDate,
      })
      logger.info('[createTask] new task successfully created')

      // TO CHECK _id
      const userWithUpdatedKanbanTasks =
        await this.taskService.addTaskToUserKanban(
          newTask._id,
          userId,
          columnId,
        )
      logger.info('[createTask] user kanban tasks successfully updated')

      res.status(201).json({
        newTask,
        newKanbanTask: userWithUpdatedKanbanTasks.kanbanTasks,
      })
    } catch (error: unknown) {
      logger.error(`[createTask] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async updateTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {task}: UpdateTaskBody = req.body
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const updatedTask = await this.taskService.updateTaskById(task)

      res.status(201).json(updatedTask)
    } catch (error: unknown) {
      logger.error(`[updateTask] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async deleteTask(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {taskId}: DeleteTaskBody = req.body
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      // TODO: This should be in the transaction
      const kanbanTasks = await this.taskService.getKanbanTasksByUserId(userId)

      const updatedKanbanTasks =
        await this.taskService.removeTaskFromKanbanTasks(kanbanTasks, taskId)

      const userWithUpdatedKanbanTasks =
        await this.taskService.updateKanbanTasksByUserId(
          userId,
          updatedKanbanTasks,
        )

      await this.taskService.deleteTaskByIds([taskId])

      res.status(201).json(userWithUpdatedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[deleteTask] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async getKanbanTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const kanbanTasks = await this.taskService.getKanbanTasksByUserId(userId)
      const mappedKanbanTasks =
        await this.taskService.mapKanbanTasksMongoToBeautifulDnd(kanbanTasks)

      res.status(200).json(mappedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[getKanbanTasks] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async updateKanbanTasks(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id
      const kanbanTasks: UpdateKanbanTasksBody = req.body

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const mappedKanbanTasks =
        this.taskService.mapKanbanTasksBeautifulDndToMongo(kanbanTasks)
      const userWithUpdatedKanbanTasks =
        await this.taskService.updateKanbanTasksByUserId(
          userId,
          mappedKanbanTasks,
        )

      res.status(201).json(userWithUpdatedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[getKanbanTasks] error: ${(error as Error).message}`)

      next(error)
    }
  }

  deleteColumn = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.id
      const {columnId}: DeleteColumnBody = req.body

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const kanbanTasks = await this.taskService.getKanbanTasksByUserId(userId)
      const updatedKanbanTasks =
        await this.taskService.removeColumnFromKanbanTasks(
          kanbanTasks,
          columnId,
        )
      const userWithUpdatedKanbanTasks =
        await this.taskService.updateKanbanTasksByUserId(
          userId,
          updatedKanbanTasks,
        )

      await this.taskService.deleteTasksFromRemovedColumn(kanbanTasks, columnId)

      res.status(201).json(userWithUpdatedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[deleteColumn] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async createColumn(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id
      const {title}: CreateColumnBody = req.body

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const kanbanTasks = await this.taskService.getKanbanTasksByUserId(userId)
      const newColumnId = this.taskService.getNewColumnId(kanbanTasks)
      const updatedKanbanTasks = this.taskService.addNewColumnToKanbanTasks(
        kanbanTasks,
        newColumnId,
        title,
      )

      const userWithUpdatedKanbanTasks =
        await this.taskService.updateKanbanTasksByUserId(
          userId,
          updatedKanbanTasks,
        )

      res.status(201).json(userWithUpdatedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[createColumn] error: ${(error as Error).message}`)

      next(error)
    }
  }

  async editColumn(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user?.id
      const {columnId, title}: EditColumnBody = req.body

      if (!userId) {
        sendBadRequest(res, 'Missing user ID')

        return
      }

      const kanbanTasks = await this.taskService.getKanbanTasksByUserId(userId)
      const updatedKanbanTasks =
        this.taskService.getKanbanTasksWithUpdatedColumnName(
          kanbanTasks,
          columnId,
          title,
        )

      const userWithUpdatedKanbanTasks =
        await this.taskService.updateKanbanTasksByUserId(
          userId,
          updatedKanbanTasks,
        )

      res.status(201).json(userWithUpdatedKanbanTasks)
    } catch (error: unknown) {
      logger.error(`[editColumn] error: ${(error as Error).message}`)

      next(error)
    }
  }
}
