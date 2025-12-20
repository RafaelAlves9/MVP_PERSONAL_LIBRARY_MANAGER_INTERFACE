import { z } from 'zod'
import type { Book, BookDetails } from '@/types/books'
import type { ReadEntry } from '@/types/reads'
import type { PaginatedResponse } from '@/types/common'

const rawBookSchema = z.object({
  external_id: z.string().optional(),
  externalId: z.string().optional(),
  key: z.string().optional(),
  title: z.string(),
  author: z.string().optional(),
  author_name: z.string().optional(),
  cover: z.string().optional(),
  cover_url: z.string().optional(),
  coverUrl: z.string().optional(),
  cover_id: z.union([z.string(), z.number()]).optional(),
  first_publish_year: z.union([z.coerce.number(), z.string()]).optional(),
  firstPublishYear: z.union([z.coerce.number(), z.string()]).optional(),
})

const rawBookDetailsSchema = rawBookSchema.extend({
  description: z.union([z.string(), z.object({ value: z.string() })]).optional(),
  subjects: z.array(z.string()).optional(),
  number_of_pages: z.number().optional(),
  pages: z.number().optional(),
})

const rawReadSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  external_id: z.string(),
  title: z.string(),
  author: z.string().optional(),
  note: z.string().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
})

const paginatedSchema = z.object({
  items: z.array(z.unknown()),
  page: z.number().default(1),
  totalPages: z.number().default(1),
  total: z.number().default(0),
  limit: z.number().default(10),
})

function extractDescription(value?: string | { value?: string }) {
  if (!value) return undefined
  if (typeof value === 'string') return value
  return value.value
}

export function toBook(raw: unknown): Book {
  const parsed = rawBookSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error('Resposta de livro inválida')
  }

  const data = parsed.data

  return {
    externalId: data.external_id ?? data.externalId ?? data.key ?? '',
    title: data.title,
    author: data.author ?? data.author_name,
    cover:
      data.cover ??
      data.cover_url ??
      data.coverUrl ??
      (data.cover_id ? `https://covers.openlibrary.org/b/id/${data.cover_id}-M.jpg` : undefined),
    firstPublishYear: data.firstPublishYear ?? data.first_publish_year,
  }
}

export function toBookDetails(raw: unknown): BookDetails {
  const parsed = rawBookDetailsSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error('Resposta de detalhes inválida')
  }

  const data = parsed.data

  return {
    ...toBook(data),
    description: extractDescription(data.description),
    subjects: data.subjects,
    pages: data.pages ?? data.number_of_pages,
  }
}

export function toReadEntry(raw: unknown): ReadEntry {
  const parsed = rawReadSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error('Resposta de leitura inválida')
  }

  const data = parsed.data

  return {
    id: data.id,
    externalId: data.external_id,
    title: data.title,
    author: data.author,
    note: data.note,
    createdAt: data.createdAt ?? data.created_at,
  }
}

export function toPaginated<T>(
  raw: unknown,
  mapper: (item: unknown) => T,
): PaginatedResponse<T> {
  const container = paginatedSchema.safeParse(raw).success
    ? (raw as z.infer<typeof paginatedSchema>)
    : (() => {
        const fallback = raw as Record<string, unknown>
        const items = (fallback.items as unknown[]) ?? (fallback.results as unknown[]) ?? []
        const limit = (fallback.limit as number) ?? (fallback.per_page as number) ?? 10
        const total = (fallback.total as number) ?? (fallback.total_items as number) ?? items.length
        const totalPages =
          (fallback.totalPages as number) ??
          (fallback.total_pages as number) ??
          (limit > 0 ? Math.max(1, Math.ceil(total / limit)) : 1)

        return {
          items,
          page: (fallback.page as number) ?? 1,
          totalPages,
          total,
          limit,
        }
      })()

  return {
    items: container.items.map(mapper),
    page: container.page ?? 1,
    totalPages: container.totalPages ?? 1,
    total: container.total ?? container.items.length,
    limit: container.limit ?? 10,
  }
}

