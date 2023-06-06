/* eslint-disable no-unused-vars */
import React from 'react'

// ** Third Party Components
import { X } from 'react-feather'
import { useSkin } from '@hooks/useSkin'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'

// ** Customer Components
import Spinner from '@spinner'
import AppointmentForm from '../../calendar.screen/AppointmentForm'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/react-select/_react-select.scss'

function BookingUpdate({
  open,
  pending,
  handleOpen,
  locationsList,
  updatePending,
  selectedBooking
}) {
  // ** Skin
  const { skin } = useSkin()

  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleOpen} />
  )

  return (
    <Modal
      isOpen={open}
      toggle={handleOpen}
      className="modal-dialog-centered calendarModal"
      style={{ zIndex: 9999 }}
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        toggle={handleOpen}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">
          {selectedBooking?.id ? 'Edit' : 'Add'}
          &nbsp;Booking
        </h5>
      </ModalHeader>
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          {pending ? (
            <Spinner />
          ) : (
            <AppointmentForm
              skin={skin}
              handleOpen={handleOpen}
              update={updatePending}
              locationsList={locationsList}
              selectedBooking={selectedBooking}
            />
          )}
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}


export default BookingUpdate
