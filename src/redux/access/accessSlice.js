import { createSlice } from '@reduxjs/toolkit'

import {
  getAllLocksAction,
  getLockAction,
  createLockAction,
  updateLockAction,
  testLockAction,
  deleteLockAction
} from './accessAction'

export const AccessReducer = createSlice({
  name: 'access',
  initialState: {
    loading: false,
    testLoading: false,
    createLoading: false,
    getLockLoading: false,
    updateLoading: false,
    getAllLocks: {
      locksList: [],
      offset: 0,
      limit: 10,
      count: 0
    },
    getLock: null,
    testLock: null,
    createLock: null,
    updateLock: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get All Locks
      .addCase(getAllLocksAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllLocksAction.fulfilled, (state, action) => {
        state.loading = false
        state.getAllLocks.locksList = action.payload
        state.getAllLocks.offset = action.payload?.offset
        state.getAllLocks.limit = action.payload?.limit
        state.getAllLocks.count = action.payload?.count
      })
      .addCase(getAllLocksAction.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // Get Lock
      .addCase(getLockAction.pending, (state) => {
        state.getLockLoading = true
        state.getLock = null
      })
      .addCase(getLockAction.fulfilled, (state, action) => {
        state.getLockLoading = false
        state.getLock = action.payload
      })
      .addCase(getLockAction.rejected, (state, action) => {
        state.getLockLoading = false
        state.error = action.payload
      })

      // Create Lock
      .addCase(createLockAction.pending, (state) => {
        state.createLoading = true
      })
      .addCase(createLockAction.fulfilled, (state, action) => {
        state.createLoading = false
        state.createLock = action.payload
      })
      .addCase(createLockAction.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload
      })

      // Test Lock
      .addCase(testLockAction.pending, (state) => {
        state.testLoading = true
      })
      .addCase(testLockAction.fulfilled, (state, action) => {
        state.testLoading = false
        state.testLock = action.payload
      })
      .addCase(testLockAction.rejected, (state, action) => {
        state.testLoading = false
        state.error = action.payload
      })

      // Update Lock
      .addCase(updateLockAction.pending, (state) => {
        state.updateLoading = true
      })
      .addCase(updateLockAction.fulfilled, (state, action) => {
        state.updateLoading = false
        state.updateLock = action.payload
      })
      .addCase(updateLockAction.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload
      })

      // delete Lock
      .addCase(deleteLockAction.pending, (state) => {
        state.deleteLockPending = true
      })
      .addCase(deleteLockAction.fulfilled, (state, action) => {
        state.deleteLockPending = false
        state.deleteLock = action.payload
      })
      .addCase(deleteLockAction.rejected, (state, action) => {
        state.deleteLockPending = false
        state.error = action.payload
      })
  }
})

export default AccessReducer.reducer
