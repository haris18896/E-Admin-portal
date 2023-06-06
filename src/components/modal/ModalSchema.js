import * as Yup from 'yup'
export const LockDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Location Name should be at least three characters long')
    .max(15, "Location Name shouldn't exceed more than 15 characters")
    .required('Location Name is required'),

  token: Yup.string()
    .min(5, 'Address should be at least five characters long')
    .max(70, "Address shouldn't exceed more than 50 characters")
})
