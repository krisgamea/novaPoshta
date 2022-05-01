import { Box } from '@mui/material'
import TextField from '@mui/material/TextField';

export default ({ value, setValue }) => {
  return <Box>
    <TextField
      label="Опис відправлення"
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  </Box>
}