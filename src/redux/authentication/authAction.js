import jwt_decode from 'jwt-decode'
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

// Actions
export const login = createAsyncThunk(
  'auth/login',
  async ({ data, ability, navigate }, { rejectWithValue }) => {
    try {
      const response = await useJwt.login(data)
      const { access } = response.data
      useJwt.setToken(access)
      const decoded = jwt_decode(access)
      // const superuser = decoded?.is_superuser
      const is_staff = decoded?.is_staff
      if (is_staff) {
        useJwt.setUserData({ role: is_staff, decoded })
        const userData = useJwt.getUserData()
        toast((t) => (
          <ToastContent
            t={t}
            name={decoded?.username}
            icon={<Check size={14} />}
            color="success"
            msg={
              'You have successfully logged in as a staff to Ethera Admin'
            }
          />
        ))
        ability.update(userData.ability)
        navigate(getHomeRouteForLoggedInUser(is_staff))
      }
      if (!is_staff) {
        localStorage.clear()
        toast((t) => (
          <ToastContent
            t={t}
            name={decoded?.username}
            icon={<X size={14} />}
            color="danger"
            msg={'You do not have permission to perform this action'}
          />
        ))
      }
      return decoded
    } catch (err) {
      const errors = err?.response?.data
      if (errors && err?.response.status !== 401) {
        Object.keys(errors).map((key) => {
          toast((t) => (
            <ToastContent
              t={t}
              name={key}
              icon={<X size={14} />}
              color="danger"
              msg={
                errors[key][0] || errors?.non_field_errors?.[0] || err.message
              }
            />
          ))
        })
      } else if (err?.response.status === 401) {
        toast((t) => (
          <ToastContent
            t={t}
            name={'Login Error'}
            icon={<X size={14} />}
            color="danger"
            msg={errors?.detail}
          />
        ))
      }
      return rejectWithValue(err?.response?.data || err.message)
    }
  }
)
