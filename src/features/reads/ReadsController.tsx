import { useState } from 'react'
import NoteDialog from '@/components/NoteDialog'
import { ReadEntry } from '@/types/reads'
import { useReadsViewModel } from './ReadsViewModel'
import ReadsView from './ReadsView'

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
    const confirmed = window.confirm('Remover este item da lista de lidos?')
    if (!confirmed) return
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
        onRemove={handleRemove}
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
    </>
  )
}

export default ReadsController

