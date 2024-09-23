export interface Repository<T> {
  findById: (id: string, projection?: Record<string, unknown>) => Promise<T | null>
  findAll?: () => Promise<T[]>
  create: (item: T) => Promise<T>
  update: (id: string, itemDelta: Record<string, unknown>) => Promise<T | null>
  softDelete: (ids: string[]) => Promise<boolean>
}
