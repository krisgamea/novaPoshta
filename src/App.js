import './App.css'
import { useMemo, useState } from 'react'
import City from './novaposhtaForm/City'
import qs from 'qs'

import PayerType, { options as payerTypeOptions } from './novaposhtaForm/PayerType'
import PaymentMethod, { options as paymentMethodOptions } from './novaposhtaForm/PaymentMethod'
import { Box } from '@mui/system'
import CargoDescription from './novaposhtaForm/CargoDescription'
import AnnouncedPrice from './novaposhtaForm/AnnouncedPrice'
import CargoType, { options as cargoTypeOptions } from './novaposhtaForm/CargoType'
import RecipientDetails from './novaposhtaForm/RecipientDetails'
import DeliveryDimensions from './novaposhtaForm/DeliveryDimensions'
import Department from './novaposhtaForm/Department'
import Counterparty from './novaposhtaForm/Counterparty'
import AddressType, { options as addressTypeOptions } from './novaposhtaForm/AddressType'
import StreetHouseAppartment from './novaposhtaForm/StreetHouseAppartment'
import MoneyTransfer, { payerTypeOptions as moneyTransferPayerType, paymentRecievementTypeOptions } from './novaposhtaForm/MoneyTransfer'
import { Button, FormControlLabel, Switch } from '@mui/material'
import novaposhta from './novaposhtaForm/novaposhta'
import axios from 'axios'


const updateOrderWithInvocie = async (orderId, invoice) => {
}

