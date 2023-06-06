/* eslint-disable no-var */
/* eslint-disable no-unused-vars */
import React, { Fragment, memo, useState, useEffect } from 'react'

// ** Utils
import {
  isObjEmpty,
  endTimeGreaterThanStartTime,
  timeFormat,
  getModifiedValues,
  dateUS,
  dateUnix
} from '@utils'
import useMediaQuery from '@hooks/useMediaQuery'
// ** Third Party Components
import * as Yup from 'yup'
import { X } from 'react-feather'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { useSkin } from '@hooks/useSkin'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  Labe,
  Badge,
  Spinner,
  FormFeedback
} from 'reactstrap'
import Avatar from '@components/avatar'

// ** Customer Components
import defaultAvatar from '@src/assets/default.png'
import SelectField from '@select'
import CustomSpinner from '@spinner'
import { StatusObj } from '@status/BadgeColors'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

import {
  cancelBookingAction,
  deleteBookingAction,
  ValidateRoomAction,
  getAllClientsAction,
  updateBookingAction,
  updateAppointmentAction,
  updateAppointmentWithBookingAction,
  getBookingByIdWithAppointmentAction
} from '@store/booking/bookingsAction'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import moment from 'moment'
import { resetValidateRoom } from '../../../../redux/booking/bookingSlice'
import AlertModal from '@customComponents/alert'
import {Icon} from "@iconify/react";

