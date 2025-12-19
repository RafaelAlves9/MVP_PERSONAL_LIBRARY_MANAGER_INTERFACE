import { Box, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material'

type Props = {
  page: number
  totalPages: number
  limit: number
  limitOptions?: number[]
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

function PaginationBar({
  page,
  totalPages,
  limit,
  limitOptions = [10, 20, 30, 50],
  onPageChange,
  onLimitChange,
}: Props) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Por página
        </Typography>
        <Select
          size="small"
          value={limit}
          onChange={(event) => onLimitChange?.(Number(event.target.value))}
          sx={{ minWidth: 88 }}
        >
          {limitOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Pagination
          count={Math.max(totalPages, 1)}
          page={page}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>
    </Stack>
  )
}

export default PaginationBar

