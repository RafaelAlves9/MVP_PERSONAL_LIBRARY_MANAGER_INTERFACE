import { Book, BookDetails } from '@/types/books'
import { BookCard } from './components'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import SearchInput from '@/components/common/SearchInput'
import PaginationBar from '@/components/common/PaginationBar'
import LoadingState from '@/components/common/LoadingState'
import EmptyState from '@/components/common/EmptyState'
import BookDetailsDialog from './components/BookDetailsDialog'
import { motion } from 'framer-motion'

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
        <Grid container spacing={2}>
          {books.map((book) => (
            <Grid key={book.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
              <BookCard
                book={book}
                onSeeDetails={onSeeDetails}
                onMarkRead={onMarkRead}
              />
            </Grid>
          ))}
        </Grid>
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
      />
    </Stack>
  )
}

export default BooksView