function UpdateBookingModal(props) {
  const { id, open, handleOpen, handleClose, locationsList } = props
  const isMobile = useMediaQuery('(max-width: 576px)')
  const isTablet = useMediaQuery('(max-width: 1000px)')

  const dispatch = useDispatch()

  const {
    updatePending,
    cancelPending,
    deletePending,
    validRoomsData,
    getAllClients,
    clientsPending,
    validRoomsPending,
    getBookingWithAppointment,
    getBookingWithAppointmentPending
  } = useSelector((state) => state.booking)
  const getBooking = getBookingWithAppointment?.result[0]
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const getAllRooms = validRoomsData?.rooms
  const arrClients = []
  const arrRooms = []
  const locationsData = locationsList.slice(1)

  const defaultLocation = locationsData?.find(
    (item) => item?.value === getBooking?.booking__location__id
  )

  // ** States
  const [status, setStatus] = useState(null)
  const [roomsList, setRoomsList] = useState([])
  const [BookingID, setBookingID] = useState(null)
  const [clientsList, setClientsList] = useState([])
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [client, setClient] = useState(
    clientsList?.find((item) => item?.value === getBooking?.booking__client__id)
  )
  const [location, setLocation] = useState(defaultLocation)
  const [room, setRoom] = useState()

  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleOpen} />
  )

  // ** Handle Modals
  const handleCloseAlertModal = () => setAlertModalOpen(false)
  const handleOpenAlertModal = (id, { status }) => {
    setAlertModalOpen(true)
    setStatus(status)
    setBookingID(id)
  }

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

  useEffect(() => {
    if (getAllClients) {
      getAllClients.forEach((item) => {
        arrClients.push({
          text: `${item?.first_name} ${item?.last_name}`,
          value: item.id
        })
      })
      setClientsList(arrClients)
    }
  }, [getAllClients])

  useEffect(() => {
    if (id && open) {
      dispatch(
        getBookingByIdWithAppointmentAction({
          id,
          callback: (booking) => {
            setLocation({
              text: booking?.booking__location__name,
              value: booking?.booking__location__id
            })

            setRoom({
              text: booking?.booking__room__name,
              value: booking?.booking__room__id
            })
          }
        })
      )
      dispatch(getAllClientsAction())
    }
  }, [open])

  // ** function to handle filters
  const onChangeHandler = (name, value) => {
    if (name === 'location') setLocation(value)
    if (name === 'room') setRoom(value)
    if (name === 'client') setClient(value)
  }

  // ** appointment schema for validation
  const appointmentSchema = Yup.object().shape({
    start_time: timeFormat('start_time').required(),
    end_time: timeFormat('end_time')
      .required()
      .concat(endTimeGreaterThanStartTime('start_time', 'end_time')),
    booking__start_date__date: Yup.string(),
    location: Yup.string().required('Location is required'),
    room: Yup.string().required('Room is required'),
    client: Yup.string().required('Client is required')
  })

  const formik = useFormik({
    initialValues: {
      start_time: getBooking?.start_time,
      end_time: getBooking?.end_time,
      booking__start_date__date: getBooking?.booking__start_date__date,
      location: getBooking?.booking__location__id,
      room: getBooking?.booking__room__id,
      client: getBooking?.client__id
    },
    enableReinitialize: true,
    validationSchema: appointmentSchema,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const booking_data = {
          location: values.location,
          room: values.room
        }

        const appointment_data = {
          start_time: values.start_time,
          end_time: values.end_time,
          client: values.client
        }

        const appointment_modified_data = getModifiedValues(appointment_data, {
          start_time: formik.initialValues.start_time,
          end_time: formik.initialValues.end_time,
          client: formik.initialValues.client
        })

        const booking_modified_data = getModifiedValues(booking_data, {
          location: formik.initialValues.location,
          room: formik.initialValues.room
        })

        if (
          !isObjEmpty(booking_modified_data) &&
          isObjEmpty(appointment_modified_data)
        ) {

          dispatch(
            updateBookingAction({
              id,
              data: booking_data,
              callback: () => handleOpen()
            })
          )
        }

        if (
          !isObjEmpty(appointment_modified_data) &&
          isObjEmpty(booking_modified_data)
        ) {
          dispatch(
            updateAppointmentAction({
              id,
              appointment_id: getBooking?.id,
              data: appointment_data,
              callback: () => handleOpen()
            })
          )
        }

        if (
          !isObjEmpty(booking_modified_data) &&
          !isObjEmpty(appointment_modified_data)
        ) {
          dispatch(
            updateAppointmentWithBookingAction({
              id,
              appointment_id: getBooking?.id,
              data: appointment_data,
              booking_data,
              callback: () => handleOpen()
            })
          )
        }
      }
    }
  })

  // ** Getting Valid Rooms
  useEffect(() => {
    if (open && formik.values.location) {
      dispatch(
        ValidateRoomAction({
          id: formik.values.location,
          data: {
            provider: getBooking?.booking__provider__id,
            booking: getBooking?.booking__id
          }
        })
      )
    }
  }, [formik.values.location, open])

  const TimeDiff = () => {
    const start = moment(formik.values.start_time, 'HH:mm:ss')
    const end = moment(formik.values.end_time, 'HH:mm:ss')
    const duration = moment.duration(end.diff(start))
    const hours = duration.hours()
    const minutes = duration.minutes()
    if (minutes === 0) {
      return `${hours} Hour`
    } else {
      return `${hours} Hour ${minutes} minutes`
    }
  }

  const toTimestamp = (strDate) => {
    var datum = Date.parse(strDate)
    return datum / 1000
  }
  const dateToUnix = moment(getBooking?.booking__start_date__date).format(
    'MM/DD/YYYY'
  )
  const resultDate = toTimestamp(dateToUnix)

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
                  callback: () => handleCloseAlertModal()
                })
              )
            : dispatch(
                deleteBookingAction({
                  id: BookingID,
                  callback: () => handleCloseAlertModal()
                })
              )
        }}
        title={status === 1 ? 'Cancel Booking' : 'Delete Booking'}
        message={
          status === 1
            ? 'Are you sure you want to Cancel this Booking.'
            : 'Are you sure you want to Delete this Booking.'
        }
      />

      <Modal
        isOpen={open}
        toggle={handleOpen}
        className="modal-dialog-centered calendarModal"
      >
        <ModalHeader
          className="mb-1 ethera-modal-top-background"
          toggle={handleOpen}
          close={CloseBtn}
          tag="div"
        >
          <h5 className="modal-title ethera-dark fw-600">Edit Booking</h5>
        </ModalHeader>
        {getBookingWithAppointmentPending ? (
          <div className="padding-top-bottom">
            <CustomSpinner />
          </div>
        ) : (
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit} className="Appointment_Form">
              <Fragment>
                <section className="m-2">
                  <div className="d-flex align-items-center justify-content-start">
                    <Avatar
                      img={
                        getBooking?.booking__provider__avatar || defaultAvatar
                      }
                      imgHeight="40"
                      imgWidth="40"
                    />
                    <div className="ml-1">
                      <h4 className="m-b-2">
                        {/* Huzaifa Ali */}
                        {`${
                          getBooking?.booking__provider__first_name ||
                          'Loading....'
                        } ${getBooking?.booking__provider__last_name}`}
                      </h4>
                    </div>
                  </div>
                </section>

                <h5 className="modal-title modal-heading fw-600 ethera-dark">
                  Date & Time
                </h5>

                <div className="px-2 d-flex align-items-center justify-content-between mt-1 booking-inputs">
                  <div
                    className={classNames({
                      'wd-100Percent': true,
                      'mb-1': !isTablet
                    })}
                  >
                    <Flatpickr
                    disabled
                      id="booking__start_date__date"
                      className="form-control radius-25 skin-change"
                      placeholder="Select Date"
                      type="date"
                      name='booking__start_date__date'
                      value={dateUS(resultDate)}
                      onChange={(date) => {
                        formik.setFieldValue(
                          `booking__start_date__date`,
                          dateUnix(date)
                        )
                      }}
                      options={{
                        dateFormat: 'n/j/Y',
                        minDate: 'today',
                        enableTime: false,
                        mode: 'single'
                      }}
                    />


                    {/* <SelectField
                      header
                      wd="100%"
                      className="appointment--detail-input-m"
                      search={false}
                      defaultValue={{
                        text: `${getBooking?.client__first_name} ${getBooking?.client__last_name}`,
                        value: getBooking?.client__id
                      }}
                      data={clientsList}
                      onChange={(e) => {
                        onChangeHandler('client', e)
                        formik.setFieldValue('client', e.value)
                      }}
                      isLoading={clientsPending}
                      disabled={clientsPending}
                      formikError={!!formik.errors.client}
                    /> */}
                  </div>
                </div>

                <div className="px-2 wd-100Percent d-flex align-items-center justify-content-start flex-sm-row flex-column booking-inputs ">
                  <Flatpickr
                    data-enable-time
                    id="start_time"
                    name="start_time"
                    className={classNames({
                      'radius-25 bg-white form-control-sm form-control skin-change ': true,
                      'wd-100Percent': isMobile,
                      'mx-wd-130px': !isMobile
                    })}
                    value={formik.values.start_time}
                    onChange={(value) => {
                      formik.setFieldValue(
                        'start_time',
                        moment(`${value}`).format().split('T')[1].split('+')[0]
                      )
                    }}
                    options={{
                      mode: 'single',
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                  />

                  <p className="my-0 mx-1">to</p>

                  <Flatpickr
                    data-enable-time
                    id="end_time"
                    name="end_time"
                    className={classNames({
                      'radius-25 bg-white form-control-sm form-control skin-change ': true,
                      'is-invalid': !!formik.errors.end_time,
                      'wd-100Percent': isMobile,
                      'mx-wd-130px': !isMobile
                    })}
                    value={formik.values.end_time}
                    onChange={(value) => {
                      formik.setFieldValue(
                        'end_time',
                        moment(`${value}`).format().split('T')[1].split('+')[0]
                      )
                    }}
                    options={{
                      mode: 'single',
                      enableTime: true,
                      noCalendar: true,
                      dateFormat: 'h:i K'
                    }}
                  />

                  <Badge
                    color="secondary"
                    className={classNames({
                      'ml-1': !isMobile,
                      'wd-100Percent mt-1': isMobile
                    })}
                  >
                    <TimeDiff />
                  </Badge>
                </div>

                <hr />

                <h5 className="modal-title modal-heading fw-600 ethera-dark">
                  Location
                </h5>
                <div className="px-2 mb-2 d-flex align-items-center justify-content-center flex-column mt-1 booking-inputs">
                  <div
                    className={classNames({
                      'wd-100Percent': true,
                      'mb-1': !isTablet
                    })}
                  >
                    <SelectField
                      wd="100%"
                      search={false}
                      value={location}
                      // defaultValue={{
                      //   text: getBooking?.booking__location__name,
                      //   value: getBooking?.booking__location__id
                      // }}
                      data={locationsData}
                      onChange={(e) => {
                        onChangeHandler('location', e)
                        formik.setFieldValue('location', e.value)
                        formik.setFieldValue('room', '')
                        setRoom(null)
                      }}
                      formikError={!!formik.errors.location}
                    />
                  </div>

                  <div className="wd-100Percent">
                    <SelectField
                      wd="100%"
                      search={false}
                      value={room}
                      data={roomsList}
                      placeholder={
                        validRoomsPending
                          ? 'Rooms Loading...'
                          : location?.value
                          ? 'Select Room'
                          : 'Select Location First'
                      }
                      onChange={(e) => {
                        onChangeHandler('room', e)
                        formik.setFieldValue('room', e.value)
                      }}
                      disabled={validRoomsPending}
                      formikError={!!formik.errors.room}
                      isLoading={validRoomsPending}
                    />
                  </div>
                </div>

                <hr />

                <div className=" mb-2 d-flex align-items-center justify-content-between">
                  <p className="me-1 px-2 bold">Room Cost</p>
                  <h5 className="modal-title modal-price-heading fw-600 ethera-dark">
                    ${getBooking?.booking__room_cost}
                  </h5>
                </div>

                <hr />
                <div className="px-2 mb-2 d-flex align-items-center justify-content-between  booking-inputs">
                  <Button
                    className="button-cancel pd mb-1 "
                    disabled={cancelPending}
                    onClick={() => handleOpenAlertModal(id, { status: 1 })}
                  >
                    <span className=" whiteSpace">Cancel Booking</span>
                  </Button>
                  <Button
                    onClick={() => handleOpenAlertModal(id, { status: 2 })}
                    disabled={deletePending}
                    className="button-delete pd mb-1 "
                  >
                    <span className="px-1">Delete </span>
                  </Button>
                  <Button
                    disabled={updatePending}
                    onClick={() => formik.handleSubmit()}
                    className="button-success pd mb-1 "
                  >
                    <Icon icon={updatePending ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                    <span className="px-1">Save</span>
                  </Button>
                </div>
              </Fragment>
            </Form>
          </FormikProvider>
        )}
      </Modal>
    </>
  )
}

export default memo(UpdateBookingModal)
