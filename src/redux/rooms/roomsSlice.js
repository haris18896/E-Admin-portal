import { createSlice } from '@reduxjs/toolkit'

import {
  getAllRoomsAction,
  getRoomAction,
  addRoomAction,
  updateRoomAction,
  deleteRoomAction
} from './roomsAction'

export const RoomsReducer = createSlice({
  name: 'room',
  initialState: {
    loading: false,
    getAllRooms: {
      roomsList: [],
      total: 0,
      offset: 0,
      limit: 100
    },
    deletePending: false,
    getRoomPending: false,
    getRoom: null,
    addRoom: null,
    updateRoom: null,
    updateRoomPending: false
  },
  reducers: {
    resetAllRooms: (state) => {
      state.getAllRooms = {
        roomsList: []
      }
    },
    resetGetRoom: (state) => {
      state.getRoom = null
    },
    deleteRoomAuthorizationUser: (state, action) => {
      state.getRoom.room_authorization = state.getRoom.room_authorization.filter(element => {
        return element.user !== action.payload
      })
    },
    deleteAllRoomAuthorizationUsers: (state) => {
      state.getRoom.room_authorization = []
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

      // ** Get All Rooms Action
      .addCase(getAllRoomsAction.pending, (state) => {
        state.loading = true
      })
      .addCase(getAllRoomsAction.fulfilled, (state, action) => {
        success(state)
        state.getAllRooms.roomsList = action.payload?.result
        state.getAllRooms.total = action.payload?.count
        state.getAllRooms.offset = action.payload?.offset
        state.getAllRooms.limit = action.payload?.limit
      })
      .addCase(getAllRoomsAction.rejected, (state, action) => {
        error(state, action)
        state.getAllRooms = {
          roomsList: []
        }
      })

      // ** Get Room Action
      .addCase(getRoomAction.pending, (state) => {
        state.getRoomPending = true
      })
      .addCase(getRoomAction.fulfilled, (state, action) => {
        state.getRoomPending = false
        state.getRoom = action.payload
      })
      .addCase(getRoomAction.rejected, (state, action) => {
        error(state, action)
        state.getRoomPending = false
        state.getRoom = null
      })

      // ** Add Room Action
      .addCase(addRoomAction.pending, (state) => {
        state.loading = true
      })
      .addCase(addRoomAction.fulfilled, (state, action) => {
        success(state)
        state.addRoom = action.payload
      })
      .addCase(addRoomAction.rejected, (state, action) => {
        error(state, action)
        state.addRoom = null
      })

      // ** Update Room Action
      .addCase(updateRoomAction.pending, (state) => {
        state.updateRoomPending = true
      })
      .addCase(updateRoomAction.fulfilled, (state, action) => {
        state.updateRoomPending = false
        state.updateRoom = action.payload
      })
      .addCase(updateRoomAction.rejected, (state, action) => {
        error(state, action)
        state.updateRoomPending = false
        state.updateRoom = null
      })

      // ** Delete Room Action
      .addCase(deleteRoomAction.pending, (state) => {
        state.deletePending = true
      })
      .addCase(deleteRoomAction.fulfilled, (state) => {
        success(state)
        state.deletePending = false
      })
      .addCase(deleteRoomAction.rejected, (state, action) => {
        error(state, action)
        state.deletePending = false
      })
  }
})

export const { resetAllRooms, resetGetRoom, deleteRoomAuthorizationUser, deleteAllRoomAuthorizationUsers } = RoomsReducer.actions

export default RoomsReducer.reducer
