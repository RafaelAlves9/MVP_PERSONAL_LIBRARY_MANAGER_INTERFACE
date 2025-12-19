import { useState } from 'react'
import NoteDialog from '@/components/NoteDialog'
import BooksView from './BooksView'
import { useBooksViewModel } from './BooksViewModel'

function BooksController() {
  const {
    page,
    limit,
    search,
    books,
    isLoading,
    isFetching,
    handleLimitChange,
    handlePageChange,
    handleSearchChange,
    selectedId,
    selectBook,
    markAsRead,
    isMarking,
    details,
    isLoadingDetails,
  } = useBooksViewModel()

  const [noteTarget, setNoteTarget] = useState<string | null>(null)

  const closeNoteDialog = () => setNoteTarget(null)

  const confirmNote = async (note?: string) => {
    if (!noteTarget) return
    try {
      await markAsRead({ externalId: noteTarget, note })
      setNoteTarget(null)
    } catch (error) {
      // Notificação já tratada pelo ViewModel
      console.error(error)
    }
  }

  return (
    <>
      <BooksView
        page={page}
        limit={limit}
        search={search}
        books={books?.items}
        totalPages={books?.totalPages ?? 1}
        totalItems={books?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        onSearchChange={handleSearchChange}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSeeDetails={selectBook}
        onMarkRead={(externalId) => setNoteTarget(externalId)}
        isDetailOpen={Boolean(selectedId)}
        selectedDetails={details}
        onCloseDetails={() => selectBook(null)}
        isLoadingDetails={isLoadingDetails}
      />

      <NoteDialog
        key={noteTarget ?? 'mark-read-dialog'}
        open={Boolean(noteTarget)}
        title="Adicionar nota e marcar como lido"
        confirmLabel={isMarking ? 'Salvando...' : 'Salvar'}
        onCancel={closeNoteDialog}
        defaultNote=""
        onSave={confirmNote}
      />
    </>
  )
}

export default BooksController

