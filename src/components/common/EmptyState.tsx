import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

type Props = {
  title: string
  description?: string
}

function EmptyState({ title, description }: Props) {
  return (
    <Box
      sx={{
        py: 6,
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        gap: 1,
      }}
    >
      <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 2.4 }}>
        <Box
          sx={{
            width: 78,
            height: 78,
            borderRadius: 4,
            display: 'grid',
            placeItems: 'center',
            background: 'linear-gradient(135deg, rgba(96,165,250,0.18), rgba(167,139,250,0.18))',
            boxShadow: '0 10px 30px rgba(96,165,250,0.28)',
          }}
        >
          <LibraryBooksIcon sx={{ fontSize: 36 }} color="primary" />
        </Box>
      </motion.div>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
          {description}
        </Typography>
      )}
    </Box>
  )
}

export default EmptyState

