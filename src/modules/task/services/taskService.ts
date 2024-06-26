import {Document} from 'mongoose'

import {taskProjection} from '../constatns'
import {KanbanTasks, NewTaskData, Task} from '../types'
import {TaskModel} from '../../../db/models/taskModel'
import {UserModel} from '../../../db/models/userModel'
import {User} from '../../user/types'
import {userKanbanTasksProjection} from '../../user/constatns'

export const getTaskById = async (
  _id: string,
  userId: string,
): Promise<Task | null> => {
  const task = await TaskModel.findOne(
    {
      _id,
      userId,
      deletedAt: {$eq: null},
    },
    taskProjection,
  ).lean()

  return task
}

export const createNewTask = async ({
  title,
  description,
  priority,
  userId,
  eventDate,
}: NewTaskData): Promise<Document> => {
  const newTaskModel = new TaskModel({
    title,
    description,
    priority,
    userId,
    eventDate,
  })
  const newTask = await newTaskModel.save()

  return newTask
}

export const getKanbanTasksByUserId = async (
  userId: string,
): Promise<KanbanTasks> => {
  const user = await UserModel.findOne(
    {
      _id: userId,
      deletedAt: {$eq: null},
    },
    userKanbanTasksProjection,
  ).lean()

  if (!user) {
    throw new Error(`User with ID ${userId} is missing`)
  }

  const {kanbanTasks} = user

  return kanbanTasks
}

export const mapKanbanTasksMongoToBeautifulDnd = async (
  kanbanTasks: KanbanTasks,
): Promise<KanbanTasks> => {
  const {tasks: taskIds} = kanbanTasks

  const tasks = await TaskModel.find({
    _id: {$in: taskIds},
    deletedAt: {$eq: null},
  }).lean()

  const mappedKanbanTasks: KanbanTasks = {
    ...kanbanTasks,
    tasks: tasks.reduce(
      (newKanbanTasks, task) => ({
        ...newKanbanTasks,
        [task._id.toString()]: {
          id: task._id.toString(),
          title: task.title,
          priority: task.priority,
        },
      }),
      {},
    ),
  }

  return mappedKanbanTasks
}

export const mapKanbanTasksBeautifulDndToMongo = (kanbanTasks: KanbanTasks): KanbanTasks => {
  const {tasks} = kanbanTasks

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: Object.keys(tasks),
  }

  return newKanbanTasks
}

export const updateKanbanTasksByUserId = async (
  userId: string,
  newKanbanTasks: KanbanTasks,
): Promise<User> => {
  const userWithUpdatedKanbanTasks = await UserModel.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        kanbanTasks: newKanbanTasks,
      },
    },
    {
      new: true,
      lean: true,
    },
  )

  if (!userWithUpdatedKanbanTasks) {
    throw new Error(`Missing user by ID: ${userId}`)
  }

  return userWithUpdatedKanbanTasks
}

export const addTaskToUserKanban = async (
  taskId: string,
  userId: string,
): Promise<User> => {
  const user = await UserModel.findOne({
    _id: userId,
    deletedAt: {$eq: null},
  }).lean()

  if (!user) {
    throw new Error(`User with ID ${userId} is missing`)
  }

  const {kanbanTasks} = user

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: [...(kanbanTasks.tasks as string[]), taskId],
    columns: {
      ...kanbanTasks.columns,
      column1: {
        ...kanbanTasks.columns.column1,
        taskIds: [...kanbanTasks.columns.column1.taskIds, taskId],
      },
    },
  }

  const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
    userId,
    newKanbanTasks,
  )

  return userWithUpdatedKanbanTasks
}
