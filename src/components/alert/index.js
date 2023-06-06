import React from 'react'

import { Badge, Spinner, Modal, ModalHeader, ModalBody } from 'reactstrap'

import { Icon } from '@iconify/react'
import { X } from 'react-feather'

function AlertModal({
  loading,
  open,
  handleOpen,
  handleClose,
  title,
  message,
  handleAction
}) {
  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleClose} />
  )

  return (
    <Modal
      isOpen={open}
      toggle={handleClose}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        toggle={handleOpen}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">{title}</h5>
      </ModalHeader>
      <ModalBody className="px-3 py-2">
        <div className="px-2 py-1">
          <h5 className="pb-2 text-left">{message}</h5>
          <div className="d-flex justify-content-end align-items-center mt-1">
            <Badge
              className="pointer"
              color="light-secondary mx-1"
              onClick={() => {
                handleClose()
              }}
            >
              <span className="px-1">Cancel</span>
            </Badge>

            <Badge
              color="light-danger"
              className="pointer badge-pill"
              onClick={handleAction}
              disabled={loading}
            >
              <Icon icon={loading ? "eos-icons:loading" :  'bi:trash-fill'} />
              <span className="px-1">
                {title.indexOf('Delete') === 0 ? 'Delete' : 'Confirm'}
              </span>
            </Badge>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default AlertModal
