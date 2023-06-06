/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

// ** Utils
import { isObjEmpty } from '@utils'

// ** Third Party Packages
import * as Yup from 'yup'
import { X } from 'react-feather'
import validator from 'validator'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner
} from 'reactstrap'

// ** Components
import FormGroupElement from '@FormGroupElement'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { registerServiceAction } from '../../../redux/system/systemActions'
import {Icon} from "@iconify/react"

const NameBoardModal = ({ loading, open, handleModal }) => {
  const [type, setType] = useState('welcome_board')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const NameBoardSchema = Yup.object().shape({
    email: Yup.string().email().required('Email  is required'),
    password: Yup.string().test(
      'strong-password',
      'Password must contain at least 8 characters, one number, uppercase letter, lowercase letter and symbol',
      (value) => {
        if (!value) {
          return true
        }
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minNumbers: 1,
          minUppercase: 1,
          minSymbols: 1
        })
      }
    )
  })
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: NameBoardSchema,
    enableReinitialize: true,

    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        dispatch(
          registerServiceAction({
            values,
            type,
            navigate,
            callBack: () => {
              handleModal()
              resetForm()
            }
          })
        )
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
        <h5 className="modal-title ethera-dark fw-600">Register Name Board</h5>
      </ModalHeader>

      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form name="name-board" onSubmit={formik.handleSubmit}>
            <div className="px-2">
              <FormGroupElement
                inputType="text"
                label="Email"
                type="email"
                labelClassName="pl-10px"
                inputName="email"
                placeholder="Enter email"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('email')}
                formikTouched={formik.touched.email}
                formikError={formik.errors.email}
              />

              <FormGroup className="m-b-0 min-h-10">
                <Label className="ml-1 form-label" htmlFor="password">
                  Password
                </Label>
                <InputPasswordToggle
                  name="password"
                  id="password"
                  {...formik.getFieldProps('password')}
                  inputClassName="form-fields radius-25 skin-change"
                  className={classNames({
                    'input-group-merge': true,
                    'is-invalid':
                      formik.touched.password && formik.errors.password
                  })}
                />
                {formik.touched.password && formik.errors.password ? (
                  <FormFeedback className="ml-1">
                    {formik.errors.password || error?.password?.[0]}
                  </FormFeedback>
                ) : null}
              </FormGroup>
            </div>
            <hr className="m-t-4" />

            <div className="px-2 pb-2 modal-credit-buttons">
              <Button type="button" className="button-delete pd">
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

              <Button
                disabled={loading}
                className="button-success pd"
                type="submit"
              >
                <Icon icon={loading ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                <span className="px-1">Save</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default NameBoardModal
