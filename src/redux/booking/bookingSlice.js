/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

import {
  getAllBookingsAction,
  getBookingByIdAction,
  updateBookingAction,
  cancelBookingAction,
  deleteBookingAction,
  ValidateRoomAction,
  getAllClientsAction,
  updateAppointmentAction,
  updateAppointmentWithBookingAction,
  getBookingByIdWithAppointmentAction
} from './bookingsAction'

export const BookingsReducer = createSlice({
  name: 'booking',
  initialState: {
    loading: false,
    getAllBookings: {
      bookingsList: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    bookingPending: false,
    updatePending: false,
    getBooking: {},
    updateBooking: {},
    deletePending: false,
    success: false,
    cancelPending: false,
    error: null,
    validRoomsPending: false,
    validRoomsData: {
      offset: 0,
      limit: 100,
      total: 0,
      rooms: []
    },

    getBookingWithAppointmentPending: false,
    getBookingWithAppointment: {
      offset: 0,
      limit: 10,
      total: 0,
      result: []
    },
    clientsPending: false,
    getAllClients: null,
    updatePending: false,
    updateAppointmentWithBooking: null,
    updateAppointment: null
  },
  reducers: {
    resetBookings: (state) => {
      state.getAllBookings = {
        bookingsList: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    },
    resetValidateRoom: (state) => {
      state.validRoomsData = {
        offset: 0,
        limit: 100,
        total: 0,
        rooms: []
      }
    },
    // resetBookingWithAppointment: (state) => {
    //   state.updateBookingWithAppointment = null
    // },
    resetAppointment: (state) => {
      state.updateAppointment = null
    }
  },
  extraReducers: (builder) => {
    builder

      // ** Get all bookings
      .addCase(getAllBookingsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllBookingsAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllBookings.bookingsList = action.payload?.result
        state.getAllBookings.offset = action.payload?.offset
        state.getAllBookings.limit = action.payload?.limit
        state.getAllBookings.total = action.payload?.count
      })
      .addCase(getAllBookingsAction.rejected, (state, action) => {
        state.loading = false
        state.getAllBookings = {
          bookingsList: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // ** Get booking by id
      .addCase(getBookingByIdAction.pending, (state) => {
        state.bookingPending = true
      })
      .addCase(getBookingByIdAction.fulfilled, (state, action) => {
        state.bookingPending = false
        state.getBooking = action.payload
      })
      .addCase(getBookingByIdAction.rejected, (state, action) => {
        state.bookingPending = false
        state.getBooking = {}
        state.error = action.payload
      })

      // ** Get booking by id with appointment
      .addCase(getBookingByIdWithAppointmentAction.pending, (state) => {
        state.getBookingWithAppointmentPending = true
      })
      .addCase(
        getBookingByIdWithAppointmentAction.fulfilled,
        (state, action) => {
          state.getBookingWithAppointmentPending = false
          state.getBookingWithAppointment.result = action.payload?.result
          state.getBookingWithAppointment.offset = action.payload?.offset
          state.getBookingWithAppointment.limit = action.payload?.limit
          state.getBookingWithAppointment.total = action.payload?.count
        }
      )

      // ** Update booking
      .addCase(updateBookingAction.pending, (state) => {
        state.updatePending = true
        state.success = false
      })
      .addCase(updateBookingAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.success = true
        state.updateBooking = action.payload
      })
      .addCase(updateBookingAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateBooking = {}
        state.success = false
        state.error = action.payload
      })

      // ** Delete Booking
      .addCase(deleteBookingAction.pending, (state) => {
        state.deletePending = true
        state.success = false
      })
      .addCase(deleteBookingAction.fulfilled, (state) => {
        state.deletePending = false
        state.success = true
      })
      .addCase(deleteBookingAction.rejected, (state, action) => {
        state.deletePending = false
        state.success = false
        state.error = action.payload
      })

      // ** cancel booking
      .addCase(cancelBookingAction.pending, (state) => {
        state.cancelPending = true
      })
      .addCase(cancelBookingAction.fulfilled, (state) => {
        state.cancelPending = false
      })
      .addCase(cancelBookingAction.rejected, (state, action) => {
        state.cancelPending = false
        state.success = false
        state.error = action.payload
      })

      .addCase(ValidateRoomAction.pending, (state) => {
        state.validRoomsPending = true
      })
      .addCase(ValidateRoomAction.fulfilled, (state, action) => {
        state.validRoomsPending = false
        state.validRoomsData.rooms = action.payload?.result
        state.validRoomsData.offset = action.payload?.offset
        state.validRoomsData.limit = action.payload?.limit
        state.validRoomsData.total = action.payload?.count
      })
      .addCase(ValidateRoomAction.rejected, (state, action) => {
        state.validRoomsPending = false
        state.validRoomsData = {
          offset: 0,
          limit: 100,
          total: 0,
          rooms: []
        }
        state.error = action.payload
      })

      // ** Get all clients
      .addCase(getAllClientsAction.pending, (state) => {
        state.clientsPending = true
      })
      .addCase(getAllClientsAction.fulfilled, (state, action) => {
        state.clientsPending = false
        state.getAllClients = action.payload?.result
      })
      .addCase(getAllClientsAction.rejected, (state, action) => {
        state.clientsPending = false
        state.getAllClients = null
        state.error = action.payload
      })

      .addCase(updateAppointmentWithBookingAction.pending, (state) => {
        state.updatePending = true
      })
      .addCase(
        updateAppointmentWithBookingAction.fulfilled,
        (state, action) => {
          state.updatePending = false
          state.updateAppointmentWithBooking = action.payload
        }
      )
      .addCase(updateAppointmentWithBookingAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateAppointmentWithBooking = {}
        state.error = action.payload
      })

      .addCase(updateAppointmentAction.pending, (state) => {
        state.updatePending = true
      })
      .addCase(updateAppointmentAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.updateAppointment = action.payload
      })
      .addCase(updateAppointmentAction.rejected, (state, action) => {
        state.updatePending = false
        state.updateAppointment = {}
        state.error = action.payload
      })
  }
})

export const {
  resetBookings,
  resetValidateRoom,
  // resetBookingWithAppointment,
  resetAppointment
} = BookingsReducer.actions

export default BookingsReducer.reducer
