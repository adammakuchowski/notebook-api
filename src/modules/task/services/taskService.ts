import {Document} from 'mongoose'

import {taskProjection} from '../constatns'
import {NewTaskData, Task} from '../types'
import {TaskModel} from '../../../db/models/taskModel'

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
