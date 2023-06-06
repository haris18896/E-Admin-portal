import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// components
// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

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

// ** Get All Tiers
export const getAllTiers = createAsyncThunk(
  'tiers/getAllTiers',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllTiers(id)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Tiers'}
          icon={<X size={14} />}
          color="danger"
          //   msg={err?.response?.data?.message}
          msg={'Something went wrong while fetching tiers'}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const updateTierAction = createAsyncThunk(
  'tiers/editTier',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateTier(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Tiers'}
          icon={<Check size={14} />}
          color="success"
          msg={'Tiers List Updated Successfully'}
        />
      ))

      dispatch(getAllTiers(id))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const addTierAction = createAsyncThunk(
  'tiers/addTier',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.addTier(id, data)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Tiers'}
          icon={<Check size={14} />}
          color="success"
          msg={'Tiers List Updated Successfully'}
        />
      ))

      dispatch(getAllTiers(id))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

export const removeTierAction = createAsyncThunk(
  'tiers/removeTier',
  async ({ id, tier_id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.removeTier(id, tier_id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Tiers'}
          icon={<Check size={14} />}
          color="success"
          msg={'Tiers List Updated Successfully'}
        />
      ))

      dispatch(getAllTiers(id))
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
