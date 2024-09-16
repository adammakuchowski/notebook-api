export interface Repository<T> {
  findById: (id: string) => Promise<T | null>
  findAll: () => Promise<T[]>
  create: (item: T) => Promise<T>
  update: (id: string, item: T) => Promise<T | null>
  delete: (id: string) => Promise<boolean>
}
