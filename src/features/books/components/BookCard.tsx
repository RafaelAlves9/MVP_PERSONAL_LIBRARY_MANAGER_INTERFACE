import { Book } from '@/types/books'
import { Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  book: Book
  onSeeDetails: (externalId: string) => void
  onMarkRead: (externalId: string) => void
}

function BookCard({ book, onSeeDetails, onMarkRead }: Props) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }} style={{ height: '100%' }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
        elevation={0}
      >
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <motion.div
              whileHover={{ rotate: 1 }}
              style={{
                width: 70,
                height: 100,
                borderRadius: 12,
                background: book.cover
                  ? `url(${book.cover}) center/cover`
                  : 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(167,139,250,0.35))',
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
              }}
            />
            <Stack spacing={1} flex={1}>
              <Typography variant="h6">{book.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {book.author ?? 'Autor(a) desconhecido'}
              </Typography>
              {book.firstPublishYear && (
                <Chip size="small" label={`Publicado em ${book.firstPublishYear}`} color="primary" />
              )}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button variant="contained" onClick={() => onMarkRead(book.externalId)}>
              Marcar como lido
            </Button>
            <Button variant="text" onClick={() => onSeeDetails(book.externalId)}>
              Ver detalhes
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BookCard

