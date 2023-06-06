import { createSlice } from '@reduxjs/toolkit'

import { BillingInvoiceAction, getAllBillingAction, getBillingAction, updateBillingInvoiceAction } from './billingAction'

export const BillingReducer = createSlice({
  name: 'billing',
  initialState: {
    loading: false,
    invoiceLoading: false,
    statusUpdated: null,
    invoiceStatusLoading: false,
    getAllBillings: {
      billingsList: [],
      offset: 0,
      limit: 10,
      total: 0
    },
    getBilling: null,
    emailInvoice:null,
    error: null
  },
  reducers: {
    resetBillings: (state) => {
      state.getAllBillings = {
        billingsList: [],
        offset: 0,
        limit: 10,
        total: 0
      }
    }
  },
  extraReducers: (builder) => {
    builder

      // Get all billings
      .addCase(getAllBillingAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllBillingAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllBillings.billingsList = action.payload?.result
        state.getAllBillings.offset = action.payload?.offset
        state.getAllBillings.limit = action.payload?.limit
        state.getAllBillings.total = action.payload?.count
      })
      .addCase(getAllBillingAction.rejected, (state, action) => {
        state.loading = false
        state.getAllBillings = {
          billingsList: [],
          offset: 0,
          limit: 10,
          total: 0
        }
        state.error = action.payload
      })

      // Get  billings
      .addCase(getBillingAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getBillingAction.fulfilled, (state, action) => {
        state.loading = false
        state.getBilling = action.payload
      })
      .addCase(getBillingAction.rejected, (state, action) => {
        state.loading = false
        state.getBilling = null
        state.error = action.payload
      })

       // Register Email Invoice
       .addCase(BillingInvoiceAction.pending, (state) => {
        state.invoiceLoading = true
      })
      .addCase(BillingInvoiceAction.fulfilled, (state, action) => {
        state.invoiceLoading = false
        state.emailInvoice = action.payload
      })
      .addCase(BillingInvoiceAction.rejected, (state, action) => {
        state.invoiceLoading = false
        state.emailInvoice = null
        state.error = action.payload
      })

       //  Status Updated
       .addCase(updateBillingInvoiceAction.pending, (state) => {
        state.invoiceStatusLoading = true
      })
      .addCase(updateBillingInvoiceAction.fulfilled, (state, action) => {
        state.invoiceStatusLoading = false
        state.statusUpdated = action.payload
      })
      .addCase(updateBillingInvoiceAction.rejected, (state, action) => {
        state.invoiceStatusLoading = false
        state.statusUpdated = null
        state.error = action.payload
      })
  }
})

export const { resetBillings } = BillingReducer.actions

export default BillingReducer.reducer
