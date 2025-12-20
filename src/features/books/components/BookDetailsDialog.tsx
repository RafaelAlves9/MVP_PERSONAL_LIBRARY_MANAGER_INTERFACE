import type { BookDetails } from '@/types/books'
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material'

type Props = {
  open: boolean
  book?: BookDetails
  isLoading: boolean
  onClose: () => void
}

function BookDetailsDialog({ open, book, isLoading, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{book?.title ?? 'Detalhes do livro'}</DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <Stack alignItems="center" py={3}>
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && book && (
          <Stack spacing={2}>
            <Typography variant="subtitle1" color="text.secondary">
              {book.author ?? 'Autor não informado'}
            </Typography>
            <Divider />
            {book.description && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {book.description}
              </Typography>
            )}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {book.subjects?.slice(0, 10).map((subject) => (
                <Chip key={subject} label={subject} size="small" variant="outlined" />
              ))}
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {book.pages && (
                <Chip label={`${book.pages} páginas`} size="small" color="secondary" variant="outlined" />
              )}
              {book.firstPublishYear && (
                <Chip
                  label={`Publicado em ${book.firstPublishYear}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookDetailsDialog

