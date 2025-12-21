import { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { fetchBookDetails, fetchBooks } from '@/services/booksService'
import { createRead } from '@/services/readsService'
import { useDebounce } from '@/hooks/useDebounce'
import { useNotification } from '@/app/providers/NotificationProvider'
import type { Book, BookDetails } from '@/types/books'
import type { PaginatedResponse } from '@/types/common'

export function useBooksViewModel() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 400)
  const queryClient = useQueryClient()
  const { notifyError, notifySuccess } = useNotification()

  const booksQuery = useQuery({
    queryKey: ['books', page, limit, debouncedSearch],
    queryFn: () => fetchBooks({ page, limit, q: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  })

  const detailsQuery = useQuery({
    queryKey: ['book-details', selectedId],
    queryFn: () => fetchBookDetails(selectedId ?? ''),
    enabled: Boolean(selectedId),
    staleTime: 1000 * 60 * 5,
  })

  const markAsReadMutation = useMutation({
    mutationFn: (payload: { externalId: string; note?: string; onSuccessClose?: () => void }) =>
      createRead({ externalId: payload.externalId, note: payload.note }),
    onSuccess: (_data, variables) => {
      notifySuccess('Livro marcado como lido')
      variables.onSuccessClose?.()
      queryClient.invalidateQueries({ queryKey: ['reads'] })
    },
    onError: (error: Error) => {
      notifyError(error.message ?? 'Não foi possível marcar como lido')
    },
  })

  const handlePageChange = useCallback((newPage: number) => setPage(newPage), [])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  const handleSelectBook = useCallback((externalId: string | null) => {
    setSelectedId(externalId)
  }, [])

  const books = useMemo(() => booksQuery.data as PaginatedResponse<Book> | undefined, [booksQuery.data])

  return {
    page,
    limit,
    search,
    books,
    isLoading: booksQuery.isLoading,
    isFetching: booksQuery.isFetching,
    handlePageChange,
    handleLimitChange,
    handleSearchChange,
    selectedId,
    selectBook: handleSelectBook,
    markAsRead: markAsReadMutation.mutateAsync,
    isMarking: markAsReadMutation.isPending,
    details: detailsQuery.data as BookDetails | undefined,
    isLoadingDetails: detailsQuery.isFetching,
  }
}

