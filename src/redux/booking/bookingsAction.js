/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// ** Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name="Error While Updating Booking"
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.msg ||
            errors?.detail ||
            errors[key] ||
            errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

export const getAllBookingsAction = createAsyncThunk(
  'booking/getAllBookings',
  async (
    {
      offset,
      limit,
      startDate,
      endDate,
      search,
      status,
      location,
      room,
      callback
    },
    { rejectWithValue }
  ) => {
    try {
      callback()
      const response = await useJwt.getAllBookings({
        offset,
        limit,
        startDate,
        endDate,
        search,
        status,
        location,
        room
      })

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Bookings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getBookingByIdAction = createAsyncThunk(
  'booking/getBookingById',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.getBookingById(id)
      // dispatch(getAllBookingsAction({ offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getAllClientsAction = createAsyncThunk(
  'booking/getAllClients',
  async (data, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllClients(data)
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data?.detail)
    }
  }
)

export const getBookingByIdWithAppointmentAction = createAsyncThunk(
  'booking/getBookingByIdWithAppointment',
  async ({ id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getBookingByIdWithAppointment(id)

      if (response?.data?.result) {
        callback(response?.data?.result[0])
      }
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateBookingAction = createAsyncThunk(
  'booking/updateBooking',
  async ({ id, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateBooking(id, data)

      callback()
      toast((t) => (
        <ToastContent
          t={t}
          name={'Booking Update Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      if (response?.data) {
        dispatch(getBookingByIdAction(id))
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateAppointmentAction = createAsyncThunk(
  'booking/updateAppointment',
  async (
    { id, appointment_id, data, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateAppointment(id, appointment_id, data)
      callback()
      toast((t) => (
        <ToastContent
          t={t}
          name={'Appointment Details Update Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      if (response?.data) {
        dispatch(getAllBookingsAction({ offset: 0, limit: 10 }))
      }
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateAppointmentWithBookingAction = createAsyncThunk(
  'booking/updateAppointmentWithBooking',
  async (
    { id, appointment_id, data, booking_data, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateAppointment(id, appointment_id, data)
      if (response?.data) {
        dispatch(updateBookingAction({ id, data: booking_data, callback }))
      }

      return response?.data
    } catch (err) {
      if (err?.response?.status === 500) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Internal Server Error'}
            icon={<X size={14} />}
            color="danger"
            msg={err?.response?.data?.message}
          />
        ))
      } else {
        fieldErrors(err)
      }
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteBookingAction = createAsyncThunk(
  'booking/deleteBooking',
  async ({ id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteBooking(id)
      callback()
      dispatch(getAllBookingsAction({ offset: 0, limit: 100, callback }))
      toast((t) => (
        <ToastContent
          t={t}
          name={'Delete Booking  Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const cancelBookingAction = createAsyncThunk(
  'booking/cancelBooking',
  async ({ id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.cancelBooking(id)
      callback()
      dispatch(getAllBookingsAction({ offset: 0, limit: 100, callback }))
      toast((t) => (
        <ToastContent
          t={t}
          name={'Cancel Booking  Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      return response?.data
    } catch (err) {
      callback()
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const ValidateRoomAction = createAsyncThunk(
  'booking/ValidateRoom',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await useJwt.validateRoom(id, data)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching rooms'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.non_field_errors}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'booking/handlePageChange',
  async (
    { offset, limit, startDate, endDate, room, status, location, search },
    { dispatch }
  ) => {
    dispatch(
      getAllBookingsAction({
        offset,
        limit,
        startDate,
        endDate,
        room,
        status,
        location,
        search,
        callback: () => {}
      })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'booking/handleLimitChange',
  async (
    { oldLimit, newLimit, startDate, endDate, room, status, location, search },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllBookingsAction({
          offset: 0,
          limit: newLimit,
          startDate,
          endDate,
          room,
          status,
          location,
          search,
          callback: () => {}
        })
      )
    }
  }
)
