import { useCallback, useMemo, useState } from 'react'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteRead, fetchReads, updateRead, UpdateReadPayload } from '@/services/readsService'
import { useNotification } from '@/app/providers/NotificationProvider'
import { PaginatedResponse } from '@/types/common'
import { ReadEntry } from '@/types/reads'

export function useReadsViewModel() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const queryClient = useQueryClient()
  const { notifyError, notifySuccess } = useNotification()

  const readsQuery = useQuery({
    queryKey: ['reads', page, perPage],
    queryFn: () => fetchReads({ page, perPage }),
    placeholderData: keepPreviousData,
  })

  const updateNoteMutation = useMutation({
    mutationFn: (payload: UpdateReadPayload) => updateRead(payload),
    onSuccess: () => {
      notifySuccess('Observação atualizada')
      queryClient.invalidateQueries({ queryKey: ['reads'] })
    },
    onError: (error: Error) => notifyError(error.message),
  })

  const removeReadMutation = useMutation({
    mutationFn: (id: string) => deleteRead(id),
    onSuccess: () => {
      notifySuccess('Removido da lista de lidos')
      queryClient.invalidateQueries({ queryKey: ['reads'] })
    },
    onError: (error: Error) => notifyError(error.message),
  })

  const handlePageChange = useCallback((newPage: number) => setPage(newPage), [])

  const handlePerPageChange = useCallback((value: number) => {
    setPerPage(value)
    setPage(1)
  }, [])

  const reads = useMemo(
    () => readsQuery.data as PaginatedResponse<ReadEntry> | undefined,
    [readsQuery.data],
  )

  return {
    page,
    perPage,
    reads,
    isLoading: readsQuery.isLoading,
    isFetching: readsQuery.isFetching,
    handlePageChange,
    handlePerPageChange,
    updateNote: updateNoteMutation.mutateAsync,
    isUpdating: updateNoteMutation.isPending,
    remove: removeReadMutation.mutateAsync,
    isRemoving: removeReadMutation.isPending,
  }
}

