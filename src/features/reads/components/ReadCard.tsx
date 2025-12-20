import type { ReadEntry } from '@/types/reads'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  entry: ReadEntry
  onEditNote: (entry: ReadEntry) => void
  onRemove: (id: string) => void
}

function ReadCard({ entry, onEditNote, onRemove }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: '1px solid rgba(255,255,255,0.05)',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(59,130,246,0.08))',
        }}
      >
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{entry.title}</Typography>
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
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip size="small" label={`ID ${entry.externalId}`} variant="outlined" />
              {entry.createdAt && (
                <Chip size="small" label={`Criado em ${new Date(entry.createdAt).toLocaleDateString()}`} />
              )}
            </Stack>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Button startIcon={<EditNoteIcon />} onClick={() => onEditNote(entry)}>
            Editar nota
          </Button>
          <Button
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={() => onRemove(entry.id)}
          >
            Remover
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  )
}

export default ReadCard

