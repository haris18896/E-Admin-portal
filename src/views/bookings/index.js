/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react'

// ** Third Party Packages
import { Card } from 'reactstrap'
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import DataTable, { createTheme } from 'react-data-table-component'
import debounce from 'lodash/debounce'
import query from 'query-string'
import lodash from 'lodash'
// ** Components
import Spinner from '@spinner'
import { statusList } from './constants'
import { columns } from './table.data'
import CustomPagination from '@pagination/ReactPaginate'
import BookingsHeader from '@ScreenComponent/bookings/headers/bookings-header'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAllRoomsAction } from '@store/rooms/roomsAction'
import { resetBookings } from '@store/booking/bookingSlice'
import {
  getAllBookingsAction,
  handlePageChange,
  handleLimitChange
} from '@store/booking/bookingsAction'
import { getAllLocationsAction } from '@store/locations/locationsAction'

createTheme(
  'solarized',
  {
    text: {
      primary: '#',
      secondary: '#2aa198'
    },
    background: {
      default: 'transparent'
    },
    context: {
      background: '#e3f2fd',
      text: '#000'
    },
    divider: {
      default: 'rgba(216, 214, 222, 0.1)'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)

function Bookings() {
  const dispatch = useDispatch()
  const { loading, getAllBookings, success } = useSelector(
    (state) => state.booking
  )
  const getAllRooms = useSelector((state) => state.rooms.getAllRooms?.roomsList)
  const roomsPending = useSelector((state) => state.rooms.loading)
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const rows = getAllBookings?.bookingsList
  const offset = getAllBookings?.offset
  const count = getAllBookings?.total
  const limit = getAllBookings?.limit

  const arrLocation = []
  const arrRoom = []

  const today = new Date()
  const _30days = new Date()
  _30days.setDate(today.getDate() + 30)

  // ** States
  const [currentPage, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [room, setRoom] = useState(null)
  const [roomsList, setRoomsList] = useState([])
  const [endDate, setEndDate] = useState(_30days)
  const [startDate, setStartDate] = useState(today)
  const [status, setStatus] = useState(null)
  const [locationsList, setLocationsList] = useState([])
  const [location, setLocation] = useState(null)

  // ** Getting Bookings
  useEffect(() => {
    dispatch(
      getAllBookingsAction({
        offset:
          startDate || endDate || search || status || location || room
            ? 0
            : offset,
        limit: search || status || location || room ? limit : 10,
        startDate,
        endDate,
        search,
        status: status?.value,
        location: location?.value,
        room: room?.value,
        callback: () => {}
      })
    )
  }, [status, location, room, endDate, success])

  // ** Getting Locations
  useEffect(() => {
    if (rows) {
      dispatch(getAllLocationsAction())
    }
  }, [])

  // ** Getting Rooms
  useEffect(() => {
    if (location?.value) {
      dispatch(getAllRoomsAction({ id: location?.value }))
    }
  }, [location?.value])

  // ** Creating Locations and Rooms lists
  useEffect(() => {
    if (getAllLocations) {
      getAllLocations.forEach((item) => {
        arrLocation.push({
          text: item?.name,
          value: item.id
        })
      })
      setLocationsList(arrLocation)
    }

    if (getAllRooms) {
      getAllRooms.forEach((item) => {
        arrRoom.push({
          text: item?.name,
          value: item.id
        })
      })
      setRoomsList(arrRoom)
    }
  }, [getAllLocations, getAllRooms])

  // ** Function to handle filters

  const onChangeHandler = (name, value) => {
    if (name === 'location') {
      setLocation(value)
      setRoom(null)
    }

    if (name === 'room') setRoom(value)
    if (name === 'status') setStatus(value)
    setPage(0)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    dispatch(
      getAllBookingsAction({
        offset:
          startDate || endDate || search || status || location || room
            ? 0
            : offset,
        limit,
        startDate,
        endDate,
        search: e.target.value,
        status: status?.value,
        location: location?.value,
        room: room?.value,
        callback: () => {}
      })
    )
  }

  const onChange = useCallback(
    debounce((value) => handleSearch(value), 600),
    [handleSearch]
  )

  // ** Date Filter
  const onDateChangeHandler = (dates) => {
    if (dates.length === 1) {
      setStartDate(dates[0])
    }
    if (dates.length === 2) {
      setStartDate(dates[0])
      setEndDate(dates[1])
    }
  }

  // ** Changing Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        startDate,
        endDate,
        room: room?.value,
        status: status?.value,
        location: location?.value,
        search
      })
    )
    setPage(0)
  }

  // ** Changing page
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({
        offset: newOffset === 0 ? 0 : newOffset,
        limit,
        startDate,
        endDate,
        room: room?.value,
        status: status?.value,
        location: location?.value,
        search
      })
    )
    setPage(() => page.selected)
  }

  // ** Reset Filters
  const handleReset = () => {
    setStartDate(today)
    setEndDate(_30days)
    setRoom('')
    setStatus('')
    setLocation('')
    setSearch('')
    setPage(0)
  }

  // ** Reset Bookings
  useEffect(() => {
    return () => {
      dispatch(resetBookings())
    }
  }, [])

  return (
    <Card>
      <BookingsHeader
        rows={rows}
        room={room}
        search={search}
        status={status}
        endDate={endDate}
        reset={handleReset}
        location={location}
        roomsList={roomsList}
        startDate={startDate}
        statusList={statusList}
        onSearchChange={onChange}
        roomsPending={roomsPending}
        locationsList={locationsList}
        onChangeHandler={onChangeHandler}
        dateHandler={onDateChangeHandler}
      />

      <div className="react-dataTable">
        {loading ? (
          <Spinner />
        ) : rows?.length > 0 ? (
          <DataTable
            pagination
            paginationServer
            rowsPerPage={limit}
            data={rows}
            pointerOnHover
            highlightOnHover
            theme="solarized"
            columns={columns({ locationsList })}
            className="react-dataTable "
            paginationDefaultPage={currentPage}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={() =>
              CustomPagination({
                limit,
                handleLimit,
                currentPage,
                count,
                handlePagination
              })
            }
          />
        ) : (
          <div
            className="react-dataTable d-flex align-items-center justify-content-center"
            style={{ minHeight: '20vh' }}
          >
            <div className="mb-1 d-flex flex-column align-items-center justify-content-center">
              <Icon
                className="mb-1"
                icon="material-symbols:search-rounded"
                width="50"
                height="50"
              />
              <h5>No result found</h5>
              {/* {error?.statusCode === 404 || error?.statusCode === 500 ? <p className='text-danger'>{error.msg}</p> : ''} */}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default Bookings
