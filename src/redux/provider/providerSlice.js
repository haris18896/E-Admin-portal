/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'

import {
  registerProvider,
  getAllProviders,
  getProviderAction,
  updateProviderAction,
  uploadProviderImageAction,
  updateProviderImageAction,
  deleteMultipleProviders,
  addPromoCreditAction,
  getEtheraCreditAction,
  getPromoCreditAction,
  addEtheraCreditAction,
  bulkAddPromoCreditAction,
  bulkAddEtheraCreditAction
} from './providerAction'

export const ProviderReducer = createSlice({
  name: 'provider',
  initialState: {
    loading: false,
    loadingImage: false,
    imageError: null,
    registerProvider: null,
    addPromoCreditLoading: false,
    addEtheraCreditLoading: false,
    bulkAddPromoCreditLoading: false,
    bulkAddEtheraCreditLoading: false,
    getAllProvidersData: {
      providersList: [],
      count: 0,
      offset: 0,
      limit: 10
    },
    deletePending: false,
    getProvider: null,
    updateProvider: null,
    providerImage: null,
    addPromoCredit: null,
    getPromo: null,
    getEthera: null,
    addEtheraCredit: null,
    bulkAddPromoCredit: null,
    bulkAddEtheraCredit: null
  },
  reducers: {
    resetGetProvider: (state) => {
      state.getProvider = null
    },
    resetProvidersList: (state) => {
      state.getAllProvidersData = {
        providersList: [],
        count: 0,
        offset: 0,
        limit: 10
      }
    }
  },
  extraReducers: (builder) => {
    const success = (state) => {
      state.loading = false
      state.error = null
    }

    const error = (state, action) => {
      state.loading = false
      state.error = action.payload
    }

    builder

      // Register Provider
      .addCase(registerProvider.pending, (state) => {
        state.loading = true
      })
      .addCase(registerProvider.fulfilled, (state, action) => {
        success(state)
        state.registerProvider = action.payload
      })
      .addCase(registerProvider.rejected, (state, action) => {
        error(state, action)
        state.registerProvider = null
      })

      // Get All Providers
      .addCase(getAllProviders.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllProviders.fulfilled, (state, action) => {
        success(state)
        state.getAllProvidersData.providersList = action.payload?.result
        state.getAllProvidersData.count = action.payload?.count
        state.getAllProvidersData.limit = action.payload?.limit
        state.getAllProvidersData.offset = action.payload?.offset
      })
      .addCase(getAllProviders.rejected, (state, action) => {
        error(state, action)
        state.getAllProvidersData.providersList = []
        state.getAllProvidersData.count = 0
      })

      // Get Provider
      .addCase(getProviderAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getProviderAction.fulfilled, (state, action) => {
        success(state)
        state.getProvider = action.payload
      })
      .addCase(getProviderAction.rejected, (state, action) => {
        error(state, action)
        state.getProvider = null
      })

      // Update Provider
      .addCase(updateProviderAction.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProviderAction.fulfilled, (state, action) => {
        success(state)
        state.updateProvider = action.payload
      })
      .addCase(updateProviderAction.rejected, (state, action) => {
        error(state, action)
        state.updateProvider = null
      })

      // upload provider image
      .addCase(uploadProviderImageAction.pending, (state) => {
        state.loadingImage = true
      })
      .addCase(uploadProviderImageAction.fulfilled, (state) => {
        state.imageError = null
        state.loadingImage = false
      })
      .addCase(uploadProviderImageAction.rejected, (state, action) => {
        state.loadingImage = false
        state.uploadImageError = action.payload
      })

      // update image
      .addCase(updateProviderImageAction.pending, (state) => {
        state.loadingImage = true
      })
      .addCase(updateProviderImageAction.fulfilled, (state) => {
        state.imageError = null
        state.loadingImage = false
      })
      .addCase(updateProviderImageAction.rejected, (state, action) => {
        state.loadingImage = false
        state.updateImageError = action.payload
      })

      // Add PromoCredit
      .addCase(addPromoCreditAction.pending, (state) => {
        state.addPromoCreditLoading = true
      })
      .addCase(addPromoCreditAction.fulfilled, (state, action) => {
        state.addPromoCreditLoading = false
        state.addPromoCredit = action.payload
        state.error = null
      })
      .addCase(addPromoCreditAction.rejected, (state, action) => {
        state.addPromoCredit = null
        state.addPromoCreditLoading = false
        state.error = action.payload
      })

      // Add Bulk PromoCredit
      .addCase(bulkAddPromoCreditAction.pending, (state) => {
        state.bulkAddPromoCreditLoading = true
      })
      .addCase(bulkAddPromoCreditAction.fulfilled, (state, action) => {
        state.bulkAddPromoCreditLoading = false
        state.bulkAddPromoCredit = action.payload
        state.error = null
      })
      .addCase(bulkAddPromoCreditAction.rejected, (state, action) => {
        state.bulkAddPromoCredit = null
        state.bulkAddPromoCreditLoading = false
        state.error = action.payload
      })

      // Add Ethera Credit
      .addCase(addEtheraCreditAction.pending, (state) => {
        state.addEtheraCreditLoading = true
      })
      .addCase(addEtheraCreditAction.fulfilled, (state, action) => {
        state.addEtheraCreditLoading = false
        state.addEtheraCredit = action.payload
        state.error = null
      })
      .addCase(addEtheraCreditAction.rejected, (state, action) => {
        state.addEtheraCredit = null
        state.addEtheraCreditLoading = false
        state.error = action.payload
      })

      // Add Bulk Ethera Credit
      .addCase(bulkAddEtheraCreditAction.pending, (state) => {
        state.bulkAddEtheraCreditLoading = true
      })
      .addCase(bulkAddEtheraCreditAction.fulfilled, (state, action) => {
        state.bulkAddEtheraCreditLoading = false
        state.bulkAddEtheraCredit = action.payload
        state.error = null
      })
      .addCase(bulkAddEtheraCreditAction.rejected, (state, action) => {
        state.bulkAddEtheraCredit = null
        state.bulkAddEtheraCreditLoading = false
        state.error = action.payload
      })

      // Get PromoCredit
      .addCase(getPromoCreditAction.pending, (state) => {
        state.creditPending = true
      })
      .addCase(getPromoCreditAction.fulfilled, (state, action) => {
        state.imageError = null
        state.creditPending = false
        state.getPromo = action.payload
      })
      .addCase(getPromoCreditAction.rejected, (state, action) => {
        state.getPromo = null
        state.creditPending = false
        state.imageError = action.payload
      })

      // Get EtheraCredit
      .addCase(getEtheraCreditAction.pending, (state) => {
        state.creditPending = true
      })
      .addCase(getEtheraCreditAction.fulfilled, (state, action) => {
        state.imageError = null
        state.creditPending = false
        state.getEthera = action.payload
      })
      .addCase(getEtheraCreditAction.rejected, (state, action) => {
        state.getEthera = null
        state.creditPending = false
        state.imageError = action.payload
      })

      // Delete Multiple Providers
      .addCase(deleteMultipleProviders.pending, (state) => {
        state.deletePending = true
      })
      .addCase(deleteMultipleProviders.fulfilled, (state) => {
        state.deletePending = false
        state.deleteError = null
      })
      .addCase(deleteMultipleProviders.rejected, (state, action) => {
        state.deletePending = false
        state.deleteError = action.payload
      })
  }
})

export const { resetGetProvider, resetProvidersList } = ProviderReducer.actions

export default ProviderReducer.reducer
