import mongoose from 'mongoose'

import {KanbanTask, KanbanColumn, KanbanTasks} from '../../modules/task/types'

const taskSchema = new mongoose.Schema<KanbanTask>(
  {
    id: {type: String, required: true},
    title: {type: String, required: true},
  },
  {_id: false},
)

const columnSchema = new mongoose.Schema<KanbanColumn>(
  {
    id: {type: String, required: true},
    title: {type: String, required: true},
    taskIds: [{type: String}],
  },
  {_id: false},
)

export const kanbanTasksSchema = new mongoose.Schema<KanbanTasks>(
  {
    tasks: {
      type: Map,
      of: taskSchema,
      required: true,
    },
    columns: {
      type: Map,
      of: columnSchema,
    },
    columnOrder: [{type: String, required: true}],
  },
  {_id: false},
)
