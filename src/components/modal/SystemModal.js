/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react'

// ** Utils
import { isObjEmpty, getModifiedValues } from '@utils'

// ** Third Party Packages
import { X } from 'react-feather'
import { useFormik } from 'formik'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
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
import { SystemModalSchema } from './SystemModalSchema'
import FileUploaderSingleAdmin from '@FileUploader/FileUploaderSingleAdmin'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  registerAdminAction,
  updateAdminAction
} from '../../redux/system/systemActions'

const SystemModal = ({ loading, open, handleModal, admin, edit }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [image, setImage] = useState(null)

  const { getAdmin } = useSelector((state) => state.system)
  const id = getAdmin?.id

  const formik = useFormik({
    initialValues: {
      first_name: getAdmin?.first_name || '',
      last_name: getAdmin?.last_name || '',
      email: getAdmin?.email || '',
      password: ''
    },
    validationSchema: SystemModalSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        if (edit && admin) {
          const modifiedValues = getModifiedValues(
            values,
            formik?.initialValues
          )


          dispatch(
            updateAdminAction({
              id,
              data: modifiedValues,
              image,
              navigate,
              callBack: () => {
                setImage(null)
                resetForm()
              }
            })
          )
        }
        if (!edit && !!admin) {
          dispatch(
            registerAdminAction({
              data: values,
              image,
              navigate,
              callBack: () => {
                handleModal()
                setImage(null)
                resetForm()
              }
            })
          )
        }
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
        setImage(null)
      }}
    />
  )

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleModal()
        formik.resetForm()
        setImage(null)
      }}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        close={CloseBtn}
        toggle={() => {
          handleModal()
          formik.resetForm()
          setImage(null)
        }}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">
          {edit ? 'Update' : 'Register'} Admin
        </h5>
      </ModalHeader>

      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <Form onSubmit={formik.handleSubmit}>
            <div className="px-2">
              {/* {!!getAdmin?.avatar ? '' :  */}
              <p className="pl-10px">Profile Image</p>
              <FileUploaderSingleAdmin
                // label="Profile Image"
                title={'Profile Image'}
                description={'Drag a a profile Image'}
                url={getAdmin?.avatar}
                file={image}
                onChange={(file) => {
                  setImage(file)
                }}
              >
                {/* <strong>Profile Image</strong> */}
                <Icon icon="uiw:cloud-upload" width="64" height="64" />
                <h5>
                  <span className="text-success">Choose image</span> or drag and
                  drop image
                </h5>
                <p>
                  <a href="/" onClick={(e) => e.preventDefault()}>
                    upload .jpg or .png image
                  </a>{' '}
                </p>
                <p>max upload size: 10MB</p>
              </FileUploaderSingleAdmin>
              {/* } */}
              <FormGroupElement
                inputType="text"
                label="First Name"
                labelClassName="pl-10px"
                inputName="first_name"
                placeholder="Enter First Name"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('first_name')}
                formikTouched={formik.touched.first_name}
                formikError={formik.errors.first_name}
              />
              <FormGroupElement
                inputType="text"
                label="Last Name"
                labelClassName="pl-10px"
                inputName="last_name"
                placeholder="Enter Last Name"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('last_name')}
                formikTouched={formik.touched.last_name}
                formikError={formik.errors.last_name}
              />

              <FormGroupElement
                inputType="text"
                label="Email"
                labelClassName="pl-10px"
                inputName="email"
                placeholder="Enter email"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('email')}
                formikTouched={formik.touched.email}
                formikError={formik.errors.email}
              />
              {!edit && (
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
              )}
            </div>
            <hr className="m-t-2" />

            <div className="px-2 pb-2 modal-credit-buttons">
              <Button type="button" className="button-delete pd">
                <span
                  className="pe-2"
                  onClick={() => {
                    handleModal(false)
                    formik.resetForm()
                    setImage(null)
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
                <span className="px-1">{edit ? 'Update' : 'Save'}</span>
              </Button>
            </div>
          </Form>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default SystemModal
