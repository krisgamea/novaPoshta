import { Box } from '@mui/material'
import RadioGroup from "./common/RadioGroup"

export const options = [
  { value: 'Cash', label: 'Готівка' },
  { value: 'NonCash', label: 'Безготівка' }
]

export default ({ value, setValue }) => {
  return <Box>
    <RadioGroup
      label={'Форма оплати за доставку'}
      value={value}
      setValue={setValue}
      options={options}
    />
  </Box>
}
