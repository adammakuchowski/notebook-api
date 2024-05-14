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
  content,
  priority,
  userId,
  eventDate,
}: NewTaskData): Promise<Document> => {
  const newTaskModel = new TaskModel({
    title,
    content,
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

export const addTaskToUserKanban = async (
  taskId: string,
  title: string,
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
    tasks: {
      ...kanbanTasks.tasks,
      [taskId]: {
        id: taskId,
        title,
      },
    },
    columns: {
      ...kanbanTasks.columns,
      column1: {
        ...kanbanTasks.columns.column1,
        taskIds: [...kanbanTasks.columns.column1.taskIds, taskId],
      },
    },
  }

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
