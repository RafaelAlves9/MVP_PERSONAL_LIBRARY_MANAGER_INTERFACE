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
  Button,
  Fade,
} from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  open: boolean
  book?: BookDetails
  isLoading: boolean
  onClose: () => void
  onMarkRead: (externalId: string) => void
  note?: string
  onEditNote?: () => void
}

function BookDetailsDialog({
  open,
  book,
  isLoading,
  onClose,
  onMarkRead,
  note,
  onEditNote,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={false}
      maxWidth="md"
      TransitionComponent={Fade}
      transitionDuration={240}
      PaperProps={{
        sx: {
          width: 'min(720px, calc(100vw - 32px))',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight={700}>
          {book?.title ?? 'Detalhes do livro'}
        </Typography>
        {book?.externalId && (
          <Button variant="contained" size="small" onClick={() => onMarkRead(book.externalId)}>
            Marcar como lido
          </Button>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {isLoading && (
          <Stack alignItems="center" py={3}>
            <CircularProgress />
          </Stack>
        )}

        {!isLoading && book && (
          <Stack spacing={3}>
            <Stack
              direction="row"
              spacing={3}
              alignItems="flex-start"
              sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}
            >
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ flexShrink: 0 }}
              >
                <Box
                  sx={{
                    width: 180,
                    height: 240,
                    borderRadius: 2,
                    background: book.cover
                      ? `url(${book.cover}) center/cover`
                      : 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(167,139,250,0.35))',
                    boxShadow: '0 14px 35px rgba(0,0,0,0.35)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                />
              </motion.div>

              <Stack spacing={1.5} flex={1}>
                <Typography variant="subtitle1" color="text.secondary">
                  {book.author ?? 'Autor não informado'}
                </Typography>
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
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {book.subjects?.slice(0, 10).map((subject) => (
                    <Chip key={subject} label={subject} size="small" variant="outlined" />
                  ))}
                </Box>
              </Stack>
            </Stack>

            <Divider />

            {book.description && (
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {book.description}
              </Typography>
            )}

            {note && (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Observação
                </Typography>
                <Typography variant="body2" sx={{ mb: onEditNote ? 1 : 0 }}>
                  {note}
                </Typography>
                {onEditNote && (
                  <Button variant="outlined" size="small" onClick={onEditNote}>
                    Editar observação
                  </Button>
                )}
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BookDetailsDialog

