export type Task = {
  id: string
  title: string
  description: string
  priority: string
  userId: string
  eventDate?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type CreateTaskBody = {
  task: Omit<Task, 'id'>,
  columnId: string
}

export type NewTaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'columnId'> & {
  userId?: string
}

export type KanbanColumn = {
  id: string
  title: string
  taskIds: string[]
}

export type KanbanTask = Pick<Task, 'id' | 'title' | 'priority'>

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
