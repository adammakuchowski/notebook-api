import {z} from 'zod'

export const userSchema = z.object({
  email: z.string().email({message: 'Email is required'}),
  password: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Name must be a string'
  })
})
