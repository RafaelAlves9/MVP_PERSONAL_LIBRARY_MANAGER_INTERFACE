import type { Book, BookDetails } from '@/types/books'
import { BookCard } from './components'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import SearchInput from '@/components/common/SearchInput'
import PaginationBar from '@/components/common/PaginationBar'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import BookDetailsDialog from './components/BookDetailsDialog'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { IconButton } from '@mui/material'

type Props = {
  page: number
  limit: number
  search: string
  totalPages: number
  totalItems: number
  books?: Book[]
  isLoading: boolean
  isFetching: boolean
  onSearchChange: (value: string) => void
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  onSeeDetails: (id: string) => void
  onMarkRead: (id: string) => void
  isDetailOpen: boolean
  selectedDetails?: BookDetails
  onCloseDetails: () => void
  isLoadingDetails: boolean
}

function BooksView({
  page,
  limit,
  search,
  totalPages,
  totalItems,
  books,
  isLoading,
  isFetching,
  onSearchChange,
  onPageChange,
  onLimitChange,
  onSeeDetails,
  onMarkRead,
  isDetailOpen,
  selectedDetails,
  onCloseDetails,
  isLoadingDetails,
}: Props) {
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (delta: number) => {
    const node = sliderRef.current
    if (!node) return
    node.scrollBy({ left: delta, behavior: 'smooth' })
  }

  return (
    <Stack spacing={3}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent>
            <Stack spacing={1.5}>
              <Typography variant="overline" color="primary">
                Biblioteca pessoal
              </Typography>
              <Typography variant="h4">Explore e acompanhe suas leituras</Typography>
              <Typography variant="body2" color="text.secondary">
                Busque títulos na OpenLibrary, visualize detalhes e marque como lido com suas notas
                personalizadas.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 1 }}>
                <Box>
                  <Typography variant="h5">{totalItems}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    livros encontrados
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h5">{limit}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    por página
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <SearchInput value={search} onChange={onSearchChange} placeholder="Busque por título ou autor" />
            <PaginationBar
              page={page}
              totalPages={totalPages}
              limit={limit}
              onLimitChange={onLimitChange}
              onPageChange={onPageChange}
            />
          </Stack>
        </CardContent>
      </Card>

      {isLoading && <LoadingState message="Buscando livros na OpenLibrary..." />}

      {!isLoading && books && books.length > 0 && (
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Resultados</Typography>
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
            {books.map((book) => (
              <BookCard
                key={book.externalId}
                book={book}
                onSeeDetails={onSeeDetails}
                onMarkRead={onMarkRead}
              />
            ))}
          </Box>
        </Stack>
      )}

      {!isLoading && books && books.length === 0 && (
        <EmptyState title="Nenhum livro encontrado" description="Tente refinar a busca ou mudar os filtros." />
      )}

      {isFetching && !isLoading && <LoadingState message="Atualizando resultados..." />}

      <BookDetailsDialog
        open={isDetailOpen}
        book={selectedDetails}
        isLoading={isLoadingDetails}
        onClose={onCloseDetails}
        onMarkRead={onMarkRead}
      />
    </Stack>
  )
}

export default BooksView

