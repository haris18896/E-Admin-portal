import * as Yup from 'yup'
import validator from 'validator'

export const SystemModalSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, 'First Name should be at least three characters long')
    .max(15, "First Name shouldn't exceed more than 15 characters")
    .required('First Name is required'),
  last_name: Yup.string()
    .min(3, 'Last Name should be at least three characters long')
    .max(15, "Last Name shouldn't exceed more than 15 characters")
    .required('Last Name is required'),
  email: Yup.string().required('Email  is required'),

  password: Yup.string().test(
    'strong-password',
    'Password must contain at least 8 characters, one number, uppercase letter, lowercase letter and symbol',
    (value) => {
      if (!value) {
        return true
      }
      return validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1,
        minSymbols: 1
      })
    }
  )
})
