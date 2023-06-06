import axios from 'axios'

import jwtDefaultConfig from './jwtDefaultConfig'

import { X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import moment from 'moment'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    axios.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken()
        if (accessToken) {
          config.headers.Authorization = `${this.jwtConfig.typeBearer} ${accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error
        if (response && response.status === 401) {
          localStorage.clear()
          // window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  ////////////******************************   Token  ***************************//////////////
  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('userData'))
  }

  removeData(name) {
    localStorage.removeItem(`${name}`)
  }

  setUserData({ role, decoded }) {
    const superUserAbility = {
      action: 'manage',
      subject: 'all'
    }
    if (role) {
      const useData = { ...decoded, ability: [superUserAbility] }
      localStorage.setItem('userData', JSON.stringify(useData))
    }
  }

  setData(name, value) {
    localStorage.setItem(`${name}`, JSON.stringify(value))
  }

  getData(name) {
    return JSON.parse(localStorage.getItem(`${name}`))
  }

  // Authentication
  login(data) {
    return axios.post(this.jwtConfig.loginEndpoint, data)
  }

  getAllProviders(offset, limit, search, provider_type, status) {
    let endpoint = `${this.jwtConfig.getAllProvidersEndPoint}?ordering=first_name&offset=${offset}&limit=${limit}`

    if (search) {
      endpoint += `&search=${search}`
    }

    if (provider_type !== '[]' && provider_type !== undefined) {
      endpoint += `&provider_type=${provider_type}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }

    return axios.get(endpoint)
  }

  getProvider(id) {
    const endpoint = `${this.jwtConfig.getProviderEndPoint}${id}`
    return axios.get(endpoint)
  }

  updateProvider(id, data) {
    const endpoint = `${this.jwtConfig.updateProviderEndPoint}${id}`
    return axios.patch(endpoint, data)
  }

  registerProvider(data) {
    return axios.post(this.jwtConfig.registerProviderEndpoint, data)
  }

  deleteMultipleProviders(data) {
    return axios.post(this.jwtConfig.deleteMultipleProvidersEndPoint, data)
  }

  providerImageUpload(id, img) {
    const endpoint = `${this.jwtConfig.providerImageUploadEndPoint}${id}/image`

    return axios.post(endpoint, img)
  }

  updateProviderImage(id, img) {
    const endpoint = `${this.jwtConfig.providerImageUploadEndPoint}${id}/image/change`
    return axios.patch(endpoint, img)
  }

  // Add Promo Credit
  addPromoCredit(idx, data) {
    const endpoint = `${this.jwtConfig.addPromoCreditEndpoint}${idx}/promo-credit`
    return axios.post(endpoint, data)
  }

  // Bulk Add Promo Credit
  bulkAddPromoCredit(data) {
    const endpoint = `${this.jwtConfig.bulkAddPromoCreditEndPoint}`
    return axios.post(endpoint, data)
  }

  // Add Ethera Credit
  addEtheraCredit(idx, data) {
    const endpoint = `${this.jwtConfig.addEtheraCreditEndpoint}${idx}/ethera-credit`
    return axios.post(endpoint, data)
  }

  // Bulk Add Ethera Credit
  bulkAddEtheraCredit(data) {
    const endpoint = `${this.jwtConfig.bulkAddEtheraCreditEndpoint}`
    return axios.post(endpoint, data)
  }

  // Get Promo Credit
  getPromoCredit(idx) {
    const endpoint = `${this.jwtConfig.getPromoCreditEndpoint}${idx}/promo-credit`
    return axios.get(endpoint)
  }

  // Get Ethera Credit
  getEtheraCredit(idx) {
    const endpoint = `${this.jwtConfig.getEtheraCreditEndpoint}${idx}/ethera-credit`
    return axios.get(endpoint)
  }

  updateBillingInvoice(data, id) {
    const endpoint = `${this.jwtConfig.updateBillingInvoiceEndpoint}${id}`
    return axios.patch(endpoint, data)
  }
  ////////////******************************   Locations  ***************************//////////////

  getAllLocations() {
    const endpoint = `${this.jwtConfig.getAllLocationsEndPoint}`
    return axios.get(endpoint)
  }

  getLocation(id) {
    return axios.get(`${this.jwtConfig.getLocationsEndPoint}${id}`)
  }

  locationImageUpload(id, img) {
    const endpoint = `${this.jwtConfig.locationImageUploadEndPoint}${id}/image-api`
    return axios.post(endpoint, img)
  }

  updateLocationImage(id, img) {
    const endpoint = `${this.jwtConfig.locationImageUploadEndPoint}${id}/image-api/change`
    return axios.patch(endpoint, img)
  }

  updateLocation(id, data) {
    return axios.patch(`${this.jwtConfig.updateLocationsEndPoint}${id}`, data)
  }

  registerLocation(data) {
    return axios.post(this.jwtConfig.registerLocationsEndpoint, data)
  }

  deleteLocation(id) {
    return axios.delete(`${this.jwtConfig.deleteLocationEndPoint}${id}`)
  }

  deleteMultipleLocations(data) {
    return axios.post(this.jwtConfig.deleteMultipleLocationsEndPoint, data)
  }

  // ** Tiers
  getAllTiers(id) {
    const endpoint = `${this.jwtConfig.tiersEndPoint}${id}/location-tier-settings`
    return axios.get(endpoint)
  }

  updateTier(id, data) {
    const endpoint = `${this.jwtConfig.updateTierEndPoint}`
    return axios.post(endpoint, data)
  }

  addTier(id, data) {
    const endpoint = `${this.jwtConfig.tiersEndPoint}${id}/location-tier-settings`
    return axios.post(endpoint, data)
  }

  removeTier(id, tier_id) {
    const endpoint = `${this.jwtConfig.tiersEndPoint}${id}/location-tier-settings/${tier_id}`
    return axios.delete(endpoint)
  }

  // ** Bookings
  getAllBookings({
    offset,
    limit,
    startDate,
    endDate,
    provider_type,
    search,
    status,
    location,
    room
  }) {
    let endpoint = `${this.jwtConfig.getBookingsEndPoint}?ordering=created_at&offset=${offset}&limit=${limit}`

    if (startDate) {
      const start = moment(startDate).format('YYYY-MM-DD')
      endpoint += `&start_date=${start}`
    }
    if (endDate) {
      const end = moment(endDate).format('YYYY-MM-DD')
      endpoint += `&end_date=${end}`
    }

    if (search) {
      endpoint += `&search=${search}`
    }

    if (provider_type) {
      endpoint += `&provider_type=${provider_type}`
    }

    if (status) {
      endpoint += `&status=${status}`
    }

    if (location) {
      endpoint += `&location=${location}`
    }

    if (room) {
      endpoint += `&room=${room}`
    }

    return axios.get(endpoint)
  }

  getBookingById(id) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}`
    return axios.get(endpoint, id)
  }

  getBookingByIdWithAppointment(id) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}/appointment`
    return axios.get(endpoint)
  }

  updateBooking(id, data) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}`

    return axios.patch(endpoint, data)
  }

  deleteBooking(id) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}`
    return axios.delete(endpoint)
  }

  cancelBooking(id) {
    const endpoint = `${this.jwtConfig.editBookingEndPoint}/${id}`
    return axios.patch(endpoint, { status: '2' })
  }

  deleteMultipleBookings(data) {
    return axios.post(this.jwtConfig.deleteMultipleBookingsEndPoint, data)
  }

  validateRoom(id, data) {
    const endpoint = `${this.jwtConfig.validateRoomEndPoint}/${id}/rooms/valid-rooms`
    return axios.post(endpoint, data)
  }

  getAllClients() {
    return axios.get(this.jwtConfig.getAllClientsEndPoint)
  }

  updateAppointment(id, appointment_id, data) {
    const endpoint = `${this.jwtConfig.updateAppointmentEndPoint}/${id}/appointment/${appointment_id}`
    return axios.patch(endpoint, data)
  }
  BillingInvoice(data, id) {
    const endpoint = `${this.jwtConfig.BillingInvoiceEndPoint}/${id}/invoice_email_to_provider`
    return axios.post(endpoint, data)
  }

  ////////////******************************   Locks  ***************************//////////////

  getAllLocks(offset, limit) {
    const endpoint = `${this.jwtConfig.getAllLocksEndPoint}?offset=${offset}&limit=${limit}`
    return axios.get(endpoint)
  }

  getLock(location, id) {
    const endpoint = `${this.jwtConfig.getLockByIdEndPoint}${location}/locks/${id}`
    return axios.get(endpoint)
  }

  updateLock(location, id, data) {
    const endpoint = `${this.jwtConfig.updateLocksEndPoint}${location}/locks/${id}`
    return axios.patch(endpoint, data)
  }

  createLock(id, data) {
    const endpoint = `${this.jwtConfig.createLocksEndPoint}${id}/locks`
    return axios.post(endpoint, data)
  }

  testLock(token) {
    const endpoint = `${this.jwtConfig.testLockEndPoint}`
    return axios.post(endpoint, token)
  }

  deleteLock(location, id) {
    const endpoint = `${this.jwtConfig.deleteLockEndPoint}${location}/locks/${id}`
    return axios.delete(endpoint)
  }

  ////////////******************************   System  ***************************//////////////

  registerAdmin(data) {
    const endpoint = `${this.jwtConfig.registerAdminEndPoint}`
    return axios.post(endpoint, data)
  }
  registerService(data) {
    const endpoint = `${this.jwtConfig.registerServiceEndPoint}`
    return axios.post(endpoint, data)
  }
  AdminImageUpload(id, image) {
    const endpoint = `${this.jwtConfig.adminImageUploadEndPoint}${id}/image`
    return axios.post(endpoint, image)
  }
  getAllAdmins() {
    const endpoint = `${this.jwtConfig.getAllAdminsEndPoint}`
    return axios.get(endpoint)
  }

  // ** Rooms
  getAllRooms(id) {
    const endpoint = `${this.jwtConfig.getRoomsEndPoint}/${id}/rooms`
    return axios.get(endpoint)
  }

  addRoom(id, data) {
    const endpoint = `${this.jwtConfig.getRoomsEndPoint}/${id}/rooms`
    return axios.post(endpoint, data)
  }

  updateRoom(id, room_id, data) {
    const endpoint = `${this.jwtConfig.getRoomsEndPoint}/${id}/rooms/${room_id}}`
    return axios.patch(endpoint, data)
  }

  getRoom(id, room_id) {
    const endpoint = `${this.jwtConfig.getRoomsEndPoint}/${id}/rooms/${room_id}`
    return axios.get(endpoint)
  }

  deleteRoom(id, room_id) {
    const endpoint = `${this.jwtConfig.getRoomsEndPoint}/${id}/rooms/${room_id}`
    return axios.delete(endpoint)
  }
  getBillings(id) {
    const endpoint = `${this.jwtConfig.getBillingsEndPoint}/${id}`
    return axios.get(endpoint)
  }

  getAllBillings({ offset, limit, status, provider_type, search }) {
    let endpoint = `${this.jwtConfig.getAllBillingsEndPoint}?offset=${offset}&limit=${limit}`

    if (status) {
      endpoint += `&status=${status}`
    }

    if (provider_type !== '[]' && provider_type !== undefined) {
      endpoint += `&provider_type=${provider_type}`
    }

    if (search) {
      endpoint += `&search=${search}`
    }

    return axios.get(endpoint)
  }
  getAdmin(id) {
    const endpoint = `${this.jwtConfig.getAdminEndPoint}${id}`
    return axios.get(endpoint)
  }
  updateAdmin(id, data) {
    const endpoint = `${this.jwtConfig.updateAdminEndPoint}${id}`
    return axios.patch(endpoint, data)
  }
  updateAdminImage(id, image) {
    const endpoint = `${this.jwtConfig.adminImageUploadEndPoint}${id}/image/change`
    return axios.patch(endpoint, image)
  }

  getAllService() {
    const endpoint = `${this.jwtConfig.getAllServicesEndPoint}`
    return axios.get(endpoint)
  }

  deleteAdmin(id) {
    const endpoint = `${this.jwtConfig.deleteAdminEndPoint}${id}`
    return axios.delete(endpoint)
  }
  deleteService(id) {
    const endpoint = `${this.jwtConfig.deleteServiceEndPoint}${id}`
    return axios.delete(endpoint)
  }
}
