import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

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
            (key === 'location'
              ? 'Location is required to add a lock'
              : errors[key][0]) ||
            errors?.detail ||
            errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

export const getAllLocksAction = createAsyncThunk(
  'lock/getAllLocks',
  async ({ offset, limit }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllLocks(offset, limit)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locks'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const getLockAction = createAsyncThunk(
  'lock/getLock',
  async ({ location, id }, { rejectWithValue }) => {
    try {
      const response = await useJwt.getLock(location, id)

      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const createLockAction = createAsyncThunk(
  'lock/createLock',
  async ({ id, data, callBack }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.createLock(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Lock Created Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllLocksAction({ offset: 0, limit: 10 }))
      callBack()

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const testLockAction = createAsyncThunk(
  'lock/testLock',
  async ({ token, callBack }, { rejectWithValue }) => {
    try {
      const response = await useJwt.testLock({ token })

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Lock Test Successfully'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data?.message)
    } finally {
      callBack()
    }
  }
)

export const updateLockAction = createAsyncThunk(
  'lock/updateLock',
  async ({ location, id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateLock(location, id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Lock update Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllLocksAction({ offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Location
export const deleteLockAction = createAsyncThunk(
  'access/deleteLock',
  async ({ location, id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteLock(location, id)
      toast((t) => (
        <ToastContent
          t={t}
          name="Lock Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      dispatch(getAllLocksAction({ offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'lock/handlePageChange',
  async ({ offset, limit }, { dispatch }) => {
    dispatch(getAllLocksAction({ offset, limit }))
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'lock/handleLimitChange',
  async ({ oldLimit, newLimit }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(getAllLocksAction({ offset: 0, limit: newLimit }))
    }
  }
)
