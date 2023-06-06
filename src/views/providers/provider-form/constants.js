import * as Yup from 'yup'
import validator from 'validator'

const today = new Date()
today.setHours(0, 0, 0, 0)

export const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png']

export const ProviderFormValidationSchema = Yup.object().shape(
  {
    first_name: Yup.string()
      .required('First Name is required')
      .min(2, 'First Name must be at least 2 characters')
      .max(15, 'First Name must be at most 15 characters'),
    last_name: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters')
      .max(15, 'Last Name must be at most 15 characters'),
    middle_name: Yup.string()
      .min(2, 'Last Name must be at least 2 characters')
      .max(15, 'Last Name must be at most 15 characters'),
    suffix: Yup.string()
      .min(2, 'Suffix should be at least 2 characters long')
      .max(15, 'Suffix should not exceed more than 15 characters'),
    // date_of_birth: Yup.string(),
    day: Yup.string()
      .test('day', 'Enter valid day', (value) => {
        return (value < 32 && value > 0) || value === undefined
      })
      .when(['month', 'year'], {
        is: (month, year) => month?.length > 0 || year?.length > 0,
        then: (schema) => schema.required('Please fill day')
      }),
    month: Yup.string()
      .test('month', 'Enter valid month', (value) => {
        return (value < 13 && value > 0) || value === undefined
      })
      .when(['day', 'year'], {
        is: (day, year) => {
          return day?.length > 0 || year?.length > 0
        },
        then: (schema) => schema.required('Please fill month')
      }),
    year: Yup.string()
      .test('year', 'Enter valid year', (value) => {
        return (value < 10000 && value > 0) || value === undefined
      })
      .when(['month', 'day'], {
        is: (month, day) => month?.length > 0 || day?.length > 0,
        then: (schema) => schema.required('Please fill  year')
      }),
    // day: Yup.number().positive(' ').max(31, ' ').required(Yup.ref('month')),
    // month: Yup.number().positive().max(12, ' ').required(Yup.ref('year')),
    // year: Yup.number().positive(' '),

    practice: Yup.string()
      .required('Practice Name is required')
      .min(2, 'Practice Name must be at least 2 characters')
      .max(100, 'Practice Name must be at most 100 characters'),
    // avatar: Yup.mixed()
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
    email: Yup.string().email().required('Email is required'),
    phone_number: Yup.string().required('Mobile Number is required'),
    provider_license: Yup.array().of(
      Yup.object().shape({
        license_type: Yup.string(),
        license_number: Yup.string(),
        expire_date: Yup.string(),
        // .min(today, 'Expiration date must be in the future'),
        state: Yup.string()
          .max(2, 'State must be 2 characters long')
          .uppercase()
      })
    ),
    npi: Yup.string(),
    npi_two: Yup.string(),
    tax: Yup.string(),
    tax_two: Yup.string(),
    taxonomy: Yup.string(),
    caqh: Yup.string(),
    password: Yup.string().test(
      'strong-password',
      'Password must contain at least 8 characters, one number, one uppercase letter and one lowercase letter',
      (value) => {
        if (!value) {
          return true
        }
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 0
        })
      }
    ),
    confirm_new_password: Yup.string().oneOf(
      [Yup.ref('password'), null],
      'Passwords do not match!'
    )
  },
  [
    ['day', 'month'], // <--- adding your fields which need validation
    ['day', 'year'],
    ['month', 'year'],
    ['month', 'day'],
    ['year', 'month'],
    ['year', 'day']
  ]
)

export const States = [
    { text: 'AL', value: 'AL' },
    { text: 'AK', value: 'AK' },
    { text: 'AZ', value: 'AZ' },
    { text: 'AR', value: 'AR' },
    { text: 'CA', value: 'CA' },
    { text: 'CO', value: 'CO' },
    { text: 'CT', value: 'CT' },
    { text: 'DE', value: 'DE' },
    { text: 'FL', value: 'FL' },
    { text: 'GA', value: 'GA' },
    { text: 'HI', value: 'HI' },
    { text: 'ID', value: 'ID' },
    { text: 'IL', value: 'IL' },
    { text: 'IN', value: 'IN' },
    { text: 'IA', value: 'IA' },
    { text: 'KS', value: 'KS' },
    { text: 'KY', value: 'KY' },
    { text: 'LA', value: 'LA' },
    { text: 'ME', value: 'ME' },
    { text: 'MD', value: 'MD' },
    { text: 'MA', value: 'MA' },
    { text: 'MI', value: 'MI' },
    { text: 'MN', value: 'MN' },
    { text: 'MS', value: 'MS' },
    { text: 'MO', value: 'MO' },
    { text: 'MT', value: 'MT' },
    { text: 'NE', value: 'NE' },
    { text: 'NV', value: 'NV' },
    { text: 'NH', value: 'NH' },
    { text: 'NJ', value: 'NJ' },
    { text: 'NM', value: 'NM' },
    { text: 'NY', value: 'NY' },
    { text: 'NC', value: 'NC' },
    { text: 'ND', value: 'ND' },
    { text: 'OH', value: 'OH' },
    { text: 'OK', value: 'OK' },
    { text: 'OR', value: 'OR' },
    { text: 'PA', value: 'PA' },
    { text: 'RI', value: 'RI' },
    { text: 'SC', value: 'SC' },
    { text: 'SD', value: 'SD' },
    { text: 'TN', value: 'TN' },
    { text: 'TX', value: 'TX' },
    { text: 'UT', value: 'UT' },
    { text: 'VT', value: 'VT' },
    { text: 'VA', value: 'VA' },
    { text: 'WA', value: 'WA' },
    { text: 'WV', value: 'WV' },
    { text: 'WI', value: 'WI' },
    { text: 'WY', value: 'WY' }
]
