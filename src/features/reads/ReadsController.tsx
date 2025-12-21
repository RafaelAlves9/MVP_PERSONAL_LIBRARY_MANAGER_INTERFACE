import { useState } from 'react'
import NoteDialog from '@/components/NoteDialog'
import ConfirmDialog from '@/components/ConfirmDialog'
import type { ReadEntry } from '@/types/reads'
import { useReadsViewModel } from './ReadsViewModel'
import ReadsView from './ReadsView'
import BookDetailsDialog from '@/features/books/components/BookDetailsDialog'
import { useQuery } from '@tanstack/react-query'
import { fetchBookDetails } from '@/services/booksService'

function ReadsController() {
  const {
    page,
    perPage,
    reads,
    isLoading,
    isFetching,
    handlePageChange,
    handlePerPageChange,
    updateNote,
    isUpdating,
    remove,
  } = useReadsViewModel()

  const [editTarget, setEditTarget] = useState<ReadEntry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReadEntry | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)

  const detailsQuery = useQuery({
    queryKey: ['book-details', detailId],
    queryFn: () => fetchBookDetails(detailId ?? ''),
    enabled: Boolean(detailId),
    staleTime: 1000 * 60 * 5,
  })

  const handleSaveNote = async (note?: string) => {
    if (!editTarget) return
    try {
      await updateNote({ id: editTarget.id, note: note ?? '' })
      setEditTarget(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleRemove = async (id: string) => {
    try {
      await remove(id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <ReadsView
        page={page}
        perPage={perPage}
        reads={reads?.items}
        totalPages={reads?.totalPages ?? 1}
        totalItems={reads?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        onEditNote={(entry) => setEditTarget(entry)}
        onRemove={(id) => {
          const target = reads?.items.find((item) => item.id === id) ?? null
          setDeleteTarget(target)
        }}
        onSeeDetails={(externalId) => setDetailId(externalId)}
      />

      <NoteDialog
        key={editTarget?.id ?? 'edit-read-dialog'}
        open={Boolean(editTarget)}
        title="Editar observação"
        confirmLabel={isUpdating ? 'Salvando...' : 'Salvar'}
        defaultNote={editTarget?.note ?? ''}
        onCancel={() => setEditTarget(null)}
        onSave={handleSaveNote}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remover da lista de lidos?"
        description="Essa ação exclui o registro salvo localmente. Você poderá marcar novamente depois."
        confirmLabel="Remover"
        cancelLabel="Cancelar"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleRemove(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
      />

      <BookDetailsDialog
        open={Boolean(detailId)}
        book={detailsQuery.data}
        isLoading={detailsQuery.isFetching}
        onClose={() => setDetailId(null)}
        onMarkRead={() => {
          if (detailId) {
            setEditTarget({ id: detailId, externalId: detailId, title: '', author: '' })
          }
        }}
        note={reads?.items.find((item) => item.externalId === detailId)?.note}
        onEditNote={() => {
          const target = reads?.items.find((item) => item.externalId === detailId)
          if (target) setEditTarget(target)
        }}
      />
    </>
  )
}

export default ReadsController

