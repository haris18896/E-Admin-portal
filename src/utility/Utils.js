/* eslint-disable comma-dangle */
import _ from 'lodash'
import * as Yup from 'yup'
import moment from 'moment-timezone'
// import moment from 'moment-timezone'
import { DefaultRoute } from '../router/routes'
// import { useRef, useEffect } from 'react'

export const isObjEmpty = (obj) => Object.keys(obj).length === 0

export const kFormatter = (num) => {
  if (num > 999) {
    return `${(num / 1000).toFixed(1)}k`
  } else return num
}

export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '')
export const getTime = (data, format = 'LT') =>
  data && moment(data).format(format)

const isToday = (date) => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

export const formatDate = (
  value,
  formatting = { month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

// export const getHomeRouteForLoggedInUser = (userRole) => {
//   if (userRole === 'admin') return DefaultRoute
//   if (userRole === 'client') return '/access-control'
//   return '/login'
// }

export const getHomeRouteForLoggedInUser = (role) => {
  if (role) return DefaultRoute
  return '/login'
}

export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

export const getUserFullName = (user, defaultName = 'Other') => {
  if (!user) {
    return defaultName
  }
  // const preferredName = user.preferredName ? `"${user.preferredName}"` : ''
  const fullName = `${user.firstName || ''} ${user.middleName || ''} ${
    user.lastName || ''
  }`
    .trim()
    .replace(/ +(?= )/g, '')
  const fullNameRs = _.isEmpty(fullName) ? defaultName : fullName

  return fullNameRs
}

// American Phone Number
export const PhoneUS = (value, previousValue) => {
  if (!value) return value
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length
  if (!previousValue || value.length > previousValue.length) {
    if (cvLength < 4) return currentValue
    if (cvLength < 7) {
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`
    }
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(
      3,
      6
    )}-${currentValue.slice(6, 10)}`
  }
}

// for patch request
export const getModifiedValues = (values, initialValues) => {
  const modifiedValues = {}

  if (values) {
    Object.entries(values).forEach((entry) => {
      const key = entry[0]
      const value = entry[1]

      if (value !== initialValues[key]) {
        modifiedValues[key] = value
      }
    })
  }

  return modifiedValues
}

export const dateUnix = (date) => {
  return moment(`${date}`).tz('America/Los_Angeles').unix()
}

export const dateUS = (date) => {
  return moment.unix(`${date}`).tz('America/Los_Angeles').format('M/D/YYYY')
}

// convert time to timestamp
export const timeUnix = (time) => {
  return moment(`${time}`, 'LT').unix()
}

export const timeUS = (time) => {
  return moment.unix(`${time}`).format('LT')
}

export const timeFormat = (timeField) => {
  return Yup.string().matches(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    `${timeField} must be in the format HH:mm:ss`
  )
}

export const endTimeGreaterThanStartTime = (startTimeField, endTimeField) => {
  return Yup.string().test(
    endTimeField,
    `${endTimeField} must be greater than ${startTimeField}`,
    // eslint-disable-next-line no-unused-vars
    function (value) {
      const { [startTimeField]: startTime, [endTimeField]: endTime } =
        // eslint-disable-next-line no-invalid-this
        this.parent
      return !startTime || !endTime || startTime < endTime
    }
  )
}

export const getDurations = (arr) => {
  const result = []
  if (!arr) return result
  const dates = arr.reduce((acc, item) => {
    if (!acc[item.start_date__date]) {
      acc[item.start_date__date] = []
    }
    acc[item.start_date__date].push(item.duration)
    return acc
  }, {})
  for (const date in dates) {
    // result.push(dates[date])
    result.push({ [date]: dates[date] })
  }

  
  return result
}

// export const useDebounce = (cb, wait = 500, deps = []) => {
//   const timerRef = useRef(null)

//   useEffect(() => {
//     clearTimeout(timerRef.current)

//     timerRef.current = setTimeout(() => {
//       cb.apply(this, arg)
//     }, wait)

//     return () => clearTimeout(timerRef.current)
//   }, [cb, wait, JSON.stringify(deps)])
// }
