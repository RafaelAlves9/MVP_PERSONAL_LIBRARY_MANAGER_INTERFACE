import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b1120',
      paper: '#0f172a',
    },
    primary: {
      main: '#60a5fa',
    },
    secondary: {
      main: '#a78bfa',
    },
    success: {
      main: '#22c55e',
    },
    error: {
      main: '#f87171',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#cbd5f5',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    h3: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    body1: { color: '#cbd5f5' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background:
            'linear-gradient(135deg, rgba(96,165,250,0.08), rgba(167,139,250,0.08))',
          border: '1px solid rgba(255,255,255,0.05)',
        },
      },
    },
  },
})

export default theme

