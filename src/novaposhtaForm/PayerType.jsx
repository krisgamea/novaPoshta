import { Box } from '@mui/material'
import RadioGroup from "./common/RadioGroup"

export const options = [
  { value: 'Recipient', label: 'Отримувач' },
  { value: 'Sender', label: 'Відправник' },
  // { value: 'ThirdPerson', label: 'Третя особа' }
]

export default ({ value, setValue }) => {
  return <Box>
    <RadioGroup
      label={'Платник за доставку'}
      value={value}
      setValue={setValue}
      options={options}
    />
  </Box>
}
