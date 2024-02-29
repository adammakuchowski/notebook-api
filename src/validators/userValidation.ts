import {z} from 'zod'

export const userBodySchema = z.object({
  email: z.string().email({message: 'Email is required'}),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string'
  })
})
