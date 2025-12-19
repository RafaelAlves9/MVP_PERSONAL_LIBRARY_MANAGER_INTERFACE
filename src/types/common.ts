export type PaginatedResponse<T> = {
  items: T[]
  page: number
  totalPages: number
  total: number
  limit: number
}

