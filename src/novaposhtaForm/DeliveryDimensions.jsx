import { Box } from '@mui/material'
import TextField from '@mui/material/TextField';

export default ({ weight, seatsAmount }) => {
  return <>
    <Box>
      <TextField
        type={'number'}
        label="Загальна вага"
        value={weight.value}
        onChange={e => weight.setValue(e.target.value)}
      />
    </Box>
    <Box>
      <TextField
        type={'number'}
        label="Кількість місць"
        value={seatsAmount.value}
        onChange={e => seatsAmount.setValue(e.target.value)}
      />
    </Box>
    </>
}