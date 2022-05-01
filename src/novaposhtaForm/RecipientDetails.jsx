import { Box } from '@mui/material'
import TextField from '@mui/material/TextField';

export default ({ phoneNumber, surname, name, middleName }) => {
  const fields = [
    { label: 'Телефон', value: phoneNumber.value, handleOnChange: e => phoneNumber.setValue(e.target.value) },
    { label: 'Прізвище', value: surname.value, handleOnChange: e => surname.setValue(e.target.value) },
    { label: 'Імʼя', value: name.value, handleOnChange: e => name.setValue(e.target.value) },
    { label: 'По батькові', value: middleName.value, handleOnChange: e => middleName.setValue(e.target.value) }
  ]

  return <Box>
    {fields.map(item =>
      <Box key={item.label}>
        <TextField
          label={item.label}
          value={item.value}
          onChange={item.handleOnChange}
        />
      </Box>
    )}
  </Box>
}