import { Box, CircularProgress, Typography } from '@mui/material'

type Props = {
  message?: string
}

function LoadingState({ message = 'Carregando...' }: Props) {
  return (
    <Box
      sx={{
        py: 6,
        display: 'grid',
        placeItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingState

