import {z} from 'zod'

export const getTaskSchema = z.object({
  id: z.string({
    required_error: 'Task id is required',
    invalid_type_error: 'Task id must be a string',
  }),
})

export const createTaskSchema = z.object({
  task: z.object({
    title: z.string({
      required_error: 'Task title is required',
      invalid_type_error: 'Task title must be a string',
    }),
    description: z.string({
      required_error: 'Task description is required',
      invalid_type_error: 'Task description must be a string',
    }),
    priority: z.string({
      required_error: 'Task priority is required',
      invalid_type_error: 'Task priority must be a string',
    }),
    eventDate: z.coerce
      .date({invalid_type_error: 'Task eventDate must be a date'})
      .optional(),
  }),
  columnId: z.string({
    invalid_type_error: 'Task columnId must be a string',
  }),
})

export const updateTaskSchema = z.object({
  task: z.object({
    _id: z.string({
      required_error: 'Task _id is required',
      invalid_type_error: 'Task _id must be a string',
    }),
  }),
})

export const deleteTaskSchema = z.object({
  taskId: z.string({
    required_error: 'Task taskId is required',
    invalid_type_error: 'Task taskId must be a string',
  }),
})

export const updateKanbanTasksSchema = z.object({
  tasks: z.record(
    z.object({
      _id: z.string(),
      title: z.string(),
    }),
  ),
  columns: z.record(
    z.object({
      id: z.string(),
      title: z.string(),
      taskIds: z.array(z.string()),
    }),
  ),
  columnOrder: z.array(z.string()),
})

export const deleteColumnSchema = z.object({
  columnId: z.string({
    required_error: 'Property columnId is required',
    invalid_type_error: 'Property columnId must be a string',
  }),
})

export const createColumnSchema = z.object({
  title: z.string({
    required_error: 'Property title is required',
    invalid_type_error: 'Property title must be a string',
  }),
})

export const editColumnSchema = z.object({
  columnId: z.string({
    required_error: 'Property columnId is required',
    invalid_type_error: 'Property columnId must be a string',
  }),
  title: z.string({
    required_error: 'Property title is required',
    invalid_type_error: 'Property title must be a string',
  }),
})
