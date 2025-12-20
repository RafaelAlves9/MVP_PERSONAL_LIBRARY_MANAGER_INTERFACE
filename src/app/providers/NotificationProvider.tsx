import { Alert, Snackbar } from '@mui/material'
import type { AlertColor } from '@mui/material'
import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react'

type NotificationState = {
  message: string
  severity: AlertColor
}

type NotificationContextValue = {
  notify: (message: string, severity?: AlertColor) => void
  notifySuccess: (message: string) => void
  notifyError: (message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<NotificationState | null>(null)

  const handleClose = useCallback(() => setState(null), [])

  const notify = useCallback((message: string, severity: AlertColor = 'info') => {
    setState({ message, severity })
  }, [])

  const notifySuccess = useCallback((message: string) => notify(message, 'success'), [notify])
  const notifyError = useCallback((message: string) => notify(message, 'error'), [notify])

  const value = useMemo(
    () => ({
      notify,
      notifySuccess,
      notifyError,
    }),
    [notify, notifyError, notifySuccess],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={Boolean(state)}
        autoHideDuration={3200}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={state?.severity} variant="filled" sx={{ minWidth: 280 }}>
          {state?.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) {
    throw new Error('NotificationProvider não encontrado')
  }
  return ctx
}

