import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { TextField, Autocomplete, Box } from '@mui/material'
import novaposhta from './novaposhta'

export default ({
  cityId,
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
      if (!cityId || options.find(i => i.value === streetId)?.label === search) return

      const data = await novaposhta.getStreetSuggestions(cityId, search)
      setOptions(data)

      if (data.length === 1) {
        setSearch(data[0].label)
        setStreetId(data[0].value)
      }
    }, 500),
    [cityId, streetId, search]
  )

  useEffect(() => {
    getStreetSuggestionsDebounce()

    return getStreetSuggestionsDebounce.cancel
  }, [search, getStreetSuggestionsDebounce])

  return <Box>
    <Autocomplete
      options={options}
      getOptionLabel={option => option.label}

      onInputChange={(e, value) => setSearch(value)}
      renderInput={params => (
        <TextField
          {...params}
          label='Вулиця'
        />
      )}

      value={options.find(option => option.value === streetId) || null}

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
