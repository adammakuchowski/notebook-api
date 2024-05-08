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

export type KanbanColumn = {
  id: string
  title: string
  taskIds: string[]
}

export type KanbanTask = Pick<Task, 'id' | 'title'>

export type KanbanTasks = {
  tasks: Record<string, KanbanTask>
  columns: Record<string, KanbanColumn>
  columnOrder: string[]
}
