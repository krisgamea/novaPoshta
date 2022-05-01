import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { TextField, Autocomplete, Box } from '@mui/material'
import novaposhta from './novaposhta'

export default ({ deliveryCityId, departmentId, setDeprtmentId, defaultValue, t }) => {
  const [search, setSearch] = useState(defaultValue)
  const [options, setOptions] = useState([{}])

  const getCityDepartmentSuggestionsDebounce = useCallback(
    _.debounce(async () => {
      if (!deliveryCityId || options.find(i => i.value === departmentId)?.label === search) return

      const data = await novaposhta.getCityDepartmentSuggestions(deliveryCityId, search)

      setOptions(data)

      const findByNumber = data.filter(item => item.label.includes(`№${search}:`))
      if (findByNumber.length === 1) {
        setSearch(findByNumber[0].label)
        setDeprtmentId(findByNumber[0].value)
      }
    }, 500),
    [deliveryCityId, search]
  )

  useEffect(() => {
    getCityDepartmentSuggestionsDebounce()

    return getCityDepartmentSuggestionsDebounce.cancel
  }, [search, getCityDepartmentSuggestionsDebounce])

  return <Box>
    <Autocomplete
      options={options}
      getOptionLabel={option => option.label}

      onInputChange={(e, value) => setSearch(value)}
      renderInput={params => (
        <TextField
          {...params}
          label='Відділення'
        />
      )}

      value={options.find(option => option.value === departmentId) || null}
      onChange={(e, value) => setDeprtmentId(value?.value)}
    />
  </Box>
}
