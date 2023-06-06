/* eslint-disable no-unused-vars */
import jwt_decode from 'jwt-decode'
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
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}
// ** Get All Providers List
export const getAllProviders = createAsyncThunk(
  'provider/getAllProviders',
  async (payload, { rejectWithValue }) => {
    const { offset, limit, search, provider_type, status } = payload
    try {
      const response = await useJwt.getAllProviders(
        offset,
        limit,
        search,
        provider_type,
        status
      )
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Providers'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Get Provider
export const getProviderAction = createAsyncThunk(
  'provider/getProvider',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getProvider(id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const uploadProviderImageAction = createAsyncThunk(
  'provider/uploadImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.providerImageUpload(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Provider Added Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      navigate('/providers')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateProviderImageAction = createAsyncThunk(
  'provider/updateImage',
  async ({ id, img, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.updateProviderImage(id, img)
      toast((t) => (
        <ToastContent
          t={t}
          name="Provider Image Update Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      navigate('/providers')
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Provider
export const registerProvider = createAsyncThunk(
  'provider/registerProvider',
  async ({ data, img, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.registerProvider(data)
      const token = await response?.data?.access
      const decoded = await jwt_decode(token)
      const id = await decoded?.user_id
      if (!!(img && id)) {
        const imageData = new FormData()
        imageData.append('image', img)

        dispatch(uploadProviderImageAction({ id, img: imageData, navigate }))
      }

      if (response?.data && !(img && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Provider Added Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))

        navigate('/providers')
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Update Provider
export const updateProviderAction = createAsyncThunk(
  'provider/updateProvider',
  async (
    { id, data, img, navigate, setActive },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateProvider(id, data)
      if (!!(img && id)) {
        dispatch(updateProviderImageAction({ id, img, navigate }))
      }

      if (response?.data && !(img && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Provider Update Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))
        navigate('/providers')
        setActive(0)
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Delete Multiple Providers
export const deleteMultipleProviders = createAsyncThunk(
  'provider/deleteMultipleProviders',
  async ({ ids, callBack }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.deleteMultipleProviders(ids)
      dispatch(getAllProviders({ offset: 0, limit: 10 }))

      callBack()
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Add Promo Credit
export const addPromoCreditAction = createAsyncThunk(
  'provider/addPromoCredit',
  async (
    { idx, data, setSelectedRows, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.addPromoCredit(idx, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={data?.status === 1 ? 'Add Promo Credit' : 'Remove Promo Credit'}
          icon={<Check size={14} />}
          color="success"
          msg={
            data?.status === 1
              ? 'Promo credit has been added Successfully'
              : 'Promo credit has been removed Successfully'
          }
        />
      ))
      dispatch(getProviderAction(idx))
      callback()
      setSelectedRows([])

      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** Bulk Add Promo Credit
export const bulkAddPromoCreditAction = createAsyncThunk(
  'provider/bulkAddPromoCredit',
  async (data, { rejectWithValue }) => {
    try {
      const { callback } = data
      const response = await useJwt.bulkAddPromoCredit(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={
            data?.status === 1
              ? 'Bulk Add Promo Credit'
              : 'Bulk remove Promo Credit'
          }
          icon={<Check size={14} />}
          color="success"
          msg={
            data?.status === 1
              ? 'Bulk Promo Credit added to selected providers'
              : 'Bulk Promo Credit removed to selected providers'
          }
        />
      ))
      callback()
      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** Get Promo Credit
export const getPromoCreditAction = createAsyncThunk(
  'provider/getPromoCredit',
  async (idx, { rejectWithValue }) => {
    try {
      const response = await useJwt.getPromoCredit(idx)
      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** Add Ethera Credit
export const addEtheraCreditAction = createAsyncThunk(
  'provider/addEtheraCredit',
  async (
    { idx, data, setSelectedRows, callback },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.addEtheraCredit(idx, data)
      if (response?.data) {
        toast((t) => (
          <ToastContent
            t={t}
            name={
              data?.status === 1 ? 'Add Ethera Credit' : 'Remove Ethera Credit'
            }
            icon={<Check size={14} />}
            color="success"
            msg={
              data?.status === 1
                ? 'Ethera credit has been added Successfully'
                : 'Ethera credit has been removed Successfully'
            }
          />
        ))
        dispatch(getProviderAction(idx))
        callback()
        setSelectedRows([])
      }

      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** Bulk Add Promo Credit
export const bulkAddEtheraCreditAction = createAsyncThunk(
  'provider/bulkAddEtheraCreditAction',
  async (data, { rejectWithValue }) => {
    try {
      const { callback } = data
      const response = await useJwt.bulkAddEtheraCredit(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={
            data?.status === 1
              ? 'Bulk Add Ethera Credit'
              : ' Bulk remove Ethera Credit'
          }
          icon={<Check size={14} />}
          color="success"
          msg={
            data?.status === 1
              ? 'Bulk Ethera Credit added to selected providers'
              : 'Bulk Ethera Credit removed to selected providers'
          }
        />
      ))
      callback()
      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** get Ethera Credit
export const getEtheraCreditAction = createAsyncThunk(
  'provider/getEtheraCredit',
  async (idx, { rejectWithValue }) => {
    try {
      const response = await useJwt.getEtheraCredit(idx)
      return response?.data
    } catch (error) {
      return rejectWithValue(error?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'provider/handlePageChange',
  async ({ offset, limit, status, search, provider_type }, { dispatch }) => {
    dispatch(getAllProviders({ offset, limit, status, search, provider_type }))
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'provider/handleLimitChange',
  async (
    { oldLimit, newLimit, status, search, provider_type },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllProviders({
          offset: 0,
          limit: newLimit,
          status,
          search,
          provider_type
        })
      )
    }
  }
)
