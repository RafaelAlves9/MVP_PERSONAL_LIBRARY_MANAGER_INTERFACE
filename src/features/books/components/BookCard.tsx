import type { Book } from '@/types/books'
import { Card, CardContent, Stack, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  book: Book
  onSeeDetails: (externalId: string) => void
  onMarkRead: (externalId: string) => void
}

function BookCard({ book, onSeeDetails, onMarkRead }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.18 }}
      style={{ height: '100%', cursor: 'pointer', width: 240 }}
      onClick={() => onSeeDetails(book.externalId)}
      onDoubleClick={() => onMarkRead(book.externalId)}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.08))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, p: 2 }}>
          <Box
            sx={{
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 2,
              background: book.cover
                ? `url(${book.cover}) center/cover`
                : 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(167,139,250,0.35))',
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            }}
          />
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.25 }}>
            {book.title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BookCard

