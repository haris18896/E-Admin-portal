/* eslint-disable no-unused-vars */
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  memo,
  Fragment
} from 'react'
import { getDurations } from '@utils'

// ** Reactstrap
import { Card, CardBody, Label } from 'reactstrap'

// ** Calendar Plugins
import Flatpickr from 'react-flatpickr'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ScrollGridPlugin from '@fullcalendar/scrollgrid'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'

// ** Third Party Components
import moment from 'moment'
import * as Icon from 'react-feather'

// ** Hooks
import useMediaQuery from '@src/utility/hooks/useMediaQuery'

// ** Custom Components
import SelectField from '@select'
const BookingUpdate = lazy(() =>
  import(
    '../../components/screen.components/bookings/booking-modal/BookingUpdate'
  )
)
const calendarsColor = lazy(() =>
  import('@ScreenComponent/calendar.screen/constants')
)
const DurationComponent = lazy(() =>
  import('@ScreenComponent/calendar.screen/DurationComponent')
)
const ViewComponent = lazy(() =>
  import('@ScreenComponent/calendar.screen/ViewComponent')
)

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { resetBookings } from '@store/booking/bookingSlice'
import { getAllRoomsAction } from '@store/rooms/roomsAction'
import { getAllLocationsAction } from '@store/locations/locationsAction'
import {
  getAllBookingsAction,
  getBookingByIdAction
} from '@store/booking/bookingsAction'

