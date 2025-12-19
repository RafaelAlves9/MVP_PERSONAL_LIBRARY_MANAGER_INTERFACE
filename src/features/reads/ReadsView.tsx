import { ReadEntry } from '@/types/reads'
import { Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import PaginationBar from '@/components/common/PaginationBar'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import { ReadCard } from './components'

type Props = {
  page: number
  perPage: number
  totalPages: number
  totalItems: number
  reads?: ReadEntry[]
  isLoading: boolean
  isFetching: boolean
  onPageChange: (page: number) => void
  onPerPageChange: (perPage: number) => void
  onEditNote: (entry: ReadEntry) => void
  onRemove: (id: string) => void
}

function ReadsView({
  page,
  perPage,
  totalPages,
  totalItems,
  reads,
  isLoading,
  isFetching,
  onPageChange,
  onPerPageChange,
  onEditNote,
  onRemove,
}: Props) {
  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="overline" color="secondary">
              Leituras concluídas
            </Typography>
            <Typography variant="h4">Suas notas e observações</Typography>
            <Typography variant="body2" color="text.secondary">
              Revise rapidamente o que você já leu, atualize comentários e mantenha o histórico
              sincronizado com o backend local.
            </Typography>
            <Stack direction="row" spacing={3} pt={1}>
              <Stack spacing={0.5}>
                <Typography variant="h5">{totalItems}</Typography>
                <Typography variant="body2" color="text.secondary">
                  livros lidos
                </Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="h5">{perPage}</Typography>
                <Typography variant="body2" color="text.secondary">
                  por página
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <PaginationBar
            page={page}
            totalPages={totalPages}
            limit={perPage}
            onLimitChange={onPerPageChange}
            onPageChange={onPageChange}
          />
        </CardContent>
      </Card>

      {isLoading && <LoadingState message="Carregando leituras salvas..." />}

      {!isLoading && reads && reads.length > 0 && (
        <Grid container spacing={2}>
          {reads.map((entry) => (
            <Grid key={entry.id} size={{ xs: 12, sm: 6 }}>
              <ReadCard entry={entry} onEditNote={onEditNote} onRemove={onRemove} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && reads && reads.length === 0 && (
        <EmptyState title="Nenhum livro marcado como lido" description="Marque leituras no catálogo para vê-las aqui." />
      )}

      {isFetching && !isLoading && <LoadingState message="Atualizando leituras..." />}
    </Stack>
  )
}

export default ReadsView

