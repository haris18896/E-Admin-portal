import * as Yup from 'yup'

export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

export const LocationDetailsSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Location Name should be at least three characters long')
    .max(15, "Location Name shouldn't exceed more than 15 characters")
    .required('Location Name is required'),
  // image: Yup.mixed()
  //   .test('fileSize', 'File size is too large!', (value) => {
  //     if (value) {
  //       return value.size < 2 * 1024 * 1024
  //     }
  //     return true
  //   })
  //   .test('fileFormat', 'File format is not supported!', (value) => {
  //     if (value) {
  //       return SUPPORTED_FORMATS.includes(value.type)
  //     }
  //     return true
  //   }),
  // roomMap: Yup.mixed()
  //   .test('fileSize', 'File size is too large!', (value) => {
  //     if (value) {
  //       return value.size < 100 * 1024 * 1024
  //     }
  //     return true
  //   })
  //   .test('fileFormat', 'File format is not supported!', (value) => {
  //     if (value) {
  //       return SUPPORTED_FORMATS.includes(value.type)
  //     }
  //     return true
  //   }),
  address: Yup.string().required('Address is a required field')
    .min(5, 'Address should be at least five characters long')
    .max(70, "Address shouldn't exceed more than 50 characters"),
    contact_person: Yup.string()
    .min(3, 'Contact Person should be at least three characters long')
    .max(15, "Contact Person shouldn't exceed more than 15 characters"),
  email: Yup.string().email('Invalid email address').required('Email is a required field'),
    phone_number: Yup.string().required('Phone is a required field'),
  operating_hours: Yup.array().of(
    Yup.object().shape({
      day_of_week: Yup.string(),
      is_useable: Yup.boolean(),
      start_time: Yup.string(),
      close_time: Yup.string()
    })
  ),
  closed_dates: Yup.array().of(Yup.object().shape({
    date: Yup.date()
  }))
})
