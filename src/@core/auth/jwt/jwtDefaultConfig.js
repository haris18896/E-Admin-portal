import { MAIN_URL } from '@src/constants'

// ** Auth Endpoints
export default {
  loginEndpoint: `${MAIN_URL}/api/login`,
  // getAllProvidersEndPoint: `${MAIN_URL}/api/providers`,
  getAllProvidersEndPoint: `${MAIN_URL}/api/provider-booking`,
  getProviderEndPoint: `${MAIN_URL}/api/providers/`,
  registerProviderEndpoint: `${MAIN_URL}/api/providers`,
  updateProviderEndPoint: `${MAIN_URL}/api/providers/`,
  providerImageUploadEndPoint: `${MAIN_URL}/api/users/`,
  deleteMultipleProvidersEndPoint: `${MAIN_URL}/api/providers/bulk-delete`,

  addPromoCreditEndpoint: `${MAIN_URL}/api/providers/`,
  bulkAddPromoCreditEndPoint: `${MAIN_URL}/api/promo-credit/bulk-create`,
  addEtheraCreditEndpoint: `${MAIN_URL}/api/providers/`,
  bulkAddEtheraCreditEndpoint: `${MAIN_URL}/api/ethera-credit/bulk-create`,
  getPromoCreditEndpoint: `${MAIN_URL}/api/providers/`,
  getEtheraCreditEndpoint: `${MAIN_URL}/api/providers/`,

  getAllLocationsEndPoint: `${MAIN_URL}/api/locations`,
  getLocationsEndPoint: `${MAIN_URL}/api/locations/`,
  registerLocationsEndpoint: `${MAIN_URL}/api/locations`,
  locationImageUploadEndPoint: `${MAIN_URL}/api/locations/`,
  updateLocationsEndPoint: `${MAIN_URL}/api/locations/`,
  deleteLocationEndPoint: `${MAIN_URL}/api/locations/`,
  deleteMultipleLocationsEndPoint: `${MAIN_URL}/api/locations/bulk-delete`,

  deleteMultipleBookingsEndPoint: `${MAIN_URL}/api/booking/bulk-delete`,

  tiersEndPoint: `${MAIN_URL}/api/locations/`,
  updateTierEndPoint: `${MAIN_URL}/api/location-tier-update`,

  createLocksEndPoint: `${MAIN_URL}/api/locations/`,
  getAllLocksEndPoint: `${MAIN_URL}/api/locks`,
  getLockByIdEndPoint: `${MAIN_URL}/api/locations/`,
  updateLocksEndPoint: `${MAIN_URL}/api/locations/`,
  testLockEndPoint: `${MAIN_URL}/api/locks/test`,
  deleteLockEndPoint: `${MAIN_URL}/api/locations/`,

  createAdminEndPoint: `${MAIN_URL}/api/admins`,
  adminImageUploadEndPoint: `${MAIN_URL}/api/users/`,
  getAllAdminsEnd: `${MAIN_URL}/api/admins`,

  getRoomsEndPoint: `${MAIN_URL}/api/locations`,

  getBookingsEndPoint: `${MAIN_URL}/api/booking-list`,
  editBookingEndPoint: `${MAIN_URL}/api/booking`,
  validateRoomEndPoint: `${MAIN_URL}/api/locations`,

  getAllBillingsEndPoint: `${MAIN_URL}/api/invoices`,
  getBillingsEndPoint: `${MAIN_URL}/api/invoices`,
  registerAdminEndPoint: `${MAIN_URL}/api/users`,
  registerServiceEndPoint: `${MAIN_URL}/api/service`,
  getAllAdminsEndPoint: `${MAIN_URL}/api/users`,
  getAdminEndPoint: `${MAIN_URL}/api/users/`,
  updateAdminEndPoint: `${MAIN_URL}/api/users/`,
  getAllServicesEndPoint: `${MAIN_URL}/api/service`,
  adminImageUploadEndPoint: `${MAIN_URL}/api/users/`,
  deleteAdminEndPoint: `${MAIN_URL}/api/users/`,
  deleteServiceEndPoint: `${MAIN_URL}/api/service/`,
  BillingInvoiceEndPoint: `${MAIN_URL}/api/invoices`,
  getAllClientsEndPoint: `${MAIN_URL}/api/clients`,
  updateAppointmentEndPoint: `${MAIN_URL}/api/booking`,
  updateBillingInvoiceEndpoint: `${MAIN_URL}/api/invoices/`,
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  // tokenType: 'JWT',
  tokenType: 'JWT',
  tokenRefresh: 'refresh',
  typeBearer: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',

  storageRefreshTokenKeyName: 'refreshToken'
}
