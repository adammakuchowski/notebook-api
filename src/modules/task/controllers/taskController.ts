import {NextFunction, Response} from 'express'

import {logger} from '../../../app'
import {AuthRequest} from '../../user/types'
import {sendBadRequest} from '../../utils/responseUtils'
import {
  addNewColumnToKanbanTasks,
  addTaskToUserKanban,
  createNewTask,
  deleteTaskByIds,
  deleteTasksFromRemovedColumn,
  getKanbanTasksByUserId,
  getKanbanTasksWithUpdatedColumnName,
  getNewColumnId,
  getTaskById,
  mapKanbanTasksBeautifulDndToMongo,
  mapKanbanTasksMongoToBeautifulDnd,
  removeColumnFromKanbanTasks,
  removeTaskFromKanbanTasks,
  updateKanbanTasksByUserId,
  updateTaskById,
} from '../services/taskService'
import {
  CreateColumnBody,
  CreateTaskBody,
  DeleteColumnBody,
  DeleteTaskBody,
  EditColumnBody,
  UpdateKanbanTasksBody,
  UpdateTaskBody,
} from '../types'

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
    const {
      columnId,
      task: {title, description, priority, eventDate},
    }: CreateTaskBody = req.body

    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const newTaskData = await createNewTask({
      title,
      description,
      priority,
      userId,
      eventDate,
    })
    logger.info('[createTask] new task successfully created')

    const userWithUpdatedKanbanTasks = await addTaskToUserKanban(
      newTaskData.id as string,
      userId,
      columnId,
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

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {task}: UpdateTaskBody = req.body
    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const updatedTask = await updateTaskById(task)

    res.status(201).json(updatedTask)
  } catch (error: unknown) {
    logger.error(`[updateTask] error: ${(error as Error).message}`)

    next(error)
  }
}

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {_id: taskId}: DeleteTaskBody = req.body
    const userId = req.user?.id

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    // TODO: This should be in the transaction
    const kanbanTasks = await getKanbanTasksByUserId(userId)
  
    const updatedKanbanTasks = await removeTaskFromKanbanTasks(
      kanbanTasks,
      taskId,
    )

    const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
      userId,
      updatedKanbanTasks,
    )

    await deleteTaskByIds([taskId])

    res.status(201).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[deleteTask] error: ${(error as Error).message}`)

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
    const mappedKanbanTasks =
      await mapKanbanTasksMongoToBeautifulDnd(kanbanTasks)

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

    res.status(201).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[getKanbanTasks] error: ${(error as Error).message}`)

    next(error)
  }
}

export const deleteColumn = async (
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

    const kanbanTasks = await getKanbanTasksByUserId(userId)
    const updatedKanbanTasks = await removeColumnFromKanbanTasks(
      kanbanTasks,
      columnId,
    )
    const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
      userId,
      updatedKanbanTasks,
    )

    await deleteTasksFromRemovedColumn(kanbanTasks, columnId)

    res.status(201).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[deleteColumn] error: ${(error as Error).message}`)

    next(error)
  }
}

export const createColumn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const {title}: CreateColumnBody = req.body

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const kanbanTasks = await getKanbanTasksByUserId(userId)
    const newColumnId = getNewColumnId(kanbanTasks)
    const updatedKanbanTasks = addNewColumnToKanbanTasks(
      kanbanTasks,
      newColumnId,
      title,
    )

    const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
      userId,
      updatedKanbanTasks,
    )

    res.status(201).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[createColumn] error: ${(error as Error).message}`)

    next(error)
  }
}

export const editColumn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const {columnId, title}: EditColumnBody = req.body

    if (!userId) {
      sendBadRequest(res, 'Missing user ID')

      return
    }

    const kanbanTasks = await getKanbanTasksByUserId(userId)
    const updatedKanbanTasks = getKanbanTasksWithUpdatedColumnName(
      kanbanTasks,
      columnId,
      title,
    )

    const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
      userId,
      updatedKanbanTasks,
    )

    res.status(201).json(userWithUpdatedKanbanTasks)
  } catch (error: unknown) {
    logger.error(`[editColumn] error: ${(error as Error).message}`)

    next(error)
  }
}
