import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'
import { resetGetRoom } from './roomsSlice'

// Field Errors
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name={key}
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

// ** Get All Rooms List
export const getAllRoomsAction = createAsyncThunk(
  'room/getAllRooms',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllRooms(id)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching rooms'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Room
export const getRoomAction = createAsyncThunk(
  'room/getRoom',
  async ({ id, room_id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getRoom(id, room_id)
      callback(response)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching room'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Room
export const addRoomAction = createAsyncThunk(
  'room/addRoom',
  async ({ id, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.addRoom(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Room Added'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllRoomsAction({ id }))
      dispatch(resetGetRoom())
      callback()
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Room
export const updateRoomAction = createAsyncThunk(
  'room/updateRoom',
  async ({ id, room_id, data, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateRoom(id, room_id, data)

      toast((t) => (
        <ToastContent
          t={t}
          name={'Room Updated'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllRoomsAction({ id }))
      dispatch(getRoomAction({ id, room_id, callback }))

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const deleteRoomAction = createAsyncThunk(
  'room/deleteRoom',
  async ({ id, room_id, callback }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteRoom(id, room_id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Room Deleted'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllRoomsAction({ id }))
      dispatch(resetGetRoom())
      callback()

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
