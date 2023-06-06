import { createSlice } from '@reduxjs/toolkit'
import {
  deleteServiceAction,
  getAdminAction,
  getAllAdminAction,
  getAllServiceAction,
  registerAdminAction,
  registerServiceAction,
  uploadAdminImageAction,
  deleteAdminAction,
  updateAdminAction
} from './systemActions'

export const SystemReducer = createSlice({
  name: 'system',
  initialState: {
    loading: false,
    adminLoading: false,
    deleteLoading: false,
    getLoading: false,
    registerAdmin: null,
    registerService: null,
    getAllAdminsData: {
      adminsList: [],
      offset: 0,
      limit: 10,
      count: 0
    },
    getAllServicesData: {
      servicesList: [],
      offset: 0,
      limit: 10,
      count: 0
    },
    deleteAdminLoading: false,
    adminImage: null,
    getAdmin: null,
    error: null
  },
  reducers: {
    resetGetAdmin: (state) => {
      state.registerAdmin = null
      state.getAdmin = null
      state.adminImage = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All Admins
      .addCase(getAllAdminAction.pending, (state) => {
        state.adminLoading = true
      })
      .addCase(getAllAdminAction.fulfilled, (state, action) => {
        state.adminLoading = false
        state.getAllAdminsData.adminsList = action.payload?.result
        state.getAllAdminsData.offset = action.payload?.offset
        state.getAllAdminsData.limit = action.payload?.limit
        state.getAllAdminsData.count = action.payload?.count
      })
      .addCase(getAllAdminAction.rejected, (state, action) => {
        state.adminLoading = false
        state.error = action.payload
      })

      // Get All Services
      .addCase(getAllServiceAction.pending, (state) => {
        state.listPending = true
      })
      .addCase(getAllServiceAction.fulfilled, (state, action) => {
        state.listPending = false
        state.getAllServicesData.servicesList = action.payload?.result
        state.getAllServicesData.offset = action.payload?.offset
        state.getAllServicesData.limit = action.payload?.limit
        state.getAllServicesData.count = action.payload?.count
      })
      .addCase(getAllServiceAction.rejected, (state, action) => {
        state.listPending = false
        state.error = action.payload
      })

      // Get Admin
      .addCase(getAdminAction.pending, (state) => {
        state.getLoading = true
      })
      .addCase(getAdminAction.fulfilled, (state, action) => {
        state.getLoading = false
        state.getAdmin = action.payload
      })
      .addCase(getAdminAction.rejected, (state, action) => {
        state.getLoading = false
        state.error = action.payload
        state.getAdmin = null
      })

      // Register Admin
      .addCase(registerAdminAction.pending, (state) => {
        state.adminRegisterLoading = true
        state.success = false
      })
      .addCase(registerAdminAction.fulfilled, (state, action) => {
        state.adminRegisterLoading = false
        state.registerAdmin = action.payload
        state.success = true
      })
      .addCase(registerAdminAction.rejected, (state, action) => {
        state.adminRegisterLoading = false
        state.error = action.payload
        state.success = false
      })

      // update Admin
      .addCase(updateAdminAction.pending, (state) => {
        state.adminRegisterLoading = true
        state.success = false
      })
      .addCase(updateAdminAction.fulfilled, (state, action) => {
        state.adminRegisterLoading = false
        state.registerAdmin = action.payload
        state.success = true
      })
      .addCase(updateAdminAction.rejected, (state, action) => {
        state.adminRegisterLoading = false
        state.error = action.payload
        state.success = false
      })

      // Register Service
      .addCase(registerServiceAction.pending, (state) => {
        state.serviceRegisterLoading = true
        state.success = false
      })
      .addCase(registerServiceAction.fulfilled, (state, action) => {
        state.serviceRegisterLoading = false
        state.registerService = action.payload
        state.success = true
      })
      .addCase(registerServiceAction.rejected, (state, action) => {
        state.serviceRegisterLoading = false
        state.error = action.payload
        state.success = false
      })

      // upload Admin image
      .addCase(uploadAdminImageAction.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadAdminImageAction.fulfilled, (state, action) => {
        state.imageError = null
        state.loading = false
        state.adminImage = action.payload
      })
      .addCase(uploadAdminImageAction.rejected, (state, action) => {
        state.adminImage = null
        state.loading = false
        state.error = action.payload
      })

      // Delete Service
      .addCase(deleteServiceAction.pending, (state) => {
        state.deleteLoading = true
        state.success = false
      })
      .addCase(deleteServiceAction.fulfilled, (state) => {
        state.deleteLoading = false
        state.success = true
      })
      .addCase(deleteServiceAction.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload
        state.success = false
      })

      // Delete Admin
      .addCase(deleteAdminAction.pending, (state) => {
        state.success = false
        state.deleteAdminLoading = true
      })
      .addCase(deleteAdminAction.fulfilled, (state) => {
        state.success = true
        state.deleteAdminLoading = false
      })
      .addCase(deleteAdminAction.rejected, (state, action) => {
        state.error = action.payload
        state.success = false
        state.deleteAdminLoading = false
      })

    // Update Lock
    // .addCase(updateLockAction.pending, (state) => {
    //   state.loading = true
    // })
    // .addCase(updateLockAction.fulfilled, (state, action) => {
    //   state.loading = false
    //   state.updateLock = action.payload
    // })
    // .addCase(updateLockAction.rejected, (state, action) => {
    //   state.loading = false
    //   state.error = action.payload
    // })
  }
})
export const { resetGetAdmin } = SystemReducer.actions
export default SystemReducer.reducer
