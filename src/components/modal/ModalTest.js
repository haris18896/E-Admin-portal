/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// third party packages
import { X } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from 'reactstrap'

// ** Components
import FormGroupElement from '@FormGroupElement'
import { useDispatch, useSelector } from 'react-redux'
import {
  getLockAction,
  updateLockAction
} from '../../redux/access/accessAction'
import { LockDetailsSchema } from './ModalSchema'
import { useFormik } from 'formik'
import { isObjEmpty, getModifiedValues } from '@utils'
// ** Actions and Store

// import {
//   addEtheraCreditAction,
//   addPromoCreditAction
// } from '@store/provider/providerAction'

function ModalTest({ open, handleModal }) {
  const dispatch = useDispatch()
  const { getLock, updateLoading } = useSelector((state) => state.access)
  const location = getLock?.location
  const id = getLock?.id

  const formik = useFormik({
    initialValues: {
      name: getLock?.name || '',
      token: getLock?.token || ''
    },
    validationSchema: LockDetailsSchema,
    enableReinitialize: true,
    onSubmit: (values) => {

      if (isObjEmpty(formik.errors)) {
        const modifiedValues = getModifiedValues(values, formik?.initialValues)

        dispatch(updateLockAction({ location, id, data: modifiedValues }))
      }
    }
  })
  // ** Modal Close Handle
  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        handleModal()
        formik.resetForm()
      }}
    />
  )

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleModal()
        formik.resetForm()
      }}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        close={CloseBtn}
        toggle={() => {
          handleModal()
          formik.resetForm()
        }}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">Current Locks</h5>
      </ModalHeader>

      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form onSubmit={formik.handleSubmit}>
            <div className="px-2">
              <FormGroupElement
                inputType="text"
                label="name"
                labelClassName="pl-10px"
                inputName="name"
                placeholder="Enter name"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('name')}
                formikTouched={formik.touched.name}
                formikError={formik.errors.name}
              />
              <FormGroupElement
                inputType="text"
                label="token"
                labelClassName="pl-10px"
                inputName="token"
                placeholder="Enter Token"
                formGroupClassName="mb-3"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('token')}
                formikTouched={formik.touched.token}
                formikError={formik.errors.token}
              />
            </div>
            <hr className="mt-2" />

            <div className="px-2 pb-2 modal-credit-buttons">
              <Button className="button-delete pd" type="button">
                <span
                  className="pe-2"
                  onClick={() => {
                    handleModal(false)
                    formik.resetForm()
                  }}
                >
                  Cancel
                </span>
              </Button>

              <Button className="button-success pd" type="submit">
                {updateLoading && <Spinner className="spinner-size" />}{' '}
                <span className="px-1">Update</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default ModalTest
