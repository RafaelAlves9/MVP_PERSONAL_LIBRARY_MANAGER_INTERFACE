import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { PropsWithChildren, useMemo } from 'react'
import theme from '../theme'
import { NotificationProvider } from './NotificationProvider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function AppProviders({ children }: PropsWithChildren) {
  const themed = useMemo(
    () => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    ),
    [children],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>{themed}</NotificationProvider>
    </QueryClientProvider>
  )
}

export default AppProviders

