import { z } from 'zod'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'

const noteSchema = z.string().max(240, 'Máximo de 240 caracteres').optional()

type Props = {
  open: boolean
  title: string
  defaultNote?: string
  confirmLabel?: string
  onCancel: () => void
  onSave: (note?: string) => void
}

function NoteDialog({ open, title, defaultNote, confirmLabel = 'Salvar', onCancel, onSave }: Props) {
  const [note, setNote] = useState<string>(defaultNote ?? '')
  const [error, setError] = useState<string | null>(null)

  const helper = useMemo(() => error ?? 'Nota opcional (até 240 caracteres)', [error])

  const handleSave = () => {
    const result = noteSchema.safeParse(note.trim() ? note.trim() : undefined)
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Nota inválida')
      return
    }
    setError(null)
    onSave(result.data)
  }

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5} pt={1}>
          <Typography variant="body2" color="text.secondary">
            Adicione uma observação rápida sobre sua leitura para lembrar pontos importantes.
          </Typography>
          <TextField
            multiline
            minRows={3}
            maxRows={6}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Ex: Capítulo 3 fala sobre padrões de arquitetura..."
            error={Boolean(error)}
            helperText={helper}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained">
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NoteDialog

