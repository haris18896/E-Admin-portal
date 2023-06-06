/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'

// ** Hooks
import useMediaQuery from '@hooks/useMediaQuery'

// ** Third Party Packages
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import { Button, Label } from 'reactstrap'

// ** Components
import SelectField from '@select'
import FormIconField from '@FormIconField'
import { StatusObj } from '@status/BadgeColors'

// ** CSV Export
import { CSVLink } from 'react-csv'

function BookingsHeader({
  reset,
  rows,
  room,
  search,
  status,
  endDate,
  location,
  startDate,
  roomsList,
  statusList,
  dateHandler,
  roomsPending,
  locationsList,
  onChangeHandler,
  onSearchChange
}) {
  const today = new Date()
  const tablet = useMediaQuery('(min-width: 700px')
  const [exportData, setExportData] = React.useState([])

  const headers = [
    { label: 'Location', key: 'location' },
    { label: 'Room', key: 'room' },
    { label: 'Provider', key: 'provider' },
    { label: 'Date', key: 'date' },
    { label: 'Start Time', key: 'start_time' },
    { label: 'End Time', key: 'end_time' },
    { label: 'Duration', key: 'duration' },
    { label: 'Status', key: 'status' }
  ]
  function tConvert(time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]

    if (time.length > 1) {
      time = time.slice(1)
      time.splice(3, 1)
      time[5] = +time[0] < 12 ? ' AM' : ' PM'
      time[0] = +time[0] % 12 || 12
    }
    return time.join('')
  }
  const data = useMemo(() => {
    return rows.map((row, i) => {
      return {
        location: row?.location__name || '--',
        room: row?.room__name || '--',
        provider: `${row?.provider__first_name || '--'} ${
          row?.provider__last_name || '--'
        }`,
        date:
          row.start_date__date !== undefined
            ? moment(row?.start_date__date).format('MM/DD/YYYY')
            : '--',
        start_time: tConvert(row?.start_time || '--'),
        end_time: tConvert(row?.end_time || '--'),
        duration: `${row?.duration / 3600} Hours`,
        status: StatusObj[row?.status]?.label || '--'
      }
    })
  }, [rows])

  return (
    <div className="pt-3 p-2 bg-yellow">
      <div className="bookings-header">
        <div className="bookings-header--left">
          <div
            className="AppointmentSelectors_left-dates bookings-header--left__calendar d-f-center skin-change"
            // onClick={() => navigate('/bookings/monthly-invoices')}
          >
            <Flatpickr
              id="datePicker"
              name="datePicker"
              className="form-control datePicker-non-visible"
              onChange={dateHandler}
              options={{
                mode: 'range',
                enableTime: false,
                dateFormat: 'F j, Y'
              }}
            />
            <Label htmlFor="datePicker" className="mb-0 pointer">
              <Calendar size={20} color="#fff" />
              <span className="whiteSpace">
                <strong className="fs-s-med">From : </strong>
                {moment(startDate).format('MMM DD YYYY')} -{' '}
                {moment(endDate).format('MMM DD YYYY')}
              </span>
            </Label>
          </div>

          <div className="bookings-header--left__search">
            <FormIconField
              id="Search"
              name="searchKeyword"
              size={10}
              iconsName="ant-design:search-outlined"
              // value={search}
              onChange={(e) => onSearchChange(e)}
              className="input-group-merge"
              inputClassName="input-control skin-change"
              iconClassName="icon-control skin-change"
            />
          </div>
        </div>

        <div className="bookings-header--selects">
          <SelectField
            header
            search={false}
            className="bookings-header--selects--select-field"
            controlMinWidth="170px"
            wd={tablet && '100%'}
            value={status}
            data={statusList}
            placeholder="Status"
            onChange={(e) => onChangeHandler('status', e)}
          />

          <SelectField
            header
            search={false}
            menuHeight="20rem"
            controlMinWidth="170px"
            className="bookings-header--selects--select-field"
            wd={tablet && '100%'}
            value={location}
            placeholder="Location"
            data={locationsList}
            onChange={(e) => onChangeHandler('location', e)}
          />

          <SelectField
            header
            search={false}
            menuHeight="20rem"
            controlMinWidth="170px"
            className="bookings-header--selects--select-field"
            wd={tablet && '100%'}
            value={room}
            placeholder="Rooms"
            data={location?.value ? roomsList : [room]}
            onChange={(e) => onChangeHandler('room', e)}
            isLoading={roomsPending}
            disabled={roomsPending}
          />

          <div className="appointment-header--selects__button">
            <CSVLink
              data={data}
              headers={headers}
              filename={`bookings-list-${today}.csv`}
              className="text-decoration-none"
            >
              <Button size="sm " className="fs-x-small button-white pd-s">
                <Icon icon="dashicons:upload" width="15" height="15" />
                <span className="ml-5px">Export</span>
              </Button>
            </CSVLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsHeader
