import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export default ({ label, value, setValue, options }) => {
  return <FormControl>
    {label ? <FormLabel>{label}</FormLabel> : null}
    <RadioGroup
      row
      value={value}
      onChange={e => setValue(e.target.value)}
    >
      {options.map(item => (
        <FormControlLabel
          key={item.value}
          value={item.value}
          label={item.label}
          control={<Radio />}
        />
      ))}
    </RadioGroup>
  </FormControl >
}
