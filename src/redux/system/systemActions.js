/* eslint-disable no-unused-vars */
import useJwt from '@src/auth/jwt/useJwt'
import { createAsyncThunk } from '@reduxjs/toolkit'

// ** components
import toast from 'react-hot-toast'
import { Check, X } from 'react-feather'
import { ToastContent } from '@src/components/toast'

////////////******************************    Field Errors  ***************************//////////////
const fieldErrors = (err) => {
  const errors = err?.response?.data
  if (errors) {
    Object.keys(errors).map((key) => {
      toast((t) => (
        <ToastContent
          t={t}
          name={key}
          icon={<X size={14} />}
          color="danger"
          msg={
            errors?.detail || errors[key][0] || errors?.non_field_errors?.[0]
          }
        />
      ))
    })
  }
}

////////////******************************   Get All Admin  ***************************//////////////
export const getAllAdminAction = createAsyncThunk(
  'system/getAllAdmins',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllAdmins()
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    UPload Admin Image  ***************************//////////////
export const uploadAdminImageAction = createAsyncThunk(
  'system/uploadImage',
  async ({ id, image, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.AdminImageUpload(id, image)

      if (response?.data) {
        dispatch(getAllAdminAction())
      }

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    Register Admin  ***************************//////////////
export const registerAdminAction = createAsyncThunk(
  'system/registerAdmin',
  async (
    { data, image, navigate, callBack },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.registerAdmin(data)
      const id = response?.data?.id
      if (!!(id && image)) {
        const imageData = new FormData()
        imageData.append('image', image)
        dispatch(uploadAdminImageAction({ id, image: imageData, navigate }))
        toast((t) => (
          <ToastContent
            t={t}
            name={'Admin Added Successfully'}
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))

        callBack()
        return response?.data
      }

      toast((t) => (
        <ToastContent
          t={t}
          name={'Admin Added Successfully'}
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))

      if (!image && response?.data) {
        dispatch(getAllAdminAction())
      }

      callBack()
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    Get All Service  ***************************//////////////
export const getAllServiceAction = createAsyncThunk(
  'system/getAllService',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAllService()
      return response?.data
    } catch (err) {
      toast((t) => (
        <ToastContent
          t={t}
          name={'Error Fetching locks'}
          icon={<Check size={14} />}
          color="danger"
          msg={err?.response?.data?.message}
        />
      ))
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    Register Service  ***************************//////////////
export const registerServiceAction = createAsyncThunk(
  'system/registerService',
  async ({ values, type, callBack }, { dispatch, rejectWithValue }) => {
    try {
      const data = {
        email: values.email,
        password: values.password,
        type
      }
      const response = await useJwt.registerService(data)
      toast((t) => (
        <ToastContent
          t={t}
          name={
            type === 'welcome_board'
              ? 'Name Board Added Successfully'
              : 'Kiosk Account Added Successfully'
          }
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllServiceAction())

      callBack()
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************   Get  Admin  ***************************//////////////

export const getAdminAction = createAsyncThunk(
  'system/getAdmin',
  async (id, { rejectWithValue }) => {
    try {
      const response = await useJwt.getAdmin(id)
      return response?.data
    } catch (err) {
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************   Update Admin Image  ***************************//////////////
export const updateAdminImageAction = createAsyncThunk(
  'system/uploadImage',
  async ({ id, image }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.updateAdminImage(id, image)
      toast((t) => (
        <ToastContent
          t={t}
          name="Admin Image Update Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllAdminAction())
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************   Update  Admin  ***************************//////////////
export const updateAdminAction = createAsyncThunk(
  'system/updateAdmin',
  async (
    { id, data, image, navigate, callBack },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await useJwt.updateAdmin(id, data)
      if (!!(image && id)) {
        const imageData = new FormData()
        imageData.append('image', image)
        dispatch(updateAdminImageAction({ id, image: imageData, navigate }))
      }

      if (!(image && id)) {
        toast((t) => (
          <ToastContent
            t={t}
            name="Admin Update Successfully"
            icon={<Check size={14} />}
            color="success"
            msg={response?.data?.message}
          />
        ))

        dispatch(getAllAdminAction())
      }

      callBack()

      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    Delete Admin  ***************************//////////////
export const deleteAdminAction = createAsyncThunk(
  'system/deleteAdmin',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteAdmin(id)
      toast((t) => (
        <ToastContent
          t={t}
          name="Admin Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllAdminAction())
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)

////////////******************************    Delete Service  ***************************//////////////
export const deleteServiceAction = createAsyncThunk(
  'system/deleteService',
  async ({ id }, { dispatch, rejectWithValue }) => {
    try {
      const response = await useJwt.deleteService(id)
      toast((t) => (
        <ToastContent
          t={t}
          name="Service Deleted Successfully"
          icon={<Check size={14} />}
          color="success"
          msg={response?.data?.message}
        />
      ))
      dispatch(getAllServiceAction())
      return response?.data
    } catch (err) {
      fieldErrors(err)
      return rejectWithValue(err?.response?.data)
    }
  }
)
