import { Box } from '@mui/material'
import RadioGroup from "./common/RadioGroup"

export const options = [
  { value: 'Warehouse', label: 'Відділення' },
  { value: 'Doors', label: 'Адреса' }
]

export default ({ value, setValue }) => {
  return <Box>
    <RadioGroup
      value={value}
      setValue={setValue}
      options={options}
    />
  </Box>
}
