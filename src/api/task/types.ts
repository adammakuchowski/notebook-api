export type Task = {
  _id: string
  title: string
  description: string
  priority: string
  userId: string
  eventDate?: Date
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

export type CreateTaskBody = {
  task: Omit<Task, '_id'>
  columnId: string
}

export type UpdateTaskBody = {
  task: Task
}

export type DeleteTaskBody = {
  taskId: string
}

export type NewTaskData = Omit<
  Task,
  '_id' | 'createdAt' | 'updatedAt' | 'columnId'
> & {
  userId?: string
}

export type KanbanColumn = {
  id: string
  title: string
  taskIds: string[]
}

export type KanbanTask = Pick<Task, '_id' | 'title' | 'priority'>

export type KanbanTasks = {
  tasks: Record<string, KanbanTask> | string[]
  columns: Record<string, KanbanColumn>
  columnOrder: string[]
}

export type UpdateKanbanTasksBody = KanbanTasks

export type DeleteColumnBody = {
  columnId: string
}

export type CreateColumnBody = {
  title: string
}

export type EditColumnBody = {
  columnId: string
  title: string
}
