import {NextFunction, Response} from 'express'

import {logger} from '../../../app'
import {AuthRequest} from '../../user/types'
import {sendBadRequest} from '../../utils/response'
import {
  addTaskToUserKanban,
  createNewTask,
  getKanbanTasksByUserId,
  getTaskById,
  mapKanbanTasksBeautifulDndToMongo,
  mapKanbanTasksMongoToBeautifulDnd,
  updateKanbanTasksByUserId,
} from '../services/taskService'
import {CreateTaskBody, UpdateKanbanTasksBody} from '../types'

export const getTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {id} = req.params
    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const task = await getTaskById(id, userId)

    res.status(200).json(task)
  } catch (error: unknown) {
    logger.error(`[getTask] error: ${(error as Error).message}`)

    next(error)
  }
}

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {title, content, priority, eventDate}: CreateTaskBody = req.body
    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const newTaskData = await createNewTask({
      title,
      content,
      priority,
      userId,
      eventDate,
    })
    logger.info('[createTask] new task successfully created')

    const userWithUpdatedKanbanTasks = await addTaskToUserKanban(
      newTaskData.id as string,
      userId,
    )
    logger.info('[createTask] user kanban tasks successfully updated')

    res.status(201).json({
      newTaskData,
      newKanbanTask: userWithUpdatedKanbanTasks.kanbanTasks,
    })
  } catch (error: unknown) {
    logger.error(`[createTask] error: ${(error as Error).message}`)

    next(error)
  }
}

export const getKanbanTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const kanbanTasks = await getKanbanTasksByUserId(userId)
    const mappedKanbanTasks = await mapKanbanTasksMongoToBeautifulDnd(kanbanTasks)

    res.status(200).json(mappedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[getKanbanTasks] error: ${(error as Error).message}`)

    next(error)
  }
}

export const updateKanbanTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const kanbanTasks: UpdateKanbanTasksBody = req.body

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const mappedKanbanTasks = mapKanbanTasksBeautifulDndToMongo(kanbanTasks)
    const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
      userId,
      mappedKanbanTasks,
    )

    res.status(200).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[getKanbanTasks] error: ${(error as Error).message}`)

    next(error)
  }
}
