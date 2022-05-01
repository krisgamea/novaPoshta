import { Box } from '@mui/material'
import TextField from '@mui/material/TextField';

export default ({ value, setValue }) => {
  return <Box>
    <TextField
      label="Оголошена вартість"
      type={'number'}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  </Box>
}