function App() {
  const query = useMemo(() => qs.parse(window.location.search.slice(1,)), [])

  const [cargoType, setCargoType] = useState(cargoTypeOptions[0].value)
  const [weight, setWeight] = useState(10)
  const [seatsAmount, setSeatsAmount] = useState(1)

  const [payerType, setPayerType] = useState(payerTypeOptions[0].value)
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodOptions[0].value)
  const [cargoDescription, setCargoDescription] = useState('Тара')
  const [announcedPrice, setAnnouncedPrice] = useState(query.price)

  const [counterpartyId, setCounterpartyId] = useState('')
  const [senderDeliveryCityId, setSenderDeliveryCityId] = useState('')
  const [senderCityId, setSenderCityId] = useState('')
  const [senderDepartmentId, setSenderDepartmentId] = useState('')
  const [senderStreetId, setSenderStreetId] = useState('')
  const [senderHouse, setSenderHouse] = useState('')
  const [senderAppartment, setSenderAppartment] = useState('')
  const [senderAddressType, setSenderAddressType] = useState(addressTypeOptions[0].value)

  const [phoneNumber, setPhoneNumber] = useState('38' + query.phoneNumber)
  const [surname, setSurname] = useState(query.surname)
  const [name, setName] = useState(query.name)
  const [middleName, setMiddleName] = useState(query.middleName)

  const [destinationDeliveryCityId, setDestinationDeliveryCityId] = useState('')
  const [destinationCityId, setDestinationCityId] = useState('')
  const [destinationDepartmentId, setDestinationDepartmentId] = useState(query.postDepartment)
  const [destinationStreetId, setDestinationStreetId] = useState('')
  const [destinationHouse, setDestinationHouse] = useState('')
  const [destinationAppartment, setDestinationAppartment] = useState('')
  const [destinationAddressType, setDestinationAddressType] = useState(addressTypeOptions[0].value)

  const [isBackwardMoneyTransfer, setIsBackwardMoneyTransfer] = useState(false)
  const [backwardMoneyTransferPayerType, setBackwardMoneyTransferPayerType] = useState(moneyTransferPayerType[0].value)
  const [backwardMoneyTransferAmount, setBackwardMoneyTransferAmount] = useState(200)
  const [backwardMoneyTransferRecievementType, setBackwardMoneyTransferRecievementType] = useState(paymentRecievementTypeOptions[0].value)
  // const [backwardMoneyTransferCard, setBackwardMoneyTransferCard] = useState('5375414107508078')

  const submitInvoice = async () => {
    const { senderId: senderContactId, senderPhoneNumber } = await novaposhta.getSenderId(counterpartyId)
    const senderAddressId = await (
      senderAddressType === 'Warehouse'
        ? novaposhta.savePersonDepartment({ cityId: senderCityId, departmentId: senderDepartmentId, userContactId: senderContactId })
        : novaposhta.savePersonAddress({ cityId: senderCityId, streetId: senderStreetId, house: senderHouse, appartment: senderAppartment, userContactId: senderContactId })
    )


    let recipientContactId, recipientId

    const recipientInfo = await novaposhta.getRecipientId(phoneNumber)
    if (recipientInfo) {
      ({ recipientContactId, recipientId } = recipientInfo)
    } else {
      ({ recipientContactId, recipientId } = await novaposhta.saveContactPerson({ counterpartyId, firstName: name, lastName: surname, middleName, phoneNumber }))
    }

    const recipientAddressId = await (
      destinationAddressType === 'Warehouse'
        ? novaposhta.savePersonDepartment({ cityId: destinationCityId, departmentId: destinationDepartmentId, userContactId: recipientContactId })
        : novaposhta.savePersonAddress({ cityId: destinationCityId, streetId: destinationStreetId, house: destinationHouse, appartment: destinationAppartment, userContactId: recipientContactId })
    )

    const invoicePayload = {
      payerType,
      paymentMethod,
      cargoType,
      weight,

      senderAddressType,
      destinationAddressType,

      seatsAmount,
      cargoDescription,
      announcedPrice,

      counterpartyId,

      senderCityId,
      senderId: counterpartyId,
      senderAddressId,
      senderContactId,
      senderPhoneNumber,


      recipientCityId: destinationCityId,
      recipientId,
      recipientAddressId,
      recipientContactId,
      recipientPhoneNumber: phoneNumber
    }

    if (isBackwardMoneyTransfer) {
      invoicePayload.BackwardDeliveryData = [
        {
          CargoType: 'Money',
          PayerType: backwardMoneyTransferPayerType,
          RedeliveryString: backwardMoneyTransferAmount.toString()
        }
      ]

      // if (backwardMoneyTransferRecievementType === 'Card') {
      //   const Cash2CardPAN =
      //     backwardMoneyTransferCard.slice(0, 6)
      //     + 'xxxxxx'
      //     + backwardMoneyTransferCard.slice(12,)

      //   const Cash2CardPayout_Id = await novaposhta.registerCard(backwardMoneyTransferCard)

      //   invoicePayload.BackwardDeliveryData[0] = {
      //     ...invoicePayload.BackwardDeliveryData[0],
      //     Cash2CardAlias: '',
      //     Cash2CardPAN,
      //     Cash2CardPayout_Id
      //   }
      // }
    }

    const data = await novaposhta.createInvoice(invoicePayload)
    const invoice = data.data[0].IntDocNumber

    const baseUrl = 'https://script.google.com/macros/s/AKfycbxIPafPk2JvzZcuO4g_mvHjVF5mM2oq93BUbTmjdvpo1PxMqIejqda42e8hw83bHXKE/exec'
    window.location.href = `${baseUrl}?orderId=${query.orderId}&invoice=${invoice}`
  }

  // useEffect(async () => {
  //   await axios.post(
  //     'https://script.google.com/macros/s/AKfycbwAxrnxtqd8_NK-EBWveGZkGs_PDt2wSrAw3Mh7W04Kn_JGuxCjJK6hsFTZxzews5pE/exec',
  //     { data: 1, kek: 2 },
  //     {
  //       withCredentials: true
  //     }
  //   )
  // }, [])

  return (
    <div className="App">
      <Box sx={{
        '> *': {
          margin: '10px'
        }
      }}
      >
        <CargoType
          value={cargoType}
          setValue={setCargoType}
        />

        <DeliveryDimensions
          weight={{
            value: weight,
            setValue: setWeight
          }}
          seatsAmount={{
            value: seatsAmount,
            setValue: setSeatsAmount
          }}
        />

        <PayerType
          value={payerType}
          setValue={setPayerType}
        />

        <PaymentMethod
          value={paymentMethod}
          setValue={setPaymentMethod}
        />

        <CargoDescription
          value={cargoDescription}
          setValue={setCargoDescription}
        />

        <AnnouncedPrice
          value={announcedPrice}
          setValue={setAnnouncedPrice}
        />

        <Box>
          Відправник

          <Counterparty
            counterpartyId={counterpartyId}
            setCounterpartyId={setCounterpartyId}
          />

          <AddressType
            value={senderAddressType}
            setValue={setSenderAddressType}
          />

          <City
            deliveryCityId={senderDeliveryCityId}
            setDeliveryCityId={setSenderDeliveryCityId}
            setCityId={setSenderCityId}
            defaultValue={'Житомир'}
          />


          {senderAddressType === 'Warehouse' ? (
            <Department
              deliveryCityId={senderDeliveryCityId}
              departmentId={senderDepartmentId}
              setDeprtmentId={setSenderDepartmentId}
              defaultValue={'1'}
            />
          )
            : (
              <StreetHouseAppartment
                cityId={senderCityId}
                streetId={senderStreetId}
                setStreetId={setSenderStreetId}
                house={senderHouse}
                setHouse={setSenderHouse}
                appartment={senderAppartment}
                setAppartment={setSenderAppartment}
              />
            )
          }

        </Box>
        <Box>
          Одержувач
          <RecipientDetails
            phoneNumber={{ value: phoneNumber, setValue: setPhoneNumber }}
            surname={{ value: surname, setValue: setSurname }}
            name={{ value: name, setValue: setName }}
            middleName={{ value: middleName, setValue: setMiddleName }}
          />

          <AddressType
            value={destinationAddressType}
            setValue={setDestinationAddressType}
          />

          <City
            deliveryCityId={destinationDeliveryCityId}
            setDeliveryCityId={setDestinationDeliveryCityId}
            setCityId={setDestinationCityId}
            defaultValue={query.city}
          />

          {destinationAddressType === 'Warehouse' ? (
            <Department
              deliveryCityId={destinationDeliveryCityId}
              departmentId={destinationDepartmentId}
              setDeprtmentId={setDestinationDepartmentId}
              defaultValue={query.postDepartment}
            />)
            : (
              <StreetHouseAppartment
                cityId={destinationCityId}
                streetId={destinationStreetId}
                setStreetId={setDestinationStreetId}
                house={destinationHouse}
                setHouse={setDestinationHouse}
                appartment={destinationAppartment}
                setAppartment={setDestinationAppartment}
              />
            )
          }
        </Box>

        <Box>
          Додаткові послуги
          <Box>
            <FormControlLabel
              control={<Switch
                value={isBackwardMoneyTransfer}
                onChange={e => setIsBackwardMoneyTransfer(e.target.checked)}
              />}
              label="Грошовий переказ"
            />

            {isBackwardMoneyTransfer
              ? <MoneyTransfer
                moneyTransferAmount={backwardMoneyTransferAmount}
                setMoneyTransferAmount={setBackwardMoneyTransferAmount}
                payerType={backwardMoneyTransferPayerType}
                setPayerType={setBackwardMoneyTransferPayerType}
                paymentRecievementType={backwardMoneyTransferRecievementType}
                setPaymentRecievementType={setBackwardMoneyTransferRecievementType}
              />
              : null
            }

          </Box>

        </Box>

        <Box>
          <Button onClick={submitInvoice}>
            Створити
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default App
