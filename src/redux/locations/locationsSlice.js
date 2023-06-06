import { createSlice } from '@reduxjs/toolkit'

import {
  getAllLocationsAction,
  getLocationAction,
  registerLocationAction,
  updateLocationAction,
  getAllTiersAction,
  addTierAction,
  uploadLocationImageAction,
  deleteLocationAction
} from './locationsAction'

export const LocationsReducer = createSlice({
  name: 'location',
  initialState: {
    loading: false,
    loadingImage: false,
    imageError: null,
    registerLocation: null,
    DeleteLoading: false,
    getAllLocations: {
      locationsList: []
    },
    getLocation: null,
    updateLocation: null,
    getAllTiers: null,
    addTier: null
  },
  reducers: {
    resetGetLocation: (state) => {
      state.getLocation = null
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
      // Register Location
      .addCase(registerLocationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(registerLocationAction.fulfilled, (state, action) => {
        success(state)
        state.registerLocation = action.payload
      })
      .addCase(registerLocationAction.rejected, (state, action) => {
        error(state, action)
        state.registerLocation = null
      })

      // Get All Locations
      .addCase(getAllLocationsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllLocationsAction.fulfilled, (state, action) => {
        success(state)
        state.getAllLocations.locationsList = action.payload?.result
      })
      .addCase(getAllLocationsAction.rejected, (state, action) => {
        error(state, action)
        state.getAllLocations.locationsList = []
      })

      // Get Location
      .addCase(getLocationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getLocationAction.fulfilled, (state, action) => {
        success(state)
        state.getLocation = action.payload
      })
      .addCase(getLocationAction.rejected, (state, action) => {
        error(state, action)
        state.getLocation = null
      })

      // Update Location
      .addCase(updateLocationAction.pending, (state) => {
        state.loading = true
      })
      .addCase(updateLocationAction.fulfilled, (state, action) => {
        success(state)
        state.updateLocation = action.payload
      })
      .addCase(updateLocationAction.rejected, (state, action) => {
        error(state, action)
        state.updateLocation = null
      })

      // upload location image
      .addCase(uploadLocationImageAction.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadLocationImageAction.fulfilled, (state, action) => {
        state.imageError = null
        state.loadingImage = false
        state.getAllLocations.locationsList = action.payload?.result
      })
      .addCase(uploadLocationImageAction.rejected, (state, action) => {
        state.locationImage = null
        state.loadingImage = false
        state.imageError = action.payload
      })
      // upload location image
      .addCase(deleteLocationAction.pending, (state) => {
        state.DeleteLoading = true
      })
      .addCase(deleteLocationAction.fulfilled, (state) => {
        state.error = null
        state.DeleteLoading = false
      })
      .addCase(deleteLocationAction.rejected, (state, action) => {
        state.DeleteLoading = false
        state.error = action.payload
      })

      // Get All Tiers
      .addCase(getAllTiersAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllTiersAction.fulfilled, (state, action) => {
        success(state)
        state.getAllTiers = action.payload
      })
      .addCase(getAllTiersAction.rejected, (state, action) => {
        error(state, action)
        state.getAllTiers = null
      })

      // Add Tier
      .addCase(addTierAction.pending, (state) => {
        state.loading = true
      })
      .addCase(addTierAction.fulfilled, (state, action) => {
        success(state)
        state.addTier = action.payload
      })
      .addCase(addTierAction.rejected, (state, action) => {
        error(state, action)
        state.addTier = null
      })
  }
})
export const {resetGetLocation} = LocationsReducer.actions

export default LocationsReducer.reducer
