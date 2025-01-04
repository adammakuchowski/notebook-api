import {Container} from 'typedi/Container'
import {KanbanColumn, KanbanTasks} from '../types'
import {User} from '../../user/types'
import {userKanbanTasksProjection} from '../../user/constatns'
import {removeObjectPropertyByKey} from '../../utils/objectUtils'
import {TaskRepository} from '../taskRepository'
import {UserRepository} from '../../user/userRepository'
import {TaskService} from './taskService'

export class KanbanService {
  private readonly taskRepository
  private readonly userRepository
  private readonly taskService

  constructor() {
    this.taskRepository = Container.get(TaskRepository)
    this.userRepository = Container.get(UserRepository)

    this.taskService = Container.get(TaskService)
  }

  async getKanbanTasksByUserId(userId: string): Promise<KanbanTasks> {
    const user = await this.userRepository.findById(
      userId,
      userKanbanTasksProjection,
    )

    if (!user) {
      throw new Error(`User with ID ${userId} is missing`)
    }

    const {kanbanTasks} = user

    return kanbanTasks
  }

  async mapKanbanTasksMongoToBeautifulDnd(
    kanbanTasks: KanbanTasks,
  ): Promise<KanbanTasks> {
    const {tasks: taskIds} = kanbanTasks

    const tasks = await this.taskRepository.findAll({
      _id: {$in: taskIds as string[]},
    })

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

  async removeTaskFromKanbanTasks(
    kanbanTasks: KanbanTasks,
    taskId: string,
  ): Promise<KanbanTasks> {
    const {columns, tasks} = kanbanTasks

    const columnToRemoveTask = this.findColumnWithTask(columns, taskId)
    if (!columnToRemoveTask) {
      throw new Error(`Task with ID ${taskId} is missing from any column`)
    }

    const newColumnTasks = this.filterRemovedTasks(columnToRemoveTask.taskIds, [
      taskId,
    ])

    const newColumns = this.updateColumnsAfterTaskRemoval(
      columns,
      columnToRemoveTask,
      newColumnTasks,
    )

    const newTasks = this.filterRemovedTasks(tasks as string[], [taskId])

    const newKanbanTasks = {
      ...kanbanTasks,
      tasks: [...newTasks],
      columns: {...newColumns},
    }

    return newKanbanTasks
  }

  findColumnWithTask(
    columns: Record<string, KanbanColumn>,
    taskId: string,
  ): KanbanColumn | undefined {
    return Object.values(columns).find((column) =>
      column.taskIds.includes(taskId),
    )
  }

  filterRemovedTasks(tasks: string[], tasksToRemove: string[]): string[] {
    return tasks.filter((task: string) => !tasksToRemove.includes(task))
  }

  updateColumnsAfterTaskRemoval(
    columns: Record<string, KanbanColumn>,
    columnToRemoveTask: KanbanColumn,
    newColumnTasks: string[],
  ): Record<string, KanbanColumn> {
    return {
      ...columns,
      [columnToRemoveTask.id]: {
        ...columnToRemoveTask,
        taskIds: newColumnTasks,
      },
    }
  }

  mapKanbanTasksBeautifulDndToMongo = (
    kanbanTasks: KanbanTasks,
  ): KanbanTasks => {
    const {tasks} = kanbanTasks

    const newKanbanTasks = {
      ...kanbanTasks,
      tasks: Object.keys(tasks),
    }

    return newKanbanTasks
  }

  async updateKanbanTasksByUserId(
    userId: string,
    newKanbanTasks: KanbanTasks,
  ): Promise<User> {
    const userWithUpdatedKanbanTasks = await this.userRepository.update(
      userId,
      {
        kanbanTasks: newKanbanTasks,
      },
    )

    if (!userWithUpdatedKanbanTasks) {
      throw new Error(`Missing user by ID: ${userId}`)
    }

    return userWithUpdatedKanbanTasks
  }

  async addTaskToUserKanban(
    taskId: string,
    userId: string,
    columnId: string,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId)

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

    const userWithUpdatedKanbanTasks = await this.updateKanbanTasksByUserId(
      userId,
      newKanbanTasks,
    )

    return userWithUpdatedKanbanTasks
  }

  async removeColumnFromKanbanTasks(
    kanbanTasks: KanbanTasks,
    columnId: string,
  ): Promise<KanbanTasks> {
    const {columns, columnOrder, tasks} = kanbanTasks

    const tasksToRemove = columns[columnId].taskIds
    const newTasks = this.filterRemovedTasks(tasks as string[], tasksToRemove)

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

  async deleteTasksFromRemovedColumn(
    kanbanTasks: KanbanTasks,
    columnId: string,
  ): Promise<void> {
    const {columns} = kanbanTasks
    const taskIdsToRemove = columns[columnId].taskIds

    await this.taskService.deleteTaskByIds(taskIdsToRemove)
  }

  getNewColumnId(kanbanTasks: KanbanTasks): string {
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

  addNewColumnToKanbanTasks(
    kanbanTasks: KanbanTasks,
    newColumnId: string,
    title: string,
  ): KanbanTasks {
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

  getKanbanTasksWithUpdatedColumnName(
    kanbanTasks: KanbanTasks,
    columnId: string,
    newTitle: string,
  ): KanbanTasks {
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
}
