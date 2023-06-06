/* eslint-disable no-unused-vars */
import React, { Fragment, memo, useState, useEffect } from 'react'

// ** Utilities
import {
  isObjEmpty,
  dateUnix,
  dateUS,
  endTimeGreaterThanStartTime,
  timeFormat
} from '@utils'

// ** Third Party Packages
import * as Yup from 'yup'
import moment from 'moment'
import classNames from 'classnames'
import { Button, Form, Label, Spinner } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import { FormikProvider, useFormik } from 'formik'

// ** Components
import SelectField from '@select'
import Avatar from '@components/avatar'
import AlertModal from '@customComponents/alert'
import defaultAvatar from '@src/assets/default.png'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  updateBookingAction,
  cancelBookingAction,
  deleteBookingAction,
  ValidateRoomAction
} from '@store/booking/bookingsAction'
import { durationList } from './DurationList'
import {Icon} from "@iconify/react"

function AppointmentForm({
  skin,
  update,
  handleOpen,
  locationsList,
  selectedBooking
}) {
  const dispatch = useDispatch()
  const { getBooking, validRoomsData, validRoomsPending } = useSelector(
    (state) => state.booking
  )

  const { cancelPending, deletePending, success } = useSelector(
    (state) => state.booking
  )
  const getAllRooms = validRoomsData?.rooms
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const arrRooms = [{ text: 'All Rooms', value: '' }]
  const diffTime =
    moment(getBooking?.end_time, 'HH:mm:ss').diff(
      moment(getBooking?.start_time, 'HH:mm:ss'),
      'minutes'
    ) / 60

  const defaultDuration = durationList?.find(
    (item) => item?.value === diffTime.toString()
  )
  // ** States
  const [roomsList, setRoomsList] = useState([])
  const [BookingID, setBookingID] = useState(null)
  const [status, setStatus] = useState(null)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [duration, setDuration] = useState(defaultDuration)
  const [room, setRoom] = useState(
    roomsList?.find((item) => item?.value === getBooking?.room?.id)
  )
  const [location, setLocation] = useState(
    locationsList?.find((item) => item?.value === getBooking?.location?.id)
  )
  // ** Handle Modals
  const handleCloseAlertModal = () => setAlertModalOpen(false)
  const handleOpenAlertModal = ({ id, status }) => {
    setAlertModalOpen(true)
    setStatus(status)
    setBookingID(id)
  }

  // ** Creating Locations and Rooms lists
  useEffect(() => {
    if (getAllRooms) {
      getAllRooms.forEach((item) => {
        arrRooms.push({
          text: item?.name,
          value: item.id
        })
      })
      setRoomsList(arrRooms)
    }
  }, [getAllLocations, getAllRooms])

  // ** Function to handle filters
  const onChangeHandler = (name, value) => {
    if (name === 'location') setLocation(value)
    if (name === 'room') setRoom(value)
  }

  // ** appointment schema for validation
  const appointmentSchema = Yup.object().shape({
    start_date: Yup.date().required('Date is required'),
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    location: Yup.string().required('Location is required'),
    room: Yup.string().required('Room is required')
  })

  // ** formik
  const formik = useFormik({
    initialValues: {
      start_date: getBooking?.start_date,
      start_time: getBooking?.start_time,
      end_time: getBooking?.end_time,
      location: getBooking?.location?.id,
      room: getBooking?.room?.id
    },
    enableReinitialize: true,
    validationSchema: appointmentSchema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          start_date: values.start_date,
          start_time: values.start_time,
          end_time: values.end_time,
          location: values.location,
          room: values.room
        }

        dispatch(
          updateBookingAction({
            id: selectedBooking?.id,
            data,
            callback: () => {
              handleOpen()
              resetForm()
            }
          })
        )
      }
    }
  })

  // ** Fetching Valid Rooms
  useEffect(() => {
    if (location?.value) {
      dispatch(
        ValidateRoomAction({
          id: location?.value,
          data: {
            start_date: formik.values.start_date,
            start_time: formik.values.start_time,
            end_time: formik.values.end_time,
            provider: getBooking?.provider?.id,
            booking: getBooking?.id
          }
        })
      )
    }
  }, [
    location,
    formik.values.start_date,
    formik.values.start_time,
    formik.values.end_time
  ])

  return (
    <>
      <AlertModal
        loading={status === 1 ? cancelPending : deletePending}
        open={alertModalOpen}
        handleOpen={handleOpenAlertModal}
        handleClose={handleCloseAlertModal}
        handleAction={() => {
          status === 1
            ? dispatch(
                cancelBookingAction({
                  id: BookingID,
                  callback: () => {
                    handleCloseAlertModal()
                    handleOpen()
                  }
                })
              )
            : dispatch(
                deleteBookingAction({
                  id: BookingID,
                  callback: () => {
                    handleCloseAlertModal()
                    handleOpen()
                  }
                })
              )
        }}
        title={status === 1 ? 'Cancel Booking' : 'Delete Booking'}
        message={
          status === 1
            ? 'Are you sure you want to cancel this booking ?'
            : 'Are you sure you want to delete this booking ?'
        }
      />
      <FormikProvider value={formik}>
        <Form onSubmit={formik.handleSubmit} className="Appointment_Form">
          <Fragment>
            <div className="px-2 mb-2 d-flex align-items-center justify-content-between">
              <div className="Appointment_Form--avatar">
                <Avatar
                  img={getBooking?.provider?.avatar || defaultAvatar}
                  imgHeight="40"
                  imgWidth="40"
                />
                <span className="pl-1 heading-5 fw-600">{`${getBooking?.provider?.first_name} ${getBooking?.provider?.last_name}`}</span>
              </div>
            </div>
          </Fragment>

          <Fragment>
            <h5 className="modal-title modal-heading fw-600 ethera-dark">
              Date & Time
            </h5>

            <div className="px-2 my-1 Appointment_Form--date-time">
              <div className="Appointment_Form--date-time__date">
                <Label htmlFor="start_date" className="pointer pl-10px">
                  Date
                </Label>
                <Flatpickr
                  data-enable-time
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="radius-25 bg-white form-control skin-change"
                  value={dateUS(
                    formik.values.start_date,
                    'America/Los_Angeles'
                  )}
                  onChange={(date) => {
                    formik.setFieldValue(
                      'start_date',
                      dateUnix(date, 'America/Los_Angeles')
                    )
                  }}
                  options={{
                    mode: 'single',
                    enableTime: false,
                    dateFormat: 'n/j/Y'
                  }}
                />
              </div>

              <div className="my-1 Appointment_Form--date-time__time">
                <div className="Appointment_Form--date-time__time--start">
                  <Label htmlFor="start_time" className="pointer pl-10px">
                    Start Time
                  </Label>
                  <Flatpickr
                    data-enable-time
                    id="start_time"
                    name="start_time"
                    type="time"
                    className="radius-25 bg-white form-control skin-change"
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                    value={formik.values.start_time}
                    onChange={(time) => {
                      const changeTime = moment(`${time}`).format('HH:mm:ss')

                      formik.setFieldValue(
                        'start_time',
                        moment(`${time}`).format('HH:mm:ss')
                      )

                      formik.setFieldValue(
                        'end_time',
                        moment(changeTime, 'HH:mm:ss')
                          .clone()
                          .add(parseInt(duration.value), 'hours')
                              .add(
                                duration.value.split('.')[1] === '25'
                                  ? 15
                                  : duration.value.split('.')[1] === '5'
                                  ? 30
                                  : duration.value.split('.')[1] === '75'
                                  ? 45
                                  : 0,
                                'minutes'
                              )
                          .format('HH:mm:ss')
                      )
                    }}
                  />
                </div>

                <div className="Appointment_Form--date-time__time--duration">
                  <Label htmlFor="duration" className="pointer pl-10px">
                    Duration
                  </Label>
                  <SelectField
                    search={false}
                    className="position-relative"
                    defaultWidth
                    controlMinWidth="130px"
                    wd="100%"
                    menuHeight="16rem"
                    value={duration}
                    data={durationList}
                    onChange={(e) => {
                      setDuration(e)
                      formik.setFieldValue(
                        'end_time',
                        moment(formik.values.start_time, 'HH:mm:ss')
                          .clone()
                          .add(parseInt(e.value), 'hours')
                          .add(
                            e.value.split('.')[1] === '25'
                              ? 15
                              : e.value.split('.')[1] === '5'
                              ? 30
                              : e.value.split('.')[1] === '75'
                              ? 45
                              : 0,
                            'minutes'
                          )
                          .format('HH:mm:ss')
                      )
                    }}
                  />
                </div>

                <div className="Appointment_Form--date-time__time--end">
                  <Label htmlFor="end_time" className="pointer pl-10px">
                    End Time
                  </Label>
                  <Flatpickr
                    data-enable-time
                    id="end_time"
                    name="end_time"
                    type="time"
                    className={classNames({
                      'is-invalid': !!formik.errors.end_time,
                      'radius-25 bg-white form-control skin-change': true
                    })}
                    options={{
                      mode: 'single',
                      minuteIncrement: 15,
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                    value={formik.values.end_time}
                    onChange={(time) => {
                      formik.setFieldValue(
                        'end_time',
                        moment(`${time}`).format('HH:mm:ss')
                      )
                      const endTime = moment(`${time}`).format('HH:mm:ss')
                      const timeDuration =
                        moment(endTime, 'HH:mm:ss').diff(
                          moment(formik?.values?.start_time, 'HH:mm:ss'),
                          'minutes'
                        ) / 60

                      setDuration({
                        text: `${timeDuration}`,
                        value: `${timeDuration}`
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </Fragment>

          <Fragment>
            <h5 className="modal-title modal-heading fw-600 ethera-dark">
              Location
            </h5>
            <div className="px-2 my-1 Appointment_Form--location">
              <div className="Appointment_Form--location__venue">
                <SelectField
                  className="plr-0 position-relative"
                  wd="100%"
                  menuHeight="9rem"
                  search={false}
                  value={location}
                  data={locationsList}
                  onChange={(e) => {
                    onChangeHandler('location', e)
                    formik.setFieldValue('location', e.value)
                  }}
                  formikError={!!formik.errors.location}
                />
              </div>

              <div className="Appointment_Form--location__venue">
                <SelectField
                  className="plr-0 position-relative"
                  wd="100%"
                  menuHeight="9rem"
                  search={false}
                  defaultValue={{
                    text: getBooking?.room?.name,
                    value: getBooking?.room?.id
                  }}
                  data={location?.value ? roomsList : [room]}
                  placeholder={
                    validRoomsPending
                      ? 'Rooms Loading...'
                      : location?.value
                      ? 'Rooms'
                      : 'Select Location First'
                  }
                  onChange={(e) => {
                    onChangeHandler('room', e)
                    formik.setFieldValue('room', e.value)
                  }}
                  disabled={validRoomsPending || !location?.value}
                  formikError={!!formik.errors.room}
                  isLoading={validRoomsPending}
                />
              </div>
            </div>

            <div className="my-2 Appointment_Form--roomCost">
              <h5>Room Cost</h5>
              <p>$ 50.00</p>
            </div>

            <hr />
          </Fragment>

          <Fragment>
            <div className="px-2 my-2 Appointment_Form--actions">
              <Button
                className="button-cancel pd"
                disabled={cancelPending}
                onClick={() =>
                  handleOpenAlertModal({ id: getBooking?.id, status: 1 })
                }
              >
                <span className="whiteSpace">Cancel Booking</span>
              </Button>

              <Button
                className="button-delete pd"
                disabled={deletePending}
                onClick={() =>
                  handleOpenAlertModal({ id: getBooking?.id, status: 2 })
                }
              >
                <span className="px-1">Delete</span>
              </Button>
              <Button
                disabled={validRoomsPending || update}
                onClick={() => formik.handleSubmit()}
                className="button-success pd"
              >
                <Icon icon={update ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                <span className="px-1">Save</span>
              </Button>
            </div>
          </Fragment>
        </Form>
      </FormikProvider>
    </>
  )
}

export default memo(AppointmentForm)
