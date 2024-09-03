import {Document} from 'mongoose'
import {taskProjection} from '../constatns'
import {KanbanColumn, KanbanTasks, NewTaskData, Task} from '../types'
import {TaskModel} from '../../../db/models/taskModel'
import {UserModel} from '../../../db/models/userModel'
import {User} from '../../user/types'
import {userKanbanTasksProjection} from '../../user/constatns'
import {removeObjectPropertyByKey} from '../../utils/objectUtils'

export const getTaskById = async (
  _id: string,
  userId: string,
): Promise<Task | null> => {
  const task = await TaskModel.findOne(
    {
      _id,
      userId,
      deletedAt: {$eq: null},
    },
    taskProjection,
  ).lean()

  return task
}

export const createNewTask = async ({
  title,
  description,
  priority,
  userId,
  eventDate,
}: NewTaskData): Promise<Document> => {
  const newTaskModel = new TaskModel({
    title,
    description,
    priority,
    userId,
    eventDate,
  })
  const newTask = await newTaskModel.save()

  return newTask
}

export const getKanbanTasksByUserId = async (
  userId: string,
): Promise<KanbanTasks> => {
  const user = await UserModel.findOne(
    {
      _id: userId,
      deletedAt: {$eq: null},
    },
    userKanbanTasksProjection,
  ).lean()

  if (!user) {
    throw new Error(`User with ID ${userId} is missing`)
  }

  const {kanbanTasks} = user

  return kanbanTasks
}

export const mapKanbanTasksMongoToBeautifulDnd = async (
  kanbanTasks: KanbanTasks,
): Promise<KanbanTasks> => {
  const {tasks: taskIds} = kanbanTasks

  const tasks = await TaskModel.find({
    _id: {$in: taskIds},
    deletedAt: {$eq: null},
  }).lean()

  const mappedKanbanTasks: KanbanTasks = {
    ...kanbanTasks,
    tasks: tasks.reduce(
      (newKanbanTasks, task) => ({
        ...newKanbanTasks,
        [task._id.toString()]: {
          _id: task._id.toString(),
          title: task.title,
          priority: task.priority,
        },
      }),
      {},
    ),
  }

  return mappedKanbanTasks
}

export const mapKanbanTasksBeautifulDndToMongo = (
  kanbanTasks: KanbanTasks,
): KanbanTasks => {
  const {tasks} = kanbanTasks

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: Object.keys(tasks),
  }

  return newKanbanTasks
}

export const updateKanbanTasksByUserId = async (
  userId: string,
  newKanbanTasks: KanbanTasks,
): Promise<User> => {
  const userWithUpdatedKanbanTasks = await UserModel.findByIdAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        kanbanTasks: newKanbanTasks,
      },
    },
    {
      new: true,
      lean: true,
    },
  )

  if (!userWithUpdatedKanbanTasks) {
    throw new Error(`Missing user by ID: ${userId}`)
  }

  return userWithUpdatedKanbanTasks
}

export const addTaskToUserKanban = async (
  taskId: string,
  userId: string,
  columnId: string,
): Promise<User> => {
  const user = await UserModel.findOne({
    _id: userId,
    deletedAt: {$eq: null},
  }).lean()

  if (!user) {
    throw new Error(`User with ID ${userId} is missing`)
  }

  const {kanbanTasks} = user

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: [...(kanbanTasks.tasks as string[]), taskId],
    columns: {
      ...kanbanTasks.columns,
      [columnId]: {
        ...kanbanTasks.columns[columnId],
        taskIds: [...kanbanTasks.columns[columnId].taskIds, taskId],
      },
    },
  }

  const userWithUpdatedKanbanTasks = await updateKanbanTasksByUserId(
    userId,
    newKanbanTasks,
  )

  return userWithUpdatedKanbanTasks
}

const filterRemovedTasks = (
  tasks: string[],
  tasksToRemove: string[],
): string[] => tasks.filter((task: string) => !tasksToRemove.includes(task))

export const removeColumnFromKanbanTasks = async (
  kanbanTasks: KanbanTasks,
  columnId: string,
): Promise<KanbanTasks> => {
  const {columns, columnOrder, tasks} = kanbanTasks

  const tasksToRemove = columns[columnId].taskIds
  const newTasks = filterRemovedTasks(tasks as string[], tasksToRemove)

  const newColumns = removeObjectPropertyByKey({...columns}, columnId)

  const newColumnOrder = columnOrder.filter((column) => column !== columnId)

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: [...newTasks],
    columns: {...(newColumns as Record<string, KanbanColumn>)},
    columnOrder: [...newColumnOrder],
  }

  return newKanbanTasks
}

