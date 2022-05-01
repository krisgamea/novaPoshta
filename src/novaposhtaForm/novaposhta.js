import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'


const apiKey = qs.parse(window.location.search.slice(1,)).apiKey
const baseUrl = 'https://api.novaposhta.ua/v2.0/json/'

const getCounterparties = async search => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "Counterparty",
    calledMethod: "getCounterparties",
    methodProperties: {
      CounterpartyProperty: "Sender",
      Limit: "50",
      Page: "1",
      FindByString: search
    }
  })

  if (!data?.data?.data.length) return []

  return data.data.data.map(item => ({
    value: item.Ref,
    label: item.CounterpartyFullName
  }))
}

const getCitySuggestions = async searchCity => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "Address",
    calledMethod: "searchSettlements",
    methodProperties: {
      CityName: searchCity,
      Limit: "50",
      Page: "1"
    }
  })

  if (!data?.data?.data[0].Addresses.length) return []

  return data.data.data[0].Addresses.map(item => ({
    value: item.DeliveryCity, // Ref
    cityId: item.Ref,
    label: item.Present
  }))
}

const getCityDepartmentSuggestions = async (cityId, search) => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "AddressGeneral",
    calledMethod: "getWarehouses",
    methodProperties: {
      CityRef: cityId,
      Page: "1",
      Limit: "500",
      FindByString: search
    },
    system: "PA 3.0"
  })

  if (!data?.data?.data.length) return []

  return data.data.data.map(item => ({
    value: item.Ref,
    label: item.Description
  }))
}

const getStreetSuggestions = async (cityId, search) => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "Address",
    calledMethod: "getStreet",
    methodProperties: {
      CityRef: cityId,
      FindByString: search,
      Page: "1",
      Limit: "500"
    }
  })

  if (!data?.data?.data?.length) return []

  return data.data.data.map(item => ({
    value: item.Ref,
    label: item.StreetsType + ' ' + item.Description
  }))
}

const getSenderId = async counterpartyId => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "ContactPersonGeneral",
    calledMethod: "getContactPersonsList",
    methodProperties: {
      ContactProperty: "Sender",
      CounterpartyRef: counterpartyId,
      FindByString: "",
      Limit: 200,
      Page: 1
    }
  })

  return {
    senderId: data.data.data[0].Ref,
    senderPhoneNumber: data.data.data[0].Phones
  }
}

const getRecipientId = async phoneNumber => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "ContactPersonGeneral",
    calledMethod: "getContactPersonsCounterparty",
    methodProperties: {
      ContactProperty: "Recipient",
      FindByString: phoneNumber,
      Limit: 200,
      Page: 1
    }
  })

  if (!data?.data?.data?.length) return null

  return {
    recipientContactId: data.data.data[0].Ref,
    recipientId: data.data.data[0].CounterpartyRef
  }
}

const saveAddressContactPersonGeneral = async payload => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "AddressContactPersonGeneral",
    calledMethod: "save",
    methodProperties: payload
  })

  return data.data.data[0].Ref
}

const savePersonAddress = async ({ cityId, streetId, house, appartment, userContactId }) => {
  const payload = {
    AddressRef: streetId,
    AddressType: "Doors",
    BuildingNumber: house,
    ContactPersonRef: userContactId,
    Flat: appartment,
    Note: "",
    SettlementRef: cityId
  }

  return saveAddressContactPersonGeneral(payload)
}

const savePersonDepartment = async ({ cityId, departmentId, userContactId }) => {
  const payload = {
    AddressRef: departmentId,
    AddressType: "Warehouse",
    ContactPersonRef: userContactId,
    SettlementRef: cityId
  }

  return saveAddressContactPersonGeneral(payload)
}

const saveContactPerson = async ({ counterpartyId, firstName, lastName, middleName, phoneNumber }) => {
  const data = await axios.post(baseUrl, {
    apiKey,
    modelName: "ContactPersonGeneral",
    calledMethod: "save",
    methodProperties: {
      CounterpartyRef: counterpartyId,
      FirstName: firstName,
      LastName: lastName,
      MiddleName: middleName,
      Phone: phoneNumber
    }
  })

  return data.data.data[0].Ref
}

const createInvoice = async ({
  payerType,
  paymentMethod,
  cargoType,
  weight,

  senderAddressType,
  destinationAddressType,

  seatsAmount,
  cargoDescription,
  announcedPrice,

  senderCityId,
  senderId,
  senderAddressId,
  senderContactId,
  senderPhoneNumber,

  recipientCityId,
  recipientId,
  recipientAddressId,
  recipientContactId,
  recipientPhoneNumber,

  BackwardDeliveryData
}) => {
  const dateParts = new Date().toISOString().slice(0, 10).split('-')

  const payload = {
    apiKey,
    modelName: "InternetDocument",
    calledMethod: "save",
    methodProperties: {
      PayerType: payerType,
      PaymentMethod: paymentMethod,
      DateTime: `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`,
      CargoType: cargoType,
      Weight: weight,
      ServiceType: senderAddressType + destinationAddressType,
      SeatsAmount: seatsAmount,
      Description: cargoDescription,
      Cost: announcedPrice,

      CitySender: senderCityId,
      Sender: senderId,
      SenderAddress: senderAddressId,
      ContactSender: senderContactId,
      SendersPhone: senderPhoneNumber,

      CityRecipient: recipientCityId,
      Recipient: recipientId,
      RecipientAddress: recipientAddressId,
      ContactRecipient: recipientContactId,
      RecipientsPhone: recipientPhoneNumber
    }
  }

  if (BackwardDeliveryData && BackwardDeliveryData.length) {
    payload.methodProperties.BackwardDeliveryData = BackwardDeliveryData
  }

  const data = await axios.post(baseUrl, payload)

  return data.data
}

// const registerCard = async cardNumber => {
//   const uuid = uuidv4()

//   await axios.post(`https://e-com.novapay.ua/api/payout?sid=${uuid}&lang=ua`, {
//     pan: cardNumber
//   })

//   return uuid
// }

export default {
  getCitySuggestions,
  getCityDepartmentSuggestions,
  getCounterparties,
  getStreetSuggestions,
  createInvoice,
  getSenderId,

  savePersonAddress,
  savePersonDepartment,

  saveContactPerson,
  getRecipientId,

  // registerCard
}