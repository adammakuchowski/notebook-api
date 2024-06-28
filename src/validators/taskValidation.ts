import {z} from 'zod'

export const taskParamsSchema = z.object({
  id: z.string({
    required_error: 'Task id is required',
    invalid_type_error: 'Task id must be a string',
  }),
})

export const taskBodySchema = z.object({
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
})

export const kanbanTasksSchema = z.object({
  tasks: z.record(
    z.object({
      id: z.string(),
      title: z.string(),
    }),
  ),
  columns: z.record(
    z.object({
      id: z.string(),
      title: z.string(),
      taskIds: z.array(z.string()),
      color: z.string(),
      icons: z.object({
        iconLeft: z.string(),
        iconRight: z.string(),
      }),
    }),
  ),
  columnOrder: z.array(z.string()),
})
