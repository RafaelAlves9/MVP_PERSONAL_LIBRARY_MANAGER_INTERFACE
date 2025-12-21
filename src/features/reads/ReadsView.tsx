import type { ReadEntry } from '@/types/reads'
import { Card, CardContent, Stack, Typography, Box, IconButton } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useRef } from 'react'
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
  onSeeDetails: (externalId: string) => void
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
  onSeeDetails,
}: Props) {
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (delta: number) => {
    const node = sliderRef.current
    if (!node) return
    node.scrollBy({ left: delta, behavior: 'smooth' })
  }

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
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Leituras</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={() => scrollBy(-360)} aria-label="Anterior">
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => scrollBy(360)} aria-label="Próximo">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Box
            ref={sliderRef}
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: '240px',
              gap: 1.5,
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                height: 8,
                backgroundColor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(167,139,250,0.35))',
                borderRadius: 999,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
              '& > *': { scrollSnapAlign: 'start' },
            }}
          >
            {reads.map((entry) => (
              <ReadCard
                key={entry.id}
                entry={entry}
                onRemove={onRemove}
                onSeeDetails={onSeeDetails}
              />
            ))}
          </Box>
        </Stack>
      )}

      {!isLoading && reads && reads.length === 0 && (
        <EmptyState title="Nenhum livro marcado como lido" description="Marque leituras no catálogo para vê-las aqui." />
      )}

      {isFetching && !isLoading && <LoadingState message="Atualizando leituras..." />}
    </Stack>
  )
}

export default ReadsView

