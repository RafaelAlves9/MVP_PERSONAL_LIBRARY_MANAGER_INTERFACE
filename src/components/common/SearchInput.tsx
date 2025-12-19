import SearchIcon from '@mui/icons-material/Search'
import { InputAdornment, TextField } from '@mui/material'

type Props = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

function SearchInput({ value, placeholder, onChange }: Props) {
  return (
    <TextField
      fullWidth
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder ?? 'Buscar livros'}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="primary" />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(255,255,255,0.02)',
          borderRadius: 2,
        },
      }}
    />
  )
}

export default SearchInput

