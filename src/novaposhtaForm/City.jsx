import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { TextField, Autocomplete, Box } from '@mui/material'
import novaposhta from './novaposhta'

export default ({ deliveryCityId, setDeliveryCityId, setCityId, defaultValue, t }) => {
  const [search, setSearch] = useState(defaultValue)
  const [options, setOptions] = useState([{}])

  const getCitySuggestionsDebounce = useCallback(
    _.debounce(async () => {
      if (!search || options.find(i => i.value === deliveryCityId)?.label === search) return

      const data = await novaposhta.getCitySuggestions(search)

      setOptions(data)

      if (data.length === 1) {
        setSearch(data[0].label)
        setDeliveryCityId(data[0].value)
        setCityId(data[0].cityId)
      }
    }, 500),
    [deliveryCityId, search]
  )

  useEffect(() => {
    getCitySuggestionsDebounce()

    return getCitySuggestionsDebounce.cancel
  }, [search, getCitySuggestionsDebounce])

  return <Box>
    <Autocomplete
      options={options}
      getOptionLabel={option => option.label}

      onInputChange={(e, value) => setSearch(value)}
      renderInput={params => (
        <TextField
          {...params}
          label='Населений пункт'
        />
      )}

      value={options.find(option => option.value === deliveryCityId) || null}
      onChange={(e, value) => {
        setDeliveryCityId(value?.value)
        if (!value?.value) return setCityId(null)
        const cityId = options.find(i => i.value === value).cityId
        setCityId(cityId)
      }}
    />
  </Box>
}
