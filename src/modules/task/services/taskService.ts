import {Container} from 'typedi/Container'
import {NewTaskData, Task} from '../types'
import {TaskRepository} from '../taskRepository'
import {UserRepository} from '../../user/userRepository'

export class TaskService {
  private readonly taskRepository
  private readonly userRepository

  constructor() {
    this.taskRepository = Container.get(TaskRepository)
    this.userRepository = Container.get(UserRepository)
  }

  async getTaskById(_id: string): Promise<Task | null> {
    const task = await this.taskRepository.findById(_id)

    return task
  }

  async createTask({
    title,
    description,
    priority,
    userId,
    eventDate,
  }: NewTaskData): Promise<Task> {
    const newTask = await this.taskRepository.create({
      title,
      description,
      priority,
      userId,
      eventDate,
    })

    return newTask
  }

  async updateTaskById(task: Task): Promise<Task> {
    const {_id: taskId, title, description, priority, eventDate} = task

    const updatedTask = await this.taskRepository.update(taskId, {
      title,
      description,
      priority,
      eventDate,
    },)

    if (!updatedTask) {
      throw new Error(`Missing task by ID: ${taskId}`)
    }

    return updatedTask
  }

  async deleteTaskByIds(taskIdsToDelete: string[]): Promise<void> {
    await this.taskRepository.softDelete(taskIdsToDelete)
  }
}