export const deleteTaskByIds = async (
  TaskIdsToDelete: string[],
): Promise<void> => {
  await TaskModel.updateMany(
    {
      _id: {$in: TaskIdsToDelete},
    },
    {
      deletedAt: new Date(),
    },
  )
}

export const deleteTasksFromRemovedColumn = async (
  kanbanTasks: KanbanTasks,
  columnId: string,
): Promise<void> => {
  const {columns} = kanbanTasks
  const taskIdsToRemove = columns[columnId].taskIds

  await deleteTaskByIds(taskIdsToRemove)
}

const findColumnWithTask = (
  columns: Record<string, KanbanColumn>,
  taskId: string,
): KanbanColumn | undefined =>
  Object.values(columns).find((column) => column.taskIds.includes(taskId))

const updateColumnsAfterTaskRemoval = (
  columns: Record<string, KanbanColumn>,
  columnToRemoveTask: KanbanColumn,
  newColumnTasks: string[],
): Record<string, KanbanColumn> => ({
  ...columns,
  [columnToRemoveTask.id]: {
    ...columnToRemoveTask,
    taskIds: newColumnTasks,
  },
})

export const removeTaskFromKanbanTasks = async (
  kanbanTasks: KanbanTasks,
  taskId: string,
): Promise<KanbanTasks> => {
  const {columns, tasks} = kanbanTasks

  const columnToRemoveTask = findColumnWithTask(columns, taskId)
  if (!columnToRemoveTask) {
    throw new Error(`Task with ID ${taskId} is missing from any column`)
  }

  const newColumnTasks = filterRemovedTasks(columnToRemoveTask.taskIds, [
    taskId,
  ])
  const newColumns = updateColumnsAfterTaskRemoval(
    columns,
    columnToRemoveTask,
    newColumnTasks,
  )

  const newTasks = filterRemovedTasks(tasks as string[], [taskId])

  const newKanbanTasks = {
    ...kanbanTasks,
    tasks: [...newTasks],
    columns: {...newColumns},
  }

  return newKanbanTasks
}

export const getNewColumnId = (kanbanTasks: KanbanTasks): string => {
  const {columnOrder} = kanbanTasks

  let newColumnId = '0'

  for (let i = 0; i <= columnOrder.length; i++) {
    if (columnOrder.includes((i + 1).toString())) {
      continue
    }

    newColumnId = (i + 1).toString()
  }

  return newColumnId
}

export const addNewColumnToKanbanTasks = (
  kanbanTasks: KanbanTasks,
  newColumnId: string,
  title: string,
): KanbanTasks => {
  const {columns, columnOrder} = kanbanTasks

  const newColumns = {
    ...columns,
    [newColumnId]: {
      id: newColumnId,
      title,
      taskIds: [],
    },
  }

  const newKanbanTasks = {
    ...kanbanTasks,
    columns: {...(newColumns as Record<string, KanbanColumn>)},
    columnOrder: [...columnOrder, newColumnId],
  }

  return newKanbanTasks
}

export const getKanbanTasksWithUpdatedColumnName = (
  kanbanTasks: KanbanTasks,
  columnId: string,
  newTitle: string,
): KanbanTasks => {
  const {columns} = kanbanTasks
  const updatedColumn = columns[columnId]

  const newColumns = {
    ...columns,
    [columnId]: {
      ...updatedColumn,
      title: newTitle,
    },
  }

  const newKanbanTasks = {
    ...kanbanTasks,
    columns: {...(newColumns as Record<string, KanbanColumn>)},
  }

  return newKanbanTasks
}

export const updateTaskById = async (task: Task): Promise<Task> => {
  const {_id: taskId, title, description, priority, eventDate} = task

  const updatedTask = await TaskModel.findByIdAndUpdate(
    {
      _id: taskId,
    },
    {
      title,
      description,
      priority,
      eventDate,
    },
    {
      new: true,
      lean: true,
    },
  )

  if (!updatedTask) {
    throw new Error(`Missing task by ID: ${taskId}`)
  }

  return updatedTask
}
