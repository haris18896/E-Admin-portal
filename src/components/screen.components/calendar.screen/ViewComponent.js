/* eslint-disable no-unused-vars */
import React, { lazy } from 'react'

// ** Third Party Packages
import moment from 'moment'
const Avatar = lazy(() => import('@components/avatar'))

// ** Hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

function ViewComponent({ calendarEvent }) {
  const smallScreen = useMediaQuery('(min-width: 900px)')
  const nameImage = `https://ui-avatars.com/api/?name=${calendarEvent?.title}&background=0D8ABC&color=fff&size=128`

  return (
    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="fc-event-title">
        <div className="fc-event-time">
          <span className="f-400 text-ellipsis title-color">
            {(calendarEvent?.extendedProps?.start_time !== '--' &&
              moment(
                calendarEvent?.extendedProps?.start_time,
                'HH:mm:ss'
              ).format('hh:mm A')) ||
              '--'}
            {' - '}
            {(calendarEvent?.extendedProps?.end_time !== '--' &&
              moment(calendarEvent?.extendedProps?.end_time, 'HH:mm:ss').format(
                'hh:mm A'
              )) ||
              '--'}
          </span>
        </div>
        <div className="fc-event-title-text">
          <span className="title-color f-700 text-ellipsis">
            {calendarEvent?.title}
          </span>
        </div>
      </div>
      <Avatar
        className="provider-avatar-calendar"
        img={calendarEvent?.extendedProps?.img || nameImage}
        imgHeight={smallScreen ? '30' : '25'}
        imgWidth={smallScreen ? '30' : '25'}
      />
    </div>
  )
}

export default ViewComponent
