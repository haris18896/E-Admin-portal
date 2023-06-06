import React from 'react'

// ** Third Party Packages
import * as Icon from 'react-feather'

// ** Hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

function DurationComponent({ calendarEvent }) {
  const smallScreen = useMediaQuery('(min-width: 900px)')

  return (
    <div className="fc-event-title">
      <div className="fc-event-time">
        {smallScreen ? (
          <span className="fc-event-time-text f-700 fs-s-med title-color ">
            <Icon.Clock color="black" size={20} className="me-1" />
            {calendarEvent?._def?.title} Hours
          </span>
        ) : (
          <span className="fc-event-time-text f-700 fs-s-med title-color">
            {calendarEvent?._def?.title} H
          </span>
        )}
      </div>
    </div>
  )
}

export default DurationComponent
