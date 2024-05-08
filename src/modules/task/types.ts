export type Task = {
  id: string
  title: string
  content: string
  priority: string
  userId: string
  eventDate?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type CreateTaskBody = Omit<Task, 'id'>

export type NewTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  userId?: string
}
