import { z } from 'zod'
import type { Book, BookDetails } from '@/types/books'
import type { ReadEntry } from '@/types/reads'
import type { PaginatedResponse } from '@/types/common'

const rawBookSchema = z.object({
  external_id: z.string().optional(),
  externalId: z.string().optional(),
  key: z.string().optional(),
  title: z.string(),
  author: z.string().nullable().optional(),
  author_name: z.string().nullable().optional(),
  cover: z.string().optional(),
  cover_url: z.string().optional(),
  coverUrl: z.string().optional(),
  cover_id: z.union([z.string(), z.number(), z.null()]).optional(),
  first_publish_year: z.union([z.coerce.number(), z.string(), z.null()]).optional(),
  firstPublishYear: z.union([z.coerce.number(), z.string(), z.null()]).optional(),
})

const rawBookDetailsSchema = rawBookSchema.extend({
  description: z.union([z.string(), z.object({ value: z.string() })]).optional(),
  subjects: z.array(z.string()).optional(),
  number_of_pages: z.number().optional(),
  pages: z.number().optional(),
})

const rawReadSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  read_id: z.union([z.string(), z.number()]).optional(),
  external_id: z.string(),
  title: z.string(),
  author: z.string().nullable().optional(),
  author_name: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
  created_at: z.string().optional(),
  createdAt: z.string().optional(),
  read_at: z.string().optional(),
  first_publish_year: z.union([z.coerce.number(), z.string(), z.null()]).optional(),
  cover_id: z.union([z.string(), z.number(), z.null()]).optional(),
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
    author: data.author ?? data.author_name ?? '',
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
    const fallback = raw as Record<string, unknown>
    const coverId = (fallback.cover_id as string | number | undefined) ?? undefined
    const cover =
      coverId !== undefined && coverId !== null
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : undefined

    return {
      id: (fallback.read_id ?? fallback.id ?? Date.now())?.toString(),
      externalId: (fallback.external_id as string) ?? (fallback.externalId as string) ?? '',
      title: (fallback.title as string) ?? 'Livro',
      author: (fallback.author as string) ?? (fallback.author_name as string) ?? undefined,
      note: (fallback.note as string) ?? undefined,
      createdAt:
        (fallback.read_at as string) ??
        (fallback.createdAt as string) ??
        (fallback.created_at as string) ??
        new Date().toISOString(),
      cover,
    }
  }

  const data = parsed.data
  const cover =
    data.cover_id !== undefined && data.cover_id !== null
      ? `https://covers.openlibrary.org/b/id/${data.cover_id}-M.jpg`
      : undefined

  return {
    id: (data.read_id ?? data.id)?.toString() ?? '',
    externalId: data.external_id,
    title: data.title,
    author: data.author ?? data.author_name ?? undefined,
    note: data.note ?? undefined,
    createdAt: data.read_at ?? data.createdAt ?? data.created_at,
    cover,
    firstPublishYear: data.first_publish_year ? Number(data.first_publish_year) : undefined,
  }
}

export function toPaginated<T>(
  raw: unknown,
  mapper: (item: unknown) => T,
): PaginatedResponse<T> {
  const fallback = (() => {
    const input = raw as Record<string, unknown>
    const items = (input.items as unknown[]) ?? (input.results as unknown[]) ?? []
    const limitRaw =
      (input.limit as number | string | undefined) ?? (input.per_page as number | string | undefined)
    const totalRaw =
      (input.total as number | string | undefined) ??
      (input.total_items as number | string | undefined) ??
      (input.count as number | string | undefined)
    const pageRaw = (input.page as number | string | undefined) ?? 1
    const totalPagesRaw =
      (input.totalPages as number | string | undefined) ??
      (input.total_pages as number | string | undefined)

    const limit = limitRaw !== undefined ? Number(limitRaw) : 10
    const total = totalRaw !== undefined ? Number(totalRaw) : items.length
    const page = pageRaw !== undefined ? Number(pageRaw) : 1
    const computedTotalPages =
      totalPagesRaw !== undefined
        ? Number(totalPagesRaw)
        : limit > 0
          ? Math.max(1, Math.ceil(total / limit))
          : 1

    return {
      items,
      page: Number.isFinite(page) ? page : 1,
      totalPages: Number.isFinite(computedTotalPages) ? computedTotalPages : 1,
      total: Number.isFinite(total) ? total : items.length,
      limit: Number.isFinite(limit) ? limit : 10,
    }
  })()

  const parsed = paginatedSchema.safeParse(raw)
  const base = parsed.success ? (parsed.data as z.infer<typeof paginatedSchema>) : fallback

  const page = Number.isFinite(base.page) ? base.page : fallback.page
  const limit = Number.isFinite(base.limit) ? base.limit : fallback.limit
  const total = Number.isFinite(base.total) && base.total > 0 ? base.total : fallback.total
  // Sempre prioriza totalPages calculado pelo fallback quando não vier do backend
  const totalPages =
    Number.isFinite(base.totalPages) && base.totalPages > 1 ? base.totalPages : fallback.totalPages

  return {
    items: (base.items ?? fallback.items).map(mapper),
    page: Number.isFinite(page) ? page : 1,
    totalPages: Math.max(1, Number(totalPages)),
    total: Number.isFinite(total) ? total : fallback.items.length,
    limit: Number.isFinite(limit) ? limit : 10,
  }
}

