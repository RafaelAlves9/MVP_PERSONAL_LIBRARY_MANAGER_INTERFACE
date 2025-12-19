import { httpClient } from './httpClient'
import { PaginatedResponse } from '@/types/common'
import { ReadEntry } from '@/types/reads'
import { toPaginated, toReadEntry } from './schemas'

export type ReadsQuery = {
  page: number
  perPage: number
}

export type CreateReadPayload = {
  externalId: string
  note?: string
}

export type UpdateReadPayload = {
  id: string
  note: string
}

export async function fetchReads(params: ReadsQuery): Promise<PaginatedResponse<ReadEntry>> {
  const safePerPage = Math.min(Math.max(params.perPage, 1), 50)
  const response = await httpClient.get('/reads', {
    params: { page: params.page, per_page: safePerPage },
  })

  const payload = response.data?.data ?? response.data
  return toPaginated(payload, toReadEntry)
}

export async function createRead(payload: CreateReadPayload): Promise<ReadEntry> {
  const response = await httpClient.post('/reads', {
    external_id: payload.externalId,
    note: payload.note,
  })
  const data = response.data?.data ?? response.data
  return toReadEntry(data)
}

export async function updateRead(payload: UpdateReadPayload): Promise<ReadEntry> {
  const response = await httpClient.put(`/reads/${payload.id}`, { note: payload.note })
  const data = response.data?.data ?? response.data
  return toReadEntry(data)
}

export async function deleteRead(id: string): Promise<void> {
  await httpClient.delete(`/reads/${id}`)
}