function Calendar() {
  const dispatch = useDispatch()
  const calendarRef = useRef(null)
  const isMobile = useMediaQuery('(max-width: 600px)')
  const largeScreen = useMediaQuery('(min-width: 1350px)')
  const extraLargeScreen = useMediaQuery('(min-width: 1500px)')

  // ** Selectors
  const {
    success,
    loading,
    getBooking,
    getAllBookings,
    bookingPending,
    updatePending
  } = useSelector((state) => state.booking)
  const roomsPending = useSelector((state) => state.rooms.loading)
  const getAllRooms = useSelector((state) => state.rooms.getAllRooms?.roomsList)
  const locationsPending = useSelector(
    (state) => state.locations.getAllLocations?.loading
  )
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const rows = getAllBookings?.bookingsList
  const rowsFiltered = rows.filter((row) => row.status === 1)

  // ** States
  const [room, setRoom] = useState()
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState()
  const [startDate, setStartDate] = useState('')
  const [roomsList, setRoomsList] = useState([])
  const [view, setView] = useState('timeGridWeek')
  const [eventsList, setEventsList] = useState([])
  const [calendarApi, setCalendarApi] = useState(null)
  const [locationsList, setLocationsList] = useState([])
  const [currentMonth, setCurrentMonth] = useState(null)
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)
  const [allRoomsDayGrid, setAllRoomsDayGrid] = useState(true)

  // ** Referencing Calendar
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  // ** Getting Bookings
  useEffect(() => {
    dispatch(resetBookings())
    if (location?.value) {
      dispatch(
        getAllBookingsAction({
          offset: 0,
          limit: 100,
          startDate,
          endDate,
          location: location?.value,
          room: room?.value,
          callback: () => setEventsList([])
        })
      )
    }
  }, [endDate, location, room, success])

  // ** Getting Locations
  useEffect(() => {
    dispatch(getAllLocationsAction())
  }, [dispatch])

  // ** Getting Rooms
  useEffect(() => {
    if (location?.value) {
      dispatch(getAllRoomsAction({ id: location?.value }))
    }
  }, [location?.value, dispatch])

  // ** Creating Locations List
  const arrLocations = useMemo(() => {
    if (!getAllLocations) {
      return []
    }

    const locations = []
    getAllLocations.forEach((item) => {
      locations.push({
        text: item?.name,
        value: item.id
      })
    })
    return locations
  }, [getAllLocations])

  useEffect(() => {
    setLocation(arrLocations[0])
    setLocationsList(arrLocations)
  }, [arrLocations])

  // ** Create Rooms lists
  const arrRooms = useMemo(() => {
    if (!getAllRooms) {
      return []
    }

    const rooms = []
    getAllRooms.forEach((item) => {
      rooms.push({
        text: item?.name,
        value: item.id
      })
    })
    return rooms
  }, [getAllRooms])

  useEffect(() => {
    setRoomsList(arrRooms)
  }, [arrRooms])

  // ** Rooms Resources
  const resources = useMemo(() => {
    return roomsList.map((room) => {
      return { id: room.value, title: room.text }
    })
    // .filter((_, index) => index !== 0)
  }, [roomsList])

  // ** Function to handle sidebar visibility
  const handleAddAppointmentSidebar = (id) => {
    setAddSidebarOpen(!addSidebarOpen)
    if (id && addSidebarOpen === false) {
      dispatch(getBookingByIdAction(id))
    }
  }

  // ** Date Picker
  const onDateChangeHandler = (dates) => {
    calendarRef.current.getApi().gotoDate(new Date(dates[0]))
  }

  // ** Function to handle filters
  const onChangeHandler = (name, value) => {
    if (name === 'location') setLocation(value)
    if (name === 'room') setRoom(value)
  }

  // ** Events
  const memoizedEvents = useMemo(() => {
    let events = []
    const viewComp = view === 'resourceTimeGridDay' || room?.value

    if (rowsFiltered.length > 0 && viewComp) {
      events = rowsFiltered.map((row) => {
        return {
          allDay: false,
          url: '',
          start: `${row?.start_date__date}T${row?.start_time}`,
          end: `${row?.start_date__date}T${row?.end_time}`,
          title: `${row?.provider__first_name} ${row?.provider__last_name}`,
          resourceId: row?.room__id,
          extendedProps: {
            id: row?.id,
            date: row?.start_date__date,
            calendar: 'Ethera OC',
            img: row?.provider__avatar,
            end_time: row?.appointments__end_time || '--',
            start_time: row?.appointments__start_time || '--',
            duration: `${row?.duration / 3600} hours`
          }
        }
      })
    }

    return events
  }, [rows])

  const memoizedDurationEvents = useMemo(() => {
    const durationEvents = []
    const durComp = view === 'timeGridWeek' || view === 'dayGridMonth'

    if (rowsFiltered.length > 0 && !room?.value && durComp) {
      const durations = getDurations(rowsFiltered)

      durations.map((durationObj, index) => {
        const arr = Object.entries(durationObj).map(([key, value]) => ({
          date: key,
          duration: value
        }))

        arr.forEach((item) => {
          let sum = 0
          const duration = item.duration
          duration.map(function (dur) {
            sum += parseInt(dur)
          })

          durationEvents.push({
            allDay: true,
            url: '',
            id: `${index}`,
            start: `${arr[0].date}`,
            end: `${arr[0].date}`,
            title: `${sum / 3600}`,
            extendsProps: {
              start: `${arr[0].date}`,
              end: `${arr[0].date}`,
              calendar: 'Ethera OC'
            }
          })
        })
      })
    }

    return durationEvents
  }, [rows])

  const EventRenderer = (arg) => {
    if (room?.value) {
      return <ViewComponent calendarEvent={arg?.arg?.event} view={view} />
    } else {
      return <DurationComponent calendarEvent={arg?.arg?.event} />
    }
  }

  // ** Reset Bookings
  useEffect(() => {
    return () => {
      dispatch(resetBookings())
    }
  }, [])

  const calendarOptions = {
    resources,
    navLinks: true,
    dayMaxEvents: 1,
    editable: false,
    ref: calendarRef,
    selectable: true,
    nowIndicator: true,
    eventOverlap: false,
    stickyHeaderDates: true,
    initialView: 'timeGridWeek',
    stickyFooterScrollbar: true,
    slotDuration: '01:00:00',
    snapDuration: '01:00:00',
    schedulerLicenseKey: '0599384492-fcs-1678752810',
    events:
      view === 'resourceTimeGridDay' || room?.value
        ? memoizedEvents
        : view === 'timeGridWeek' || view === 'dayGridMonth' || !room?.value
        ? memoizedDurationEvents
        : [],

    dayHeaderFormat: {
      weekday: 'long',

      omitCommas: true
    },
    datesSet: (dateInfo) => {
      const start = dateInfo.startStr.split('T')[0]
      const end = dateInfo.endStr.split('T')[0]
      setStartDate(start)
      setEndDate(end)

      setCurrentMonth(parseInt(start.split('-')[1]) + 1)
    },

    plugins: [
      interactionPlugin,
      ScrollGridPlugin,
      resourceTimeGridPlugin,
      dayGridPlugin,
      timeGridPlugin
    ],
    eventClassNames({ event: calendarEvent }) {
      const eventMonth = parseInt(
        moment(calendarEvent?.start).format('YYYY-MM-DD').split('-')[1]
      )

      const colorName =
        view === 'dayGridMonth' && eventMonth !== currentMonth
          ? 'gray'
          : 'admin'
      return [`bg-light-${colorName}`]
    },

    headerToolbar: {
      left: (() => {
        if (isMobile) {
          return 'title, prev, next'
        } else {
          return 'title, prev, next, resourceTimeGridDay,timeGridWeek,dayGridMonth'
        }
      })(),
      center: (() => {
        if (isMobile) {
          return 'dayGridMonth,timeGridWeek,resourceTimeGridDay'
        } else return ''
      })(),
      right: 'venueSelect'
    },

    views: {
      resourceTimeGridDay: {
        type: 'resourceTimeGrid',
        duration: { days: 1 },
        buttonText: 'Day',
        dayMinWidth: 270,
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit'
        },
        allDaySlot: false,
        eventContent: (arg) => {
          return (
            <ViewComponent
              calendarEvent={arg.event}
              view={view === 'dayGridMonth'}
            />
          )
        },
        viewDidMount: (args) => {
          setView(`${args?.view?.type}`)
          setAllRoomsDayGrid(false)
        },
        eventClick: (arg) => {
          handleAddAppointmentSidebar(arg.event._def?.extendedProps?.id)
        }
      },
      timeGridWeek: {
        type: 'timeGridWeek',
        duration: { weeks: 1 },
        buttonText: 'Week',
        dayMinWidth: 170,
        dayHeaderFormat: {
          weekday: 'long',
          omitCommas: true,
          day: 'numeric'
        },
        slotLabelFormat: {
          hour: 'numeric',
          minute: '2-digit',
          hourCycle: 'h12',
          timeZone: 'America/Los_Angeles'
        },
        eventContent: (arg) => {
          return <EventRenderer arg={arg} />
        },
        viewDidMount: (args) => {
          const start_week = moment(args?.view?.currentStart).startOf('week')
          const end_week = moment(args?.view?.currentStart).endOf('week')
          setStartDate(start_week)
          setEndDate(end_week)
          setAllRoomsDayGrid(true)
          setView(`${args?.view?.type}`)
        },
        eventClick: (arg) => {
          if (room?.value) {
            handleAddAppointmentSidebar(arg.event._def?.extendedProps?.id)
          }
        }
      },
      dayGridMonth: {
        type: 'dayGridMonth',
        duration: { months: 1 },
        buttonText: 'Month',
        dayMinWidth: 160,
        eventContent: (arg) => {
          return <EventRenderer arg={arg} />
        },
        viewDidMount: (args) => {
          const start_month = moment(args?.view?.currentStart).startOf('month')
          const end_month = moment(args?.view?.currentStart).endOf('month')
          setStartDate(start_month)
          setEndDate(end_month)
          setAllRoomsDayGrid(true)
          setView(`${args?.view?.type}`)
        },
        eventClick: (arg) => {
          if (room?.value) {
            handleAddAppointmentSidebar(arg.event._def?.extendedProps?.id)
          }
        }
      }
    },
    customButtons: {}
    //   businessHours: [ // Optional - the hours when the business is open
    //   {
    //     daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
    //     startTime: '08:00',
    //     endTime: '17:00'
    //   },
    //   {
    //     daysOfWeek: [6], // Saturday
    //     startTime: '10:00',
    //     endTime: '14:00'
    //   }
    // ],
  }

  return (
    <>
      <BookingUpdate
        open={addSidebarOpen}
        pending={bookingPending}
        updatePending={updatePending}
        selectedBooking={getBooking}
        locationsList={locationsList}
        handleOpen={handleAddAppointmentSidebar}
      />

      <Card className="shadow-none border-0 mb-0 bg-yellow rounded-0">
        <CardBody className="p-0 relative">
          <Label htmlFor="datePicker">
            <Icon.Calendar
              color="white"
              size={30}
              className="absolute datePicker-icon pointer"
            />
          </Label>

          <div className="calendar-selectors absolute-selectors">
            <SelectField
              header
              wd="100%"
              menuHeight="20rem"
              search={false}
              value={location}
              data={locationsList}
              controlMaxWidth="270px"
              onChange={(e) => {
                onChangeHandler('location', e)
                onChangeHandler('room', null)
              }}
              disabled={locationsPending}
              isLoading={locationsPending}
              controlMinWidth={
                extraLargeScreen ? '230px' : largeScreen ? '180px' : '100%'
              }
              placeholder={locationsPending ? 'Loading...' : 'Locations'}
            />

            {allRoomsDayGrid && (
              <SelectField
                header
                wd="100%"
                menuHeight="20rem"
                value={room}
                search={false}
                data={roomsList}
                controlMaxWidth="270px"
                disabled={roomsPending}
                isLoading={roomsPending}
                // formikError={!!room?.value === ''}
                onChange={(e) => onChangeHandler('room', e)}
                controlMinWidth={
                  extraLargeScreen ? '230px' : largeScreen ? '180px' : '100%'
                }
                placeholder={
                  location?.value ? 'Select Room' : 'Select Location First'
                }
              />
            )}
          </div>

          <Fragment>
            <FullCalendar {...calendarOptions} />
          </Fragment>
          <Flatpickr
            id="datePicker"
            name="datePicker"
            // disabled={view === 'resourceTimeGridDay'}
            className="form-control datePicker-non-visible"
            onChange={onDateChangeHandler}
            options={{
              mode: 'single',
              enableTime: false,
              dateFormat: 'F j, Y'
            }}
          />
        </CardBody>
      </Card>
    </>
  )
}

export default memo(Calendar)
