/* eslint-disable comma-dangle */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

// ** Custom Hooks & Utility Functions
import { isObjEmpty, PhoneUS, dateUS, dateUnix } from '@utils'
import useMediaQuery from '@hooks/useMediaQuery'
import { ProviderStatusObj } from '@status/BadgeColors'

// ** Third Party Packages
import { nanoid } from 'nanoid'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Badge,
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner
} from 'reactstrap'

// ** Components
import SelectField from '@select'
import AlertModal from '@customComponents/alert'

import Avatar from '@components/avatar'
import { licenseTypesList } from '../constants'
import FormGroupElement from '@FormGroupElement'
import { ProviderType } from '@status/ProviderTypes'
import { ProviderFormValidationSchema, States } from './constants'
import FileUploaderSingle from '@FileUploader/FileUploaderSingle'

// ** Images
import { Edit2 } from 'react-feather'
import defaultAvatar from '@src/assets/default.png'
import CreditModal from '../../../components/screen.components/providers.screen/credit-modal'

// ** Actions and Store
import { useDispatch, useSelector } from 'react-redux'
import {
  getEtheraCreditAction,
  getPromoCreditAction
} from '../../../redux/provider/providerAction'

function ProviderForm({ initials, edit, submit, imageUrl, setActive, active }) {
  const dispatch = useDispatch()
  const tablet = useMediaQuery('(max-width: 768px)')

  const [image, setImage] = useState(null)
  const [promo, setPromo] = useState(true)
  const [table, setTable] = useState(false)
  const [selected, setSelected] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [providerId, setProviderId] = useState(null)
  const [providerStatus, setProviderStatus] = useState(false)

  const { getProvider, loading, loadingImage, error } = useSelector(
    (state) => state.provider
  )

  const handleModal = () => setOpenModal(!openModal)
  const handleCloseProviderStatus = () => setProviderStatus(false)
  const handleOpenProviderStatus = (id) => {
    setProviderStatus(true)
  }

  const formik = useFormik({
    initialValues: initials,
    validationSchema: ProviderFormValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        submit({ values, image })
      }
    }
  })

  const cardsData = [
    {
      id: `${getProvider?.id}`,
      name: 'Ethera Credit',
      price: `$ ${getProvider?.ethera_credit || '00'}`,
      editBtn: 'Edit Ethera Credit',
      checked: true,
      promo: false
    },
    {
      id: `${getProvider?.id}`,
      name: 'Promo Credit',
      price: `$ ${getProvider?.promo_credit || '00'}`,
      editBtn: 'Edit Promo Credit',
      checked: false,
      promo: true
    }
  ]

  const handleCreditId = (id) => {
    const ids = []
    ids.push(id)
    return ids
  }
  const handleGetDetails = (id, promo, data, openModal) => {
    {
      promo ? setPromo(true) : setPromo(false)
    }

    setTable(true)

    setOpenModal(!openModal)
    setSelected(data)
    if (promo) return dispatch(getPromoCreditAction(id))
    dispatch(getEtheraCreditAction(id))
  }

  const initialLicenses = initials?.provider_license?.map((license) => {
    return {
      value: license?.license_type,
      text: ProviderType[license?.license_type]?.text || 'All'
    }
  })


  const initialStates = formik.initialValues?.provider_license?.map(
      (provider_license) => {
        return {
          value: provider_license?.state,
          text: provider_license?.state || 'All'
        }
      }
  )

  return (
    <>
      <CreditModal
        promo={promo}
        table={table}
        open={openModal}
        handleModal={handleModal}
        handleSelectedIds={() => edit && handleCreditId(edit)}
        selected={selected}
      />
      <AlertModal
        loading={loading}
        open={providerStatus}
        handleOpen={handleOpenProviderStatus}
        handleClose={handleCloseProviderStatus}
        handleAction={() => {
          setActive(initials?.status === '2' ? 3 : 2)
          formik.handleSubmit()
        }}
        title={
          initials?.status === '2' ? 'Deactivate Provider' : 'Active Provider'
        }
        message={
          initials?.status === '2'
            ? 'Are you sure you want to deactivate this provider ?'
            : 'Are you sure you want to active this provider ?'
        }
      />

      {edit && (
        <section className="m-2  badge-gap">
          <div className="d-flex align-items-center justify-content-start">
            <Avatar
              img={initials?.avatar || defaultAvatar}
              imgHeight="80"
              imgWidth="80"

            />
            <div className="ml-1">
              <h4 className="m-b-2">{`${
                initials?.first_name || 'Loading....'
              } ${initials?.last_name}`}</h4>
              {initials?.provider_license.map((license, index) => (
                <span key={index} className="whiteSpace tableListSpan">
                  {ProviderType[license?.license_type]?.text || '--'}
                  <span>, &nbsp;</span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <Badge
              color={ProviderStatusObj[initials?.status]?.color}
              pill
              className={
                ProviderStatusObj[initials?.status]?.label !== 'Active'
                  ? 'fw-300 inactive-padding'
                  : 'fw-300 active-color'
              }
            >
              {ProviderStatusObj[initials?.status]?.label || ''}
            </Badge>
          </div>
        </section>
      )}
      <FormikProvider value={formik}>
        <Form name="create-provider-form" onSubmit={formik.handleSubmit}>
          <div className="client_profile">
            {edit && (
              <Row>
                {cardsData.map((item, i) => {
                  const { id, name, price, editBtn, checked, promo } = item
                  return (
                    <Col sm={12} md={6} lg={5} key={i}>
                      <ListGroup flush className="ethera-card mb-1">
                        <ListGroupItem
                          className={
                            checked
                              ? 'heading heading-credit'
                              : 'heading heading-promo'
                          }
                        >
                          <p>{name}</p>
                          <h3>{price}</h3>
                        </ListGroupItem>
                        <ListGroupItem className="ethera-card-edit-btn">
                          <Button
                            onClick={() => {
                              handleGetDetails(id, promo, item)
                            }}
                            className="w-100"
                          >
                            <Edit2
                              size={12}
                              className="ethera-card-edit-icon"
                            />
                            {editBtn}
                          </Button>
                        </ListGroupItem>
                      </ListGroup>
                    </Col>
                  )
                })}
              </Row>
            )}
            <p className="my-2 heading-3 fw-400">Profile Information</p>

            <Row className="align-items-start">
              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="First Name"
                  // placeholder="Enter Your First Name"
                  labelClassName="pl-10px"
                  inputName="first_name"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('first_name')}
                  formikTouched={formik.touched.first_name}
                  formikError={formik.errors.first_name}
                  backendError={error?.first_name?.[0]}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="Last Name"
                  labelClassName="pl-10px"
                  inputName="last_name"
                  // placeholder="Enter Your Lst Name"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('last_name')}
                  formikTouched={formik.touched.last_name}
                  formikError={formik.errors.last_name}
                  backendError={error?.last_name?.[0]}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  inputType="text"
                  label="Middle Name"
                  labelClassName="pl-10px"
                  inputName="middle_name"
                  // placeholder="Enter Your Middle Name"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('middle_name')}
                  formikTouched={formik.touched.middle_name}
                  formikError={formik.errors.middle_name}
                  backendError={error?.middle_name?.[0]}
                />
              </Col>

              <Col sm={12} md={6}>
                <FormGroupElement
                  inputType="text"
                  label="Suffix"
                  labelClassName="pl-10px"
                  inputName="suffix"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('suffix')}
                  formikTouched={formik.touched.suffix}
                  formikError={formik.errors.suffix}
                  backendError={error?.suffix?.[0]}
                />
              </Col>

              <Col sm={12} md={6}>
                {/* <FormGroup style={{marginBottom: 0}}> */}
                <div className="d-flex align-items-center form-label ">
                  <Label className="pl-10px">Date of Birth</Label>
                </div>
                <Row>
                  <Col xs={4} sm={4} md={4} className="pr-0">
                    <FormGroupElement
                      inputType="number"
                      label="Month"
                      max={12}
                      labelClassName="pl-10px "
                      inputName="month"
                      inputClassName="form-fields radius-25 skin-change "
                      {...formik.getFieldProps('month')}
                      formikTouched={formik.touched.month}
                      formikError={formik.errors.month}
                      backendError={error?.month?.[0]}
                    />
                  </Col>

                  <Col xs={4} sm={4} md={4}>
                    <FormGroupElement
                      inputType="number"
                      label="Day"
                      max={31}
                      labelClassName="pl-10px"
                      inputName="day"
                      inputClassName="form-fields radius-25 skin-change "
                      {...formik.getFieldProps('day')}
                      formikTouched={formik.touched.day}
                      formikError={formik.errors.day}
                      backendError={error?.day?.[0]}
                    />
                  </Col>
                  <Col xs={4} sm={4} md={4} className="pl-0">
                    <FormGroupElement
                      inputType="number"
                      label="Year"
                      labelClassName="pl-10px"
                      inputName="year"
                      inputClassName="form-fields radius-25 skin-change"
                      {...formik.getFieldProps('year')}
                      formikTouched={formik.touched.year}
                      formikError={formik.errors.year}
                      backendError={error?.year?.[0]}
                    />
                  </Col>
                </Row>

                {/* <Flatpickr
                  id="date_of_birth"
                  className={classNames({
                    'form-control radius-25 skin-change pointer mb-0': true,
                    'is-invalid':
                      formik.touched.date_of_birth &&
                      formik.errors.date_of_birth
                  })}
                  // placeholder="mm/dd/yy"
                  type="date"
                  name="date_of_birth"
                  value={dateUS(formik.values?.date_of_birth)}
                  onChange={(date) => {
                    formik.setFieldValue(`date_of_birth`, dateUnix(date))
                  }}
                  options={{
                    dateFormat: 'n/j/Y',
                    maxDate: 'today',
                    enableTime: false,
                    mode: 'single',
                    timezone: 'America/Los_Angeles'
                  }}
                /> */}
                {/*
                {formik.touched.date_of_birth && formik.errors.date_of_birth ? (
                  <FormFeedback className="ml-1">
                    {formik.errors.date_of_birth}
                  </FormFeedback>
                ) : null} */}
              </Col>
            </Row>
            <Row className="align-items-start">
              <Col sm={12} md={6}>
                <FormGroupElement
                  required
                  inputType="text"
                  label="Practice Name"
                  labelClassName="pl-10px"
                  formGroupClassName="mt-1"
                  inputName="practice"
                  inputClassName="form-fields resize-none radius-25 skin-change"
                  {...formik.getFieldProps('practice')}
                  formikTouched={formik.touched.practice}
                  formikError={formik.errors.practice}
                  backendError={error?.practice?.[0]}
                />
              </Col>
            </Row>

            <Col sm={12} className="mt-3">
              <FileUploaderSingle
                label="Profile Image"
                title={'Profile Image'}
                description={'Drag a a profile Image'}
                file={image}
                onChange={(file) => {
                  setImage(file)
                }}
                url={imageUrl}
              >
                <strong>Profile Image</strong>
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
              </FileUploaderSingle>
            </Col>
          </div>

          <hr />

          <div className="client_profile">
            <p className="my-2 heading-3 fw-400">Account Information</p>
            <Col sm={12} md={6}>
              <FormGroupElement
                required
                inputType="email"
                label="Email"
                rows={3}
                // placeholder="Enter Your Email"
                labelClassName="pl-10px"
                inputName="email"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('email')}
                formikTouched={formik.touched.email}
                formikError={formik.errors.email}
                backendError={error?.email?.[0]}
              />
            </Col>

            <Col sm={12} md={6}>
              <FormGroupElement
                required
                inputType="text"
                label="Mobile Phone Number"
                rows={3}
                // placeholder="Enter Your Mobile Phone Number"
                labelClassName="pl-10px"
                inputName="phone_number"
                inputClassName="form-fields radius-25 skin-change"
                value={formik.values.phone_number}
                onChange={(e) =>
                  formik.setFieldValue(`phone_number`, PhoneUS(e.target.value))
                }
                formikTouched={formik.touched.phone_number}
                formikError={formik.errors.phone_number}
                backendError={error?.phone_number?.[0]}
              />
            </Col>
            <Label className="ml-1">
              Used to verify your account should you need to recover your
              username or reset password
            </Label>
          </div>

          <hr className="my-2" />
          <div className="client_profile">
            <p className="my-2 heading-3 fw-400">License</p>
            <FieldArray
              name="provider_license"
              render={(arrayHelpers) => (
                <>
                  {formik.values.provider_license.map(
                    (provider_license, index) => (
                      <div key={index} className="client_profile--licenseList">
                        <Row className="align-items-start">
                          <Col sm={12} md={6}>
                            <SelectField
                                label={'License Type'}
                                required
                              className="plr-0 position-relative"
                              header={false}
                              menuHeight="20rem"
                              defaultValue={
                                edit && initialLicenses.length
                                  ? initialLicenses[index]
                                  : licenseTypesList[0]
                              }
                              search={false}
                              data={licenseTypesList}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `provider_license.${index}.license_type`,
                                  `${e.value}`
                                )
                              }}
                            />
                          </Col>

                          <Col sm={12} md={6}>
                            <FormGroupElement
                              inputType="text"
                              label="License #"
                              required
                              // placeholder="Enter Your License #"
                              id={`provider_license.${index}.license_number-${nanoid()}`}
                              labelClassName="pl-10px"
                              inputName="license_number"
                              inputClassName="form-fields radius-25 skin-change"
                              {...formik.getFieldProps(
                                `provider_license.${index}.license_number`
                              )}
                              formikTouched={
                                formik.touched?.provider_license?.[index]
                                  ?.license_number
                              }
                              formikError={
                                formik.errors?.provider_license?.[index]
                                  ?.license_number
                              }
                            />
                          </Col>

                          <Col sm={12} md={6}>
                            <div className={'d-flex align-items-center form-label'}>
                              <div className="required-dot" />
                              <Label className="pl-10px">License Expiration</Label>
                            </div>
                            <Flatpickr
                              id={`expire-date-${index}`}
                              className="form-control radius-25 skin-change"
                              // placeholder="Select Date"
                              type="date"
                              name={`provider_license[${index}].expire_date`}
                              value={dateUS(
                                formik.values?.provider_license?.[index]
                                  ?.expire_date
                              )}
                              onChange={(date) => {
                                formik.setFieldValue(
                                  `provider_license[${index}].expire_date`,
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
                          </Col>

                          <Col sm={12} md={6}>
                            <SelectField
                                label="License State"
                                required
                                menuHeight="18rem"
                                className="plr-0 position-relative"
                                header={false}
                                defaultValue={
                                    initialStates[index] || States[0]
                                }
                                data={States}
                                search={false}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        `provider_license.${index}.state`,
                                        `${e.value}`
                                    )
                                }
                            />
                          </Col>

                          {formik.values.provider_license.length > 1 && (
                            <div className="trashLeft">
                              <Icon
                                icon="bi:trash-fill"
                                color="red"
                                width="20"
                                height="20"
                                onClick={() => arrayHelpers.remove(index)}
                                className="cursor-pointer"
                              />
                            </div>
                          )}
                        </Row>
                      </div>
                    )
                  )}

                  <Button
                    className="add-more"
                    onClick={() =>
                      arrayHelpers.push({
                        license_type: '',
                        license_number: '',
                        expire_date: '',
                        state: ''
                      })
                    }
                  >
                    <Icon icon="ic:baseline-plus" />
                    <span className="px-1">Additional License</span>
                  </Button>
                </>
              )}
            />
            <Row className="mt-2">
              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="NPI Type 1"
                  // placeholder="000000000"
                  labelClassName="pl-10px"
                  inputName="npi"
                  formGroupClassName="mt-2"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('npi')}
                  formikTouched={formik.touched.npi}
                  formikError={formik.errors.npi}
                  backendError={error?.npi?.[0]}
                />
              </Col>
              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="NPI Type 2"
                  // placeholder="000000000"
                  labelClassName="pl-10px"
                  inputName="npi_two"
                  formGroupClassName="mt-2"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('npi_two')}
                  formikTouched={formik.touched.npi_two}
                  formikError={formik.errors.npi_two}
                  backendError={error?.npi_two?.[0]}
                />
              </Col>
              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="Tax ID for NPI Type 1"
                  // placeholder="000000000"
                  labelClassName="pl-10px"
                  inputName="tax"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('tax')}
                  formikTouched={formik.touched.tax}
                  formikError={formik.errors.tax}
                  backendError={error?.tax?.[0]}
                />
              </Col>
              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="Tax ID for NPI Type 2"
                  // placeholder="000000000"
                  labelClassName="pl-10px"
                  inputName="tax_two"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('tax_two')}
                  formikTouched={formik.touched.tax_two}
                  formikError={formik.errors.tax_two}
                  backendError={error?.tax_two?.[0]}
                />
              </Col>

              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="Taxonomy Code"
                  labelClassName="pl-10px"
                  // placeholder="000000000"
                  inputName="taxonomy"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('taxonomy')}
                  formikTouched={formik.touched.taxonomy}
                  formikError={formik.errors.taxonomy}
                  backendError={error?.taxonomy?.[0]}
                />
              </Col>
              <Col sm={12} md={6} lg={6}>
                <FormGroupElement
                  inputType="number"
                  label="CAQH"
                  // placeholder="000000000"
                  labelClassName="pl-10px"
                  inputName="caqh"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('caqh')}
                  formikTouched={formik.touched.caqh}
                  formikError={formik.errors.caqh}
                  backendError={error?.caqh?.[0]}
                />
              </Col>
            </Row>
          </div>

          {/* Password Section */}
          {/* {!edit && (
            <>
              <hr className="my-2" />
              <div className="client_profile">
                <p className="my-2 heading-3 fw-400">Change Password</p>

                <Col sm={12} md={6}>
                  <FormGroup className="marginBottom-1">
                    <Label className="ml-1 form-label" htmlFor="password">
                      New Password
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
                </Col>

                <Col sm={12} md={6}>
                  <FormGroup className="marginBottom-1">
                    <Label
                      className="ml-1 form-label"
                      htmlFor="confirm_new_password"
                    >
                      Confirm New Password
                    </Label>
                    <InputPasswordToggle
                      name="confirm_new_password"
                      id="confirm_new_password"
                      {...formik.getFieldProps('confirm_new_password')}
                      inputClassName="form-fields radius-25 skin-change"
                      className={classNames({
                        'input-group-merge': true,
                        'is-invalid':
                          formik.touched.confirm_new_password &&
                          formik.errors.confirm_new_password
                      })}
                    />
                    {formik.touched.confirm_new_password &&
                    formik.errors.confirm_new_password ? (
                      <FormFeedback className="ml-1">
                        {formik.errors.confirm_new_password}
                      </FormFeedback>
                    ) : null}
                  </FormGroup>
                </Col>
                <Label className="ml-1">
                  Requirements: 8+ characters at least, one number, one
                  uppercase, one lowercase letter
                </Label>
              </div>
            </>
          )} */}

          <hr className="my-2" />
          <div className="d-flex">
            <Button
              disabled={
                (loading && active === 0) ||
                loadingImage ||
                (image === null && !formik.dirty)
              }
              className="my-2 ml-2 button-success pd"
              onClick={() => {
                formik.handleSubmit()
              }}
            >
              <Icon icon={(loading || loadingImage) ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
              <span className="px-1">{edit ? 'Update' : 'Save'}</span>
            </Button>
            {edit && (
              <Button
                // disabled={(loading && active !== 0) || loadingImage}
                className={classNames({
                  'd-none': initials?.status === '1',
                  'my-2 button-danger pd': initials?.status === '2',
                  'my-2 ml-1 button-success pd': initials?.status === '3'
                })}
                onClick={() => handleOpenProviderStatus()}
              >
                {/* {loading && active !== 0 && <Spinner size="sm" />} */}
                <span className="px-1">
                  {initials?.status === '2' ? 'Deactivate' : 'Active'}
                </span>
              </Button>
            )}
          </div>
        </Form>
      </FormikProvider>
    </>
  )
}

export default ProviderForm
