import { Box } from '@mui/material'
import RadioGroup from "./common/RadioGroup"


export const options = [
  { value: 'Parcel', label: 'Посилки та вантажі' },
  // { value: '', label: 'Документи' },
  // { value: 'Pallet', label: 'Палети' },
  // { value: '', label: 'Шини та диски' }
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
