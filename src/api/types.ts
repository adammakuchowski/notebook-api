export interface Repository<T> {
  create: (item: T) => Promise<T>
  update: (id: string, itemDelta: Record<string, unknown>) => Promise<T | null>
  findById: (id: string, projection?: Record<string, unknown>) => Promise<T | null>
  findAll: (filter: Record<string, unknown>, includeDeleted?: boolean) => Promise<T[]>
  softDelete: (ids: string[]) => Promise<boolean>
}
