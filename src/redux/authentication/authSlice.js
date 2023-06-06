/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createSlice } from '@reduxjs/toolkit'

import { login } from './authAction'

const initialUser = () => {
  const item = useJwt.getUserData()
  return item ? item : {}
}

// Reducers
export const AuthReducer = createSlice({
  name: 'auth',
  initialState: {
    loginInProgress: false,
    user: initialUser()
  },
  reducers: {
    handleLogout: (state) => {
      state.user = {}
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loginInProgress = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginInProgress = false
        state.error = null
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.loginInProgress = false
        state.error = action.payload
        state.user = null
      })
  }
})

export const { handleLogout } = AuthReducer.actions

export default AuthReducer.reducer