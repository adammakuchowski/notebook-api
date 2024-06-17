import mongoose from 'mongoose'

import {KanbanColumn, KanbanTasks} from '../../modules/task/types'

const columnSchema = new mongoose.Schema<KanbanColumn>(
  {
    id: {type: String, required: true},
    title: {type: String, required: true},
    taskIds: [{type: String}],
    color: {type: String, required: true},
    icons: {
      iconLeft: {type: String, required: true},
      iconRight: {type: String, required: true},
    },
  },
  {_id: false},
)

export const kanbanTasksSchema = new mongoose.Schema<KanbanTasks>(
  {
    tasks: {
      type: [String],
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
