/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import moment from 'moment'
import { StatusObj } from '@status/BadgeColors'
import { Badge } from 'reactstrap'
import { Icon } from '@iconify/react'
import BookingUpdate from '../../components/screen.components/bookings/booking-modal/BookingUpdate'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getBookingByIdAction } from '../../redux/booking/bookingsAction'
const timeConvertToAMPM = (time) => {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

  if (time.length > 1) {
    time = time.slice(1)
    time.splice(3, 1)
    time[5] = +time[0] < 12 ? ' AM' : ' PM'
    time[0] = +time[0] % 12 || 12
  }
  return time.join('')
}
export const columns = ({ locationsList }) => {
  return [
    {
      name: 'Location',
      sortable: false,
      selector: (row) => row?.location__name
    },
    {
      name: 'Room',
      sortable: false,
      selector: (row) => row?.room__name
    },
    {
      name: 'Provider',
      sortable: false,
      selector: (row) =>
        `${row?.provider__first_name} ${row?.provider__last_name}`
    },
    {
      name: 'Date',
      width: '150px',
      sortable: true,
      cell: (row) => (
        <>
          <span>
            {row.start_date__date !== null 
              ? moment(row?.start_date__date).format('MM/DD/YYYY')
              : '--'}
          </span>
        </>
      )
    },
    {
      name: 'Start Time',
      sortable: false,
      width: '150px',
      selector: (row) => timeConvertToAMPM(row?.start_time)
    },
    {
      name: 'End Time',
      sortable: false,
      width: '150px',
      selector: (row) => timeConvertToAMPM(row?.end_time)
    },
    {
      name: 'Duration',
      sortable: false,
      minWidth: '200px',
      // Calculate duration in hours and minutes using moment
      selector: (row) => {
        const start = moment(row?.start_time, 'HH:mm:ss')
        const end = moment(row?.end_time, 'HH:mm:ss')
        const duration = moment.duration(end.diff(start))
        const hours = duration.hours()
        const minutes = duration.minutes()
        if (minutes === 0) {
          return hours > 1 ? `${hours} Hours` : `${hours} Hour`
        } else {
          return hours > 1
            ? `${hours} Hours ${minutes} minutes`
            : `${hours} Hour ${minutes} minutes`
        }
      }
    },
    {
      name: 'Status',
      sortable: false,
      minWidth: '250px',
      cell: (row) => {
        const dispatch = useDispatch()
        const [open, setOpen] = useState(false)
        const { bookingPending, updatePending, getBooking } = useSelector(
          (state) => state.booking
        )

        const handleOpenModal = (id) => {
          setOpen(!open)
          if (id && open === false) {
            dispatch(getBookingByIdAction(id))
          }
        }

        return (
          <div className="d-f-between w-100Percent">
            <div>
              <Badge
                color={StatusObj[row?.status]?.color}
                pill
                className={
                  StatusObj[row?.status]?.label !== 'Active'
                    ? 'cancelled-padding'
                    : 'active-padding active-booking-color'
                }
              >
                {StatusObj[row?.status]?.label}
              </Badge>
            </div>
            <div
              className="edit skin-change pointer"
              onClick={() => handleOpenModal(row?.id)}
            >
              <Icon icon="el:pencil" width="15" height="15" />
            </div>
            <BookingUpdate
              open={open}
              pending={bookingPending}
              selectedBooking={getBooking}
              locationsList={locationsList}
              updatePending={updatePending}
              handleOpen={() => handleOpenModal(row?.id)}
            />
          </div>
        )
      }
    }
  ]
}
