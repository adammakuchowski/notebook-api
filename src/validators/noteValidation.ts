import {z} from 'zod'

export const noteParamsSchema = z.object({
  id: z.string({
    required_error: 'Note id is required',
    invalid_type_error: 'Note id must be a string'
  })
})

export const noteBodySchema = z.object({
  title: z.string({
    required_error: 'Note title is required',
    invalid_type_error: 'Note title must be a string'
  }),
  text: z.string({
    required_error: 'Note text is required',
    invalid_type_error: 'Note text must be a string'
  })
})
