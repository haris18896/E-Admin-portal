// ** Redux Imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import navbar from './navbar'
import layout from './layout'
import LocationsReducer from './locations/locationsSlice'
import ProviderReducer from './provider/providerSlice'
import AuthReducer from './authentication/authSlice'
import BookingsReducer from './booking/bookingSlice'
import BillingReducer from './billing/billingSlice'
import AccessReducer from './access/accessSlice'
import TiersReducer from './tiers/tiersSlice'
import RoomsReducer from './rooms/roomsSlice'
import SystemReducer from './system/systemSlice'

const store = configureStore({
  reducer: {
    navbar,
    layout,
    auth: AuthReducer,
    provider: ProviderReducer,
    locations: LocationsReducer,
    access: AccessReducer,
    tiers: TiersReducer,
    rooms: RoomsReducer,
    booking: BookingsReducer,
    billing: BillingReducer,
    system: SystemReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false
    })
  }
})

export { store }
