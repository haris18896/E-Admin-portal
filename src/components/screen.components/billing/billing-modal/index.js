/* eslint-disable no-unused-vars */
import React, { Fragment, memo } from 'react'

// ** Utils
import useMediaQuery from '@hooks/useMediaQuery'

// ** Third Party Components
import * as Yup from 'yup'
import { X } from 'react-feather'
import classNames from 'classnames'
import { FormikProvider } from 'formik'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Form,
  Labe,
  Badge,
  Spinner
} from 'reactstrap'

// ** Customer Components
import SelectField from '@select'
import CustomSpinner from '@spinner'
import { StatusObj } from '@status/BadgeColors'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import moment from 'moment'

function UpdateAppointmentModal(props) {
  const { id, open, handleOpen } = props

  const isMobile = useMediaQuery('(max-width: 576px)')
  const isTablet = useMediaQuery('(max-width: 1000px)')

  const dispatch = useDispatch()

  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleOpen} />
  )

  return (
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
      {bookingPending ? (
        <CustomSpinner />
      ) : (
        <FormikProvider value={formik}>
          <Form
            // onSubmit={formik.handleSubmit}
            className="Appointment_Form"
          >
            <Fragment>
              <h5 className="modal-title modal-heading fw-600 ethera-dark">
                Appointment Location
              </h5>

              <hr />

              <h5 className="modal-title modal-heading fw-600 ethera-dark">
                Appointment Details
              </h5>

              <hr />

              <div className="px-2 mb-2 d-flex align-items-center justify-content-start">
                <p className="me-1">Status:</p>
                <Badge color={StatusObj[getBooking?.status]?.color} pill>
                  {StatusObj[getBooking?.status]?.label}
                </Badge>
              </div>

              <hr />
              <div className="px-2 mb-2 d-flex align-items-center justify-content-between flex-column booking-inputs">
                <Button
                  // disabled={updatePending}
                  //   onClick={() => formik.handleSubmit()}
                  className="button-success pd mb-1 wd-100Percent"
                >
                  {/* {updatePending && <Spinner size="sm" />} */}
                  <span className="px-1">Save</span>
                </Button>

                <Button
                  // disabled={deletePending}
                  className="button-delete pd mb-1 wd-100Percent"
                >
                  {/* {deletePending && <Spinner size="sm" />} */}
                  <span className="px-1">Delete Booking</span>
                </Button>

                <Button
                  className="button-cancel pd mb-1 wd-100Percent"
                  onClick={handleOpen}
                >
                  <span className="px-1 whiteSpace">Close </span>
                </Button>
              </div>
            </Fragment>
          </Form>
        </FormikProvider>
      )}
    </Modal>
  )
}

export default memo(UpdateAppointmentModal)
