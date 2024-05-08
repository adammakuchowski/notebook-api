import {NextFunction, Response} from 'express'

import {logger} from '../../../app'
import {AuthRequest} from '../../auth/types'
import {sendBadRequest} from '../../utils/response'
import {createNewTask, getTaskById} from '../services/taskService'
import {CreateTaskBody} from '../types'

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

    console.log(userId)

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

    res.status(201).json(newTaskData)
  } catch (error: unknown) {
    logger.error(`[createTask] error: ${(error as Error).message}`)

    next(error)
  }
}
