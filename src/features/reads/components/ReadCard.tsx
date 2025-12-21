import type { ReadEntry } from '@/types/reads'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { Button, Card, CardContent, Stack, Typography, Box } from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  entry: ReadEntry
  onRemove: (id: string) => void
  onSeeDetails?: (externalId: string) => void
}

function ReadCard({ entry, onRemove, onSeeDetails }: Props) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.18 }}
      style={{ height: '100%', cursor: 'default', width: 240 }}
      onClick={() => onSeeDetails?.(entry.externalId)}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          width: '100%',
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
              background: entry.cover
                ? `url(${entry.cover}) center/cover`
                : 'linear-gradient(135deg, rgba(96,165,250,0.35), rgba(167,139,250,0.35))',
              boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            }}
          />
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.25 }}>
            {entry.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {entry.author ?? 'Autor não informado'}
          </Typography>
          {entry.note && (
            <Typography
              variant="body2"
              color="text.primary"
              sx={{ backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 2, p: 1.2 }}
            >
              {entry.note}
            </Typography>
          )}
        </CardContent>
        <Box sx={{ px: 2, pb: 2, pt: 0 }}>
          <Button
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemove(entry.id)}
            fullWidth
          >
            Remover
          </Button>
        </Box>
      </Card>
    </motion.div>
  )
}

export default ReadCard

