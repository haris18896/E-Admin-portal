/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

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
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}
// ** Get All Locations List
export const getAllLocationsAction = createAsyncThunk(
  'location/getAllLocations',
  async (payload, { rejectWithValue }) => {
    try {
      // const { callBack } = payload
      const response = await useJwt.getAllLocations()

      // callBack()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locations'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Location
export const getLocationAction = createAsyncThunk(
  'location/getLocation',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getLocation(id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// Add Location Image
export const uploadLocationImageAction = createAsyncThunk(
  'location/uploadImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.locationImageUpload(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Location  Added Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      navigate('/locations')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Location
export const registerLocationAction = createAsyncThunk(
  'location/registerLocation',
  async ({ data, image, roomMap, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerLocation(data)
      const id = response?.data?.id
      const imageData = new FormData()
      if (image) imageData.append('image', image)
      if (roomMap) imageData.append('room_map', roomMap)

      if (id) {
        dispatch(uploadLocationImageAction({ id, img: imageData, navigate }))
      }
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Location Image
export const updateLocationImageAction = createAsyncThunk(
  'location/uploadImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateLocationImage(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Location Image Update Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      navigate('/locations')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Location
export const updateLocationAction = createAsyncThunk(
  'location/updateLocation',
  async (
    { id, data, image, roomMap, navigate },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await useJwt.updateLocation(id, data)
      const imageData = new FormData()
      if (image) imageData.append('image', image)
      if (roomMap) imageData.append('room_map', roomMap)

      if (!!(image && id) || !!(roomMap && id)) {
        dispatch(updateLocationImageAction({ id, img: imageData, navigate }))
      }

      if (response?.data && !image && !roomMap) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Location Update Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
        navigate('/locations')
      }
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Location
export const deleteLocationAction = createAsyncThunk(
  'location/deleteLocation',
  async ({ id, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.deleteLocation(id)
      toast((t) => (
        <ToastContent
          t={t}
          name="Location Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      navigate('/locations')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Multiple locations
export const deleteMultipleLocations = createAsyncThunk(
  'location/deleteMultipleLocations',
  async (ids, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.deleteMultipleLocations(ids)
      dispatch(getAllLocationsAction({ offset: 0, limit: 10 }))
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'location/handlePageChange',
  async ({ offset, limit }, { dispatch }) => {
    dispatch(getAllLocationsAction({ offset, limit }))
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'location/handleLimitChange',
  async ({ oldLimit, newLimit }, { dispatch }) => {
    if (newLimit !== oldLimit) {
      dispatch(getAllLocationsAction({ offset: 0, limit: newLimit }))
    }
  }
)

// ** Get All Tiers
export const getAllTiersAction = createAsyncThunk(
  'location/getAllTiers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllTiers()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Tiers'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Tier
export const addTierAction = createAsyncThunk(
  'location/addTier',
  async (data, { rejectWithValue }) => {
    try {
      const response = await useJwt.addTier(data)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Adding Tier'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)
