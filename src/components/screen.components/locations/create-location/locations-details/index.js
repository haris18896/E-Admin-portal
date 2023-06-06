/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
// ** hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Packages
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Label,
  Row,
  Spinner
} from 'reactstrap'

// ** Components
import { DayOfWeek, operatingHours } from '@status/DayOfWeek'
import {
  isObjEmpty,
  PhoneUS,
  getModifiedValues,
  dateUnix,
  dateUS
} from '@utils'
import FormGroupElement from '@FormGroupElement'
import { LocationDetailsSchema } from './constants'
import FileUploaderSingle from '@FileUploader/FileUploaderSingle'
import AlertModal from '@customComponents/alert'

// ** Actions and Store
import { useDispatch, useSelector } from 'react-redux'
import {
  registerLocationAction,
  getLocationAction,
  deleteLocationAction,
  updateLocationAction
} from '@store/locations/locationsAction'
import { resetGetLocation } from '@store/locations/locationsSlice'

function LocationDetails({ edit }) {
  const skin = useSkin()
  const idx = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, getLocation, DeleteLoading } = useSelector((state) => state.locations)

  const today = new Date()

  const [image, setImage] = useState(null)
  const [roomMap, setRoomMap] = useState(null)
  const [deleteLocation, setDeleteLocation] = useState(false)

  const handleCloseDeleteLocation = () => setDeleteLocation(false)
  const handleOpenDeleteLocation = (id) => {
    setDeleteLocation(true)
  }
  useEffect(() => {
    if (idx?.id) {
      dispatch(getLocationAction(idx?.id))
    } else {
      dispatch(resetGetLocation())
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      name: getLocation?.name || '',
      address: getLocation?.address || '',
      contact_person: getLocation?.contact_person || '',
      email: getLocation?.email || '',
      phone_number: getLocation?.phone_number
        ? PhoneUS(`${getLocation?.phone_number}`)
        : PhoneUS(''),

      operating_hours: !!getLocation?.operating_hours.length
        ? getLocation?.operating_hours?.map((item, index) => {
            return {
              ...item,
              day_of_week: DayOfWeek[`${index + 1}`].value
            }
          })
        : operatingHours,

      closed_dates:
        getLocation?.closed_dates.map((item) => {
          return {
            // ...item,
            // date: moment.unix(item.date).format('MMMM DD, YYYY')
            date: item.date
          }
        }) || []
    },
    validationSchema: LocationDetailsSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isObjEmpty(formik.errors)) {
        // ** adding image

        // ** Update location

        if (edit) {
          const modifiedValues = getModifiedValues(
            values,
            formik?.initialValues
          )
          const id = idx?.id

          dispatch(
            updateLocationAction({
              id,
              data: modifiedValues,
              image,
              roomMap,
              navigate
            })
          )
        }

        // ** Adding location
        if (!edit) {
          dispatch(
            registerLocationAction({ data: values, image, roomMap, navigate })
          )
        }
      }
    }
  })

  useEffect(() => {
    return () => {
      dispatch(resetGetLocation())
    }
  }, [])

  return (
    <>
      <AlertModal
        loading={DeleteLoading}
        open={deleteLocation}
        handleOpen={handleOpenDeleteLocation}
        handleClose={handleCloseDeleteLocation}
        handleAction={() => {
          dispatch(deleteLocationAction({ id: idx?.id, navigate }))
        }}
        title="Delete Location"
        message="Are you sure you want to delete this location ?"
      />
      <Card>
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <CardBody className=" create-location--location_detail">
              <Col lg="4" md="6">
                <FormGroupElement
                  required
                  autoFocus
                  inputType="text"
                  label="Location Name"
                  name="name"
                  labelClassName="pl-10px"
                  placeholder="Enter Location Name"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('name')}
                  formikTouched={formik.touched.name}
                  formikError={formik.errors.name}
                />
              </Col>
              <Col lg={getLocation?.image ? '8' : '4'} xs="12">
                <FileUploaderSingle
                  required
                  label="Image"
                  file={image}
                  url={getLocation?.image}
                  onChange={(file) => {
                    setImage(file)
                  }}
                >
                  <strong>Upload Location Image</strong>
                  <Icon icon="ic:round-cloud-upload" width="65" height="65" />
                  <h5 className="text-align-center">
                    <span className="text-success">Choose File</span> or drag
                    and drop file to upload
                  </h5>
                  <p className="text-secondary">only JPG or PNG</p>
                </FileUploaderSingle>
              </Col>

              {/* <Col lg={getLocation?.room_map ? '9' : '5'} xs="12">
                <Label className="pl-10px fw-700">Room Map</Label>
                <FileUploaderSingle
                  onChange={(file) => setRoomMap(file)}
                  file={roomMap}
                  url={getLocation?.room_map}
                >
                  <strong>Upload Room Map</strong>
                  <Icon icon="ic:round-cloud-upload" width="65" height="65" />
                  <h5 className="text-align-center">
                    <span className="text-success">Choose File</span> or drag
                    and drop file to upload
                  </h5>
                  <p className="text-secondary">only JPG or PNG</p>
                </FileUploaderSingle>
              </Col> */}

              <Col md="6">
                <FormGroupElement
                  inputType="text"
                  label="Address"
                  required
                  name="address"
                  labelClassName="pl-10px"
                  placeholder="Enter Full Address"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('address')}
                  formikTouched={formik.touched.address}
                  formikError={formik.errors.address}
                />
              </Col>

              <Col md="6">
                <FormGroupElement
                  inputType="text"
                  label="Contact Person"
                  name="contact_person"
                  labelClassName="pl-10px"
                  inputClassName="form-fields radius-25 skin-change"
                  {...formik.getFieldProps('contact_person')}
                  formikTouched={formik.touched.contact_person}
                  formikError={formik.errors.contact_person}
                />
              </Col>

              <Row className="align-items-start">
                <Col md="6" lg="3" className={'pr-0'}>
                  <FormGroupElement
                    inputType="email"
                    label="Email"
                    required
                    name="email"
                    placeholder="Enter Your Email Address"
                    labelClassName="pl-10px"
                    inputClassName="form-fields radius-25 skin-change"
                    {...formik.getFieldProps('email')}
                    formikTouched={formik.touched.email}
                    formikError={formik.errors.email}
                  />
                </Col>

                <Col md="6" lg="3" className={'pr-0'}>
                  <FormGroupElement
                    inputType="text"
                    label="Phone"
                    required
                    name="phone_number"
                    placeholder="Enter Your Phone Number"
                    labelClassName="pl-10px"
                    inputClassName="form-fields radius-25 skin-change"
                    value={formik.values.phone_number}
                    onChange={(e) =>
                      formik.setFieldValue(
                        'phone_number',
                        PhoneUS(e.target.value)
                      )
                    }
                    formikTouched={formik.touched.phone_number}
                    formikError={formik.errors.phone_number}
                  />
                </Col>
              </Row>
            </CardBody>

            <hr />
            <CardBody className=" create-location--location_detail">
              <div className="create-location--location_detail__operatingHours mb-2">
                <div className="create-location--location_detail__operatingHours--day">
                  <p className="sub-heading-2 whiteSpace fw-700">
                    Operating Hours
                  </p>
                </div>
                <div className="create-location--location_detail__operatingHours--time">
                  <div className="create-location--location_detail__operatingHours--open">
                    <p className="sub-heading-2 fw-700">OPEN</p>
                  </div>
                  <div className="create-location--location_detail__operatingHours--close">
                    <p className="sub-heading-2 fw-700">CLOSE</p>
                  </div>
                </div>
              </div>
              {formik.values.operating_hours.map((item, index) => (
                <div
                  className="create-location--location_detail__operatingHours"
                  key={index}
                >
                  <div className="create-location--room_detail__operatingHours--day">
                    <FormGroupElement
                      inputType="checkbox"
                      inputName={`${item.day_of_week}`}
                      label={DayOfWeek[item.day_of_week].text}
                      labelClassName="pl-10px"
                      formGroupClassName="client_profile--checkbox"
                      inputClassName="skin-change"
                      checked={
                        formik.values?.operating_hours?.[index]?.is_useable
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          `operating_hours[${index}].is_useable`,
                          e.target.checked
                        )
                      }}
                    />
                  </div>

                  <div className="create-location--location_detail__operatingHours--time">
                    <div className="create-location--location_detail__operatingHours--open">
                      <Flatpickr
                        data-enable-time
                        id="start_time"
                        name="start_time"
                        type="time"
                        className={classNames({
                          'radius-25 form-control mb-1 skin-change': true,
                          'time-date-row__dark': skin === 'dark'
                        })}
                        options={{
                          mode: 'single',
                          enableTime: true,
                          noCalendar: true,
                          time_24hr: true,
                          dateFormat: 'H:i'
                        }}
                        value={
                          formik.values?.operating_hours[index]?.start_time
                        }
                        onChange={(time) =>
                          formik.setFieldValue(
                            `operating_hours[${index}].start_time`,
                            moment(`${time}`).format('HH:mm')
                          )
                        }
                      />
                    </div>

                    <div className="create-location--location_detail__operatingHours--close">
                      <Flatpickr
                        data-enable-time
                        id="close_time"
                        name="close_time"
                        type="time"
                        className={classNames({
                          'radius-25 form-control mb-1 skin-change': true,
                          'time-date-row__dark': skin === 'dark'
                        })}
                        options={{
                          mode: 'single',
                          enableTime: true,
                          noCalendar: true,
                          time_24hr: true,
                          dateFormat: 'H:i '
                        }}
                        value={
                          formik.values?.operating_hours[index]?.close_time
                        }
                        onChange={(time) =>
                          formik.setFieldValue(
                            `operating_hours[${index}].close_time`,
                            moment(`${time}`).format('HH:mm')
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>

            <hr />
            <CardBody className=" create-location--location_detail">
              <p className="sub-heading-2 fw-700 mb-1">Closed Dates</p>
              <FieldArray
                name="closed_dates"
                render={(arrayHelpers) => (
                  <>
                    {formik?.values?.closed_dates?.map((item, index) => (
                      <Col md="6" lg="3" key={index}>
                        <Flatpickr
                          data-enable-time
                          id="closed_dates"
                          name="closed_dates"
                          type="date"
                          placeholder="Select Closing Date"
                          className={classNames({
                            'radius-25 form-control mb-1 skin-change': true,
                            'time-date-row__dark': skin === 'dark'
                          })}
                          options={{
                            mode: 'single',
                            enableTime: false,
                            dateFormat: 'F j, Y'
                          }}
                          value={moment.unix(item.date).format('MMMM DD, YYYY')}
                          onChange={(date) => {
                            arrayHelpers.replace(index, {
                              date: dateUnix(date)
                            })
                          }}
                          // value={item?.date}
                          // onChange={(date) => {
                          //   arrayHelpers.replace(index, {
                          //     date: moment(`${date}`)
                          //       .format('MMMM DD, YYYY')
                          //       .split('T')[0]
                          //   })
                          // }}
                        />
                      </Col>
                    ))}

                    <Button className="add-more" type="button">
                      <Icon icon="ic:baseline-plus" />
                      <span
                        className="px-1"
                        onClick={() =>
                          arrayHelpers.push({
                            // date: moment(today).format('MMMM DD, YYYY')
                            date: dateUnix(today)
                          })
                        }
                      >
                        Closed Dates
                      </span>
                    </Button>
                  </>
                )}
              />
            </CardBody>

            <hr />
            <CardBody className=" create-location--location_detail">
              <div className="create-location--location_detail__actions">
                <div>
                  <Button
                    color="danger"
                    className={classNames({ pd: true, 'd-none': !idx?.id })}
                    type="button"
                    // onClick={handleDeleteLocation(!idx?.id)}
                    disabled={!idx?.id && true}
                    onClick={() => handleOpenDeleteLocation()}
                  >
                    <Icon icon="bi:trash-fill" />

                    <span className="px-1">Delete Location</span>
                  </Button>
                </div>

                <div className="create-location--location_detail__actions--save">
                  <Button
                    className="button-cancel pd"
                    onClick={() => formik.resetForm()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button className="button-success pd" type="submit">
                    <Icon icon={loading ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                    <span className="px-1">{edit ? 'Update' : 'Save'}</span>
                  </Button>
                </div>
              </div>
            </CardBody>
          </Form>
        </FormikProvider>
      </Card>
    </>
  )
}

export default LocationDetails
