import * as Yup from 'yup'

export const TiersList = [
  {
    tierName: 'Tier 1',
    tierPrice: 35,
    tierFrom: 1,
    tierTo: 10
  },
  {
    tierName: 'Tier 2',
    tierPrice: 23,
    tierFrom: 11,
    tierTo: 20
  },
  {
    tierName: 'Tier 3',
    tierPrice: 30,
    tierFrom: 21,
    tierTo: 30
  },
  {
    tierName: 'Tier 4',
    tierPrice: 18,
    tierFrom: 31,
    tierTo: 40
  },
  {
    tierName: 'Tier 5',
    tierPrice: 124,
    tierFrom: 41,
    tierTo: 50
  }
]

export const newRoomValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Room Name should be at least one character long')
    .max(15, "Room Name shouldn't exceed more than 15 characters")
    .required('Room Name is required'),
  tiers_excluded: Yup.boolean(),
  comment: Yup.string()
    .required('Comment is required')
    .min(3, 'Comment should be at least one character long')
    .max(100, "Comment shouldn't exceed more than 100 characters"),
  operating_hours: Yup.array().of(
    Yup.object().shape({
      day_of_week: Yup.string(),
      is_useable: Yup.boolean(),
      start_time: Yup.string(),
      close_time: Yup.string()

      // close_time: Yup.date().min(
      //   Yup.ref('start_time'),
      //   'Close time should be greater than start time'
      // )
    })
  ),
  closed_dates: Yup.array().of(
    Yup.object().shape({
      date: Yup.date()
    })
  ),
  room_prices: Yup.array().of(
    Yup.object().shape({
      tier: Yup.string(),
      cost: Yup.string()
    })
  ),
  room_authorization: Yup.array().of(
    Yup.object().shape({
      user: Yup.string(),
      permission: Yup.string()
    })
  )
})
