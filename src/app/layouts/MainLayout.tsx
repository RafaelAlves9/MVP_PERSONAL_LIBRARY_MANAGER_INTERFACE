import { Container, Tab, Tabs, Toolbar, Typography, AppBar, Box, Stack, Button } from '@mui/material'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const tabItems = [
  { label: 'Catálogo', value: '/', icon: <AutoStoriesIcon fontSize="small" /> },
  { label: 'Lidos', value: '/reads', icon: <LibraryAddCheckIcon fontSize="small" /> },
]

function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname.startsWith('/reads') ? '/reads' : '/'

  return (
    <Box sx={{ minHeight: '100vh', color: 'text.primary' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(12px)' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
                  boxShadow: '0 10px 30px rgba(96,165,250,0.4)',
                }}
              >
                <AutoStoriesIcon />
              </Box>
            </motion.div>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2" color="text.secondary">
                Biblioteca
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                Orion Reads
              </Typography>
            </Stack>
          </Stack>

          <Tabs
            value={currentPath}
            onChange={(_, value) => navigate(value)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{ '& .MuiTab-root': { minHeight: 48, fontWeight: 600 } }}
          >
            {tabItems.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                iconPosition="start"
                icon={tab.icon}
                label={tab.label}
              />
            ))}
          </Tabs>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ boxShadow: '0 10px 30px rgba(96,165,250,0.35)' }}
          >
            Explorar
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pb: 6, pt: 4 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

export default MainLayout

