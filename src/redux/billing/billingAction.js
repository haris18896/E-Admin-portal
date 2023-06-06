import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// ** Field Errors
// const fieldErrors = (err) => {
//   const errors = err?.response?.data
//   if (errors) {
//     Object.keys(errors).map((key) => {
//       toast((t) => (
//         <ToastContent
//           t={t}
//           name={key}
//           icon={<X size={14} />}
//           color="danger"
//           msg={
//             errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
//           }
//         />
//       ))
//     })
//   }
// }

//**   Get All Billing Invoice */

export const getAllBillingAction = createAsyncThunk(
  'billing/getAllBillings',
  async (
    { offset, limit, status, provider_type, search },
    { rejectWithValue }
  ) => {
    try {
      const response = await useJwt.getAllBillings({
        offset,
        limit,
        status,
        provider_type,
        search
      })
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**   Get Billing Invoice */
export const getBillingAction = createAsyncThunk(
  'billing/getBillings',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getBillings(id)
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**   Get Billing Invoice */
export const BillingInvoiceAction = createAsyncThunk(
  'billing/BillingInvoiceAction',
  async ({ data, id, callback }, { rejectWithValue }) => {
    try {
      const response = await useJwt.BillingInvoice(data, id)
      toast((t) => (
        <ToastContent
          t={t}
          name={'Email Invoice'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.response}
        />
      ))
      callback()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

//**   Post Billing Invoice */
export const updateBillingInvoiceAction = createAsyncThunk(
  'billing/updateBillingInvoiceAction',
  async ({ data, id }, { rejectWithValue, dispatch }) => {
    try {
      const response = await useJwt.updateBillingInvoice(data, id)
      dispatch(getAllBillingAction({ offset: 0, limit: 10 }))
      toast((t) => (
        <ToastContent
          t={t}
          name={'Status Updated '}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.response}
        />
      ))

      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching Billings'}
          icon={<X size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

// ** Handling Pagination
export const handlePageChange = createAsyncThunk(
  'billing/handlePageChange',
  async ({ offset, limit, status, provider_type, search }, { dispatch }) => {
    dispatch(
      getAllBillingAction({ offset, limit, status, provider_type, search })
    )
  }
)

// ** Handling Limit
export const handleLimitChange = createAsyncThunk(
  'billing/handleLimitChange',
  async (
    { oldLimit, newLimit, status, provider_type, search },
    { dispatch }
  ) => {
    if (newLimit !== oldLimit) {
      dispatch(
        getAllBillingAction({
          offset: 0,
          limit: newLimit,
          status,
          provider_type,
          search
        })
      )
    }
  }
)
