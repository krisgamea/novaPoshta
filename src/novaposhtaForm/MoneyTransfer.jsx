import { Box, TextField } from '@mui/material'
import RadioGroup from "./common/RadioGroup"

// cargoType - [Percel, Pallet] - посилки та вантажі

export const payerTypeOptions = [
  // { value: 'Sender', label: 'Відправник' },
  { value: 'Recipient', label: 'Одержувач' }
]

export const paymentRecievementTypeOptions = [
  { value: 'Warehouse', label: 'У відділенні' },
  { value: 'Card', label: 'На картку' }
]

export default ({ moneyTransferAmount, setMoneyTransferAmount, payerType, setPayerType, paymentRecievementType, setPaymentRecievementType }) => {
  return <Box>
    <TextField
      type={'number'}
      label='Сума'
      value={moneyTransferAmount}
      onChange={e => setMoneyTransferAmount(e.target.value)}
    />
    <RadioGroup
      label={'Платник за доставку'}
      value={payerType}
      setValue={setPayerType}
      options={payerTypeOptions}
    />
    <Box>

      <RadioGroup
        label={'Форма отримання'}
        value={paymentRecievementType}
        setValue={setPaymentRecievementType}
        options={paymentRecievementTypeOptions}
      />
    </Box>
  </Box>
}
