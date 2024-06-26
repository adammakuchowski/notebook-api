import mongoose from 'mongoose'

import {Task} from '../../modules/task/types'

const taskSchema = new mongoose.Schema<Task>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    priority: {
      type: String,
    },
    userId: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export const TaskModel = mongoose.model<Task>('Task', taskSchema, 'tasks')
