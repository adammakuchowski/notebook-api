import {TaskModel} from '../../db/models/taskModel'
import {Repository} from '../types'
import {NewTaskData, Task} from './types'

export class TaskRepository implements Repository<Task> {
  async findById(id: string): Promise<Task | null> {
    const task = await TaskModel.findOne({
      _id: id,
      deletedAt: {$eq: null},
    }).lean()

    return task
  }

  async findByField(field: string, value: unknown): Promise<Task | null> {
    const task = await TaskModel.findOne({[field]: value})

    return task
  }

  async findAllByField(field: string, values: unknown[]): Promise<Task[]> {
    const tasks = await TaskModel.find({[field]: {$in: values}})

    return tasks
  }

  async create(taskData: NewTaskData): Promise<Task> {
    const newTask = new TaskModel(taskData)
    await newTask.save()

    return newTask
  }

  async update(
    id: string,
    taskDelta: Record<string, unknown>,
  ): Promise<Task | null> {
    const result = await TaskModel.findByIdAndUpdate(id, taskDelta)

    return result
  }

  async softDelete(ids: string[]): Promise<boolean> {
    const result = await TaskModel.updateMany(
      {
        _id: {$in: ids},
      },
      {
        deletedAt: new Date(),
      },
    )

    return result.acknowledged
  }
}
