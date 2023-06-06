import { createSlice } from '@reduxjs/toolkit'

import {
  getAllTiers,
  updateTierAction,
  removeTierAction,
  addTierAction
} from './tiersAction'

export const TiersReducer = createSlice({
  name: 'tiers',
  initialState: {
    loading: false,
    getAllTiersData: {
      tiersList: []
    },
    addPending: false,
    updatePending: false,
    editTier: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTiers.pending, (state) => {
        state.loading = true
      })

      .addCase(getAllTiers.fulfilled, (state, action) => {
        state.loading = false
        state.getAllTiersData.tiersList = action.payload?.result
      })
      .addCase(getAllTiers.rejected, (state, action) => {
        state.loading = false
        state.getAllTiersData.tiersList = []
        state.error = action.payload
      })

      .addCase(updateTierAction.pending, (state) => {
        state.updatePending = true
      })

      .addCase(updateTierAction.fulfilled, (state, action) => {
        state.updatePending = false
        state.editTier = action.payload
      })

      .addCase(updateTierAction.rejected, (state, action) => {
        state.updatePending = false
        state.editTier = null
        state.error = action.payload
      })

      // ** Remove Tier
      .addCase(removeTierAction.pending, (state) => {
        state.deleteTier = true
      })
      .addCase(removeTierAction.fulfilled, (state, action) => {
        state.deleteTier = false
        state.removeTier = action.payload
      })
      .addCase(removeTierAction.rejected, (state, action) => {
        state.deleteTier = false
        state.removeTier = null
        state.error = action.payload
      })

      // ** Add Tier
      .addCase(addTierAction.pending, (state) => {
        state.addPending = true
      })
      .addCase(addTierAction.fulfilled, (state, action) => {
        state.addPending = false
        state.addTier = action.payload
      })
      .addCase(addTierAction.rejected, (state, action) => {
        state.addPending = false
        state.addTier = null
        state.error = action.payload
      })
  }
})

export default TiersReducer.reducer
