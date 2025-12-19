import { httpClient } from './httpClient'
import { Book, BookDetails } from '@/types/books'
import { PaginatedResponse } from '@/types/common'
import { toBook, toBookDetails, toPaginated } from './schemas'

export type BooksQuery = {
  page: number
  limit: number
  q?: string
}

export async function fetchBooks(params: BooksQuery): Promise<PaginatedResponse<Book>> {
  const safeLimit = Math.min(Math.max(params.limit, 1), 50)
  const response = await httpClient.get('/books', {
    params: { page: params.page, limit: safeLimit, q: params.q },
  })

  const payload = response.data?.data ?? response.data
  return toPaginated(payload, toBook)
}

export async function fetchBookDetails(externalId: string): Promise<BookDetails> {
  const response = await httpClient.get(`/books/${externalId}`)
  const payload = response.data?.data ?? response.data
  return toBookDetails(payload)
}

