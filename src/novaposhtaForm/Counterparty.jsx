import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { TextField, Autocomplete, Box } from '@mui/material'
import novaposhta from './novaposhta'

export default ({ counterpartyId, setCounterpartyId }) => {
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState([{}])

  const getCounterpartiesDebounce = useCallback(
    _.debounce(async () => {
      if (options.find(i => i.value === counterpartyId)?.label === search) return

      const data = await novaposhta.getCounterparties(search)

      setOptions(data)
      if (data.length === 1) {
        setCounterpartyId(data[0].value)
        setSearch(data[0].label)
      }
    }, 500),
    [counterpartyId, search]
  )

  useEffect(() => {
    getCounterpartiesDebounce()

    return getCounterpartiesDebounce.cancel
  }, [search, getCounterpartiesDebounce])

  return <Box>
    <Autocomplete
      options={options}
      getOptionLabel={option => option.label}


      inputValue={search}
      onInputChange={(e, newInputValue) => setSearch(newInputValue)}
      renderInput={params => (
        <TextField
          {...params}
          label='Відправник'
        />
      )}

      value={options.find(i => i.value === counterpartyId) || null}
      onChange={(e, value) => setCounterpartyId(value?.value)}
    />
  </Box>
}
