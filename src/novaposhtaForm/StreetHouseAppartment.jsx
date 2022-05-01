import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { TextField, Autocomplete, Box } from '@mui/material'
import novaposhta from './novaposhta'

export default ({
  deliveryCityId,
  streetId,
  setStreetId,
  house,
  setHouse,
  appartment,
  setAppartment
}) => {
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState([{}])

  const getStreetSuggestionsDebounce = useCallback(
    _.debounce(async () => {
      const data = await novaposhta.getStreetSuggestions(deliveryCityId, search)

      setOptions(data)
    }, 500),
    [deliveryCityId, streetId, search]
  )

  useEffect(() => {
    getStreetSuggestionsDebounce()

    return getStreetSuggestionsDebounce.cancel
  }, [search, getStreetSuggestionsDebounce])

  return <Box>
    <Autocomplete
      options={options}
      getOptionLabel={option => option.label}
      renderInput={params => (
        <TextField
          {...params}
          label='Вулиця'
          onChange={e => setSearch(e.target.value)}
        />
      )}

      value={options.find(option => option.value === deliveryCityId)}

      onChange={(e, value) => setStreetId(value?.value)}
    />
    <TextField
      label='Будинок'
      value={house}
      onChange={e => setHouse(e.target.value)}
    />
    <TextField
      label='Квартира'
      value={appartment}
      onChange={e => setAppartment(e.target.value)}
    />
  </Box>
}
