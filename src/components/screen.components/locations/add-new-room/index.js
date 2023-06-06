/* eslint-disable no-unused-vars */
import React, { Fragment, useEffect, useState } from 'react'
// ** Hooks
import { useSkin } from '@hooks/useSkin'

// ** Utils
import { isObjEmpty, dateUS, dateUnix } from '@utils'

// ** Third Party Packages
import { Icon } from '@iconify/react'
import moment from 'moment'
import { X } from 'react-feather'
import classNames from 'classnames'
import Flatpickr from 'react-flatpickr'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Button,
  Col,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  Table
} from 'reactstrap'

// ** Components
import { DayOfWeek, operatingHours } from '@status/DayOfWeek'
import FormIconField from '@FormIconField'
import FormGroupElement from '@FormGroupElement'
import { newRoomValidationSchema } from './constants'

// ** Store and Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAllTiers } from '@store/tiers/tiersAction'
import { getAllProviders } from '@store/provider/providerAction'
import { addRoomAction } from '@store/rooms/roomsAction'
import toast from 'react-hot-toast'

function AddNewRoomModal({ open, close, handleModal, id }) {
  const skin = useSkin()
  const today = new Date()
  const dispatch = useDispatch()

  const { loading, addRoom } = useSelector((state) => state.rooms)
  const { getAllTiersData } = useSelector((state) => state.tiers)
  const { getAllProvidersData } = useSelector((state) => state.provider)

  const tiersList = getAllTiersData.tiersList
  const providers = getAllProvidersData.providersList

  const [search, setSearch] = useState('')
  const [permission, setPermission] = useState(null) // authorized: 1, unauthorized: 2
  const [providerId, setProviderId] = useState('')
  const [openUsersList, setOpenUsersList] = useState(false)

  const data = providers.filter(({ first_name, last_name }) => {
    const name = `${first_name} ${last_name}`
    return name.toLowerCase().includes(search.toString().toLowerCase())
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      comment: '',
      tiers_excluded: false,
      operating_hours: operatingHours,
      closed_dates: [],
      room_prices: tiersList,
      room_authorization: []
      // room_authorization: authorizations
    },
    validationSchema: newRoomValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          comment: values.comment,
          tiers_excluded: values.tiers_excluded,
          operating_hours: values.operating_hours,
          closed_dates: values.closed_dates,
          room_authorization: values.room_authorization
          // room_authorization: values.room_authorization.filter(
          //   (auth) => parseInt(auth.permission) === permission
          // )
        }

        if (!formik.values.tiers_excluded) {
          const tiers = []
          formik.values.room_prices.forEach((item) =>
            tiers.push({
              tier: `${item.id}`,
              cost: item.cost
            })
          )

          data.room_prices = tiers
        }

        const isCostEmpty = formik.values.room_prices.filter(
          (item) => item.cost === undefined || item.cost === ''
        )

        if (values.tiers_excluded === false && isCostEmpty.length) {
          formik.setFieldError('room_prices', 'Please enter cost')
        }

        if (values.tiers_excluded === true || isCostEmpty.length === 0) {
          dispatch(
            addRoomAction({
              id,
              data,
              callback: () => {
                handleModal()
                resetForm()
                setSearch('')
              }
            })
          )
        }
      }
    }
  })

  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        handleModal()
        setSearch('')
        setPermission(null)
        formik.resetForm()
      }}
    />
  )

  useEffect(() => {
    if (addRoom) {
      close()
    }
  }, [addRoom])

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleModal()
        setSearch('')
        setPermission(null)
        formik.resetForm()
      }}
      className="modal-dialog-centered"
      id="roomModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        close={CloseBtn}
        toggle={() => {
          handleModal()
          setSearch('')
          setPermission(null)
          formik.resetForm()
        }}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">Add New Room</h5>
      </ModalHeader>
      {/* <PerfectScrollbar options={{ wheelPropagation: false }}> */}
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className="px-2">
              <Col className="px-2">
                <FormGroupElement
                  inputType="text"
                  name="add-room-name"
                  label="Room Name"
                  labelClassName="pl-10px"
                  placeholder="Enter Room Name"
                  {...formik.getFieldProps('name')}
                  formikTouched={formik.touched.name}
                  formikError={formik.errors.name}
                  inputClassName="form-fields radius-25 skin-change"
                />
              </Col>

              <Col className="px-2">
                <FormGroupElement
                  inputType="text"
                  name="add-room-comment"
                  label="Comment"
                  labelClassName="pl-10px"
                  {...formik.getFieldProps('comment')}
                  formikTouched={formik.touched.comment}
                  formikError={formik.errors.comment}
                  inputClassName="form-fields radius-25 skin-change"
                />
              </Col>
            </div>

            <hr className="mt-3" />
            <div className="px-4">
              <div className="create-location--room_detail__operatingHours mb-2">
                <div className="create-location--room_detail__operatingHours--day">
                  <p className="sub-heading-2 whiteSpace fw-700">
                    Operating Hours
                  </p>
                </div>
                <div className="create-location--room_detail__operatingHours--time">
                  <div className="create-location--room_detail__operatingHours--open">
                    <p className="sub-heading-2 fw-700">OPEN</p>
                  </div>
                  <div className="create-location--room_detail__operatingHours--close">
                    <p className="sub-heading-2 fw-700">CLOSE</p>
                  </div>
                </div>
              </div>

              {formik.values.operating_hours.map((item, index) => (
                <div
                  className="create-location--room_detail__operatingHours"
                  key={index}
                >
                  <div className="create-location--room_detail__operatingHours--day">
                    <FormGroupElement
                      inputType="checkbox"
                      inputName={`${item.day_of_week}-add-room`}
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

                  <div className="create-location--room_detail__operatingHours--time">
                    <div className="create-location--room_detail__operatingHours--open">
                      <Flatpickr
                        data-enable-time
                        id="start_time"
                        name="start_time-add-room"
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

                    <div className="create-location--room_detail__operatingHours--close">
                      <Flatpickr
                        data-enable-time
                        id="close_time"
                        name="close_time-add-room"
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
            </div>
            <hr className="mt-3" />

            <div className="px-4 create-location--room_detail__closedDates">
              <p className="sub-heading-2 mt-2 fw-700 mb-1">Closed Dates</p>
              <FieldArray
                name="closed_dates"
                render={(arrayHelpers) => (
                  <>
                    {formik?.values?.closed_dates?.map((item, index) => (
                      <Col md="6" lg="3" key={index}>
                        <Flatpickr
                          data-enable-time
                          id="closed_dates"
                          name={`${index}-closed_dates`}
                          type="date"
                          className={classNames({
                            'radius-25 form-control mb-1 skin-change': true,
                            'time-date-row__dark': skin === 'dark'
                          })}
                          options={{
                            dateFormat: 'n/j/Y',
                            enableTime: false,
                            mode: 'single'
                          }}
                          value={dateUS(
                            formik.values?.closed_dates?.[index]?.date
                          )}
                          onChange={(date) => {
                            formik.setFieldValue(
                              `closed_dates[${index}].date`,
                              dateUnix(date)
                            )
                          }}
                        />
                      </Col>
                    ))}

                    <Button className="add-more" type="button">
                      <Icon icon="ic:baseline-plus" />
                      <span
                        className="px-1"
                        onClick={() =>
                          arrayHelpers.push({
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
            </div>

            <hr className="my-2" />
            <div className="px-4 create-location--room_detail__roomSelected--tierSettings">
              <span className="heading-5 fw-600">Tiers</span>
              <FormGroupElement
                inputType="checkbox"
                label="Exclude From Tiers"
                labelClassName="pl-10px"
                inputName="tiers_excluded-add"
                inputClassName="form-fields radius-25 skin-change"
                formGroupClassName="client_profile--checkbox mt-2 mb-2"
                value={formik.values.tiers_excluded}
                onChange={(e) => {
                  formik.setFieldValue('tiers_excluded', e.target.checked)
                }}
              />

              <Table bordered responsive>
                <thead className="bgThead">
                  <tr>
                    <th>Tier</th>
                    <th>From (hrs)</th>
                    <th>To (hrs)</th>
                    <th>Cost ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {formik.values.room_prices.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <span className="whiteSpace">{item.tier}</span>
                      </td>
                      <td>{item.start_hours}</td>
                      <td>{item.end_hours}</td>
                      <td>
                        <FormGroupElement
                          inputType="number"
                          name={`room_prices?.[${index}]?.cost`}
                          labelClassName="pl-10px"
                          placeholder="$ 0.00"
                          bsSize="sm"
                          inputClassName={classNames({
                            'form-fields radius-25 skin-change wd-90px': true,
                            'is-invalid': formik.errors.room_prices
                          })}
                          // defaultValue="0.00"
                          onChange={(e) =>
                            formik.setFieldValue(
                              `room_prices.[${index}].cost`,
                              e.target.value
                            )
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <hr className="my-2" />
            <div className="px-4 pt-1 create-location--room_detail__roomSelected--roomAuthorization">
              <span className="heading-5 fw-600">Room Authorization</span>

              <div className="pt-2 create-location--room_detail__roomSelected--roomAuthorization__radio">
                <FormGroupElement
                  inputType="radio"
                  inputName="authorizedUser-add"
                  label="Authorized Users"
                  labelClassName="pl-10px"
                  checked={permission === 1}
                  onChange={() => {
                    setSearch('')
                    setPermission(1)
                    formik.setFieldValue('room_authorization', [])
                  }}
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                  inputClassName="form-fields radius-25 skin-change"
                />

                <FormGroupElement
                  inputType="radio"
                  inputName="restrictedUser-add"
                  label="Restricted Users"
                  labelClassName="pl-10px"
                  checked={permission === 2}
                  onChange={() => {
                    setSearch('')
                    setPermission(2)
                    formik.setFieldValue('room_authorization', [])
                  }}
                  formGroupClassName="client_profile--checkbox client_profile--doubleCol__20"
                  inputClassName="form-fields radius-25 skin-change"
                />
              </div>
              {permission === 1 || permission === 2 ? (
                <>
                  <div className="create-location--room_detail__roomSelected--roomAuthorization__search">
                    <FormIconField
                      id="Search"
                      name="searchKeyword-add"
                      size={10}
                      iconsName="entypo:select-arrows"
                      className="input-group-merge"
                      inputClassName="input-control skin-change padding-y-search-md"
                      iconClassName="icon-control skin-change"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setOpenUsersList(true)
                      }}
                    />

                    {search && openUsersList && (
                      <ul>
                        {data.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSearch(`${item.first_name} ${item.last_name}`)
                              setProviderId(item.id)
                              setOpenUsersList(false)
                            }}
                          >
                            <span>+</span>
                            {`${item.first_name} ${item.last_name}`}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Button
                    name="add-user-room"
                    className="mt-1 pd-x-3 mb-3 wd-100Percent button-success"
                    onClick={() => {
                      const isExist = formik.values.room_authorization.map(
                        (item) => item?.user !== providerId
                      )

                      if (!isExist.includes(false) && providerId) {
                        formik.setFieldValue('room_authorization', [
                          ...formik.values.room_authorization,
                          {
                            user: providerId,
                            permission: `${permission}`
                          }
                        ])
                      }
                    }}
                  >
                    Add
                  </Button>
                </>
              ) : null}

              <div className="create-location--room_detail__roomSelected--roomAuthorization__authorizationList">
                {permission === 1 && (
                  <div className="authorizations">
                    <p className="bg-yellow px-2 py-1">Authorized Users</p>
                    <ul>
                      {formik.values.room_authorization.map((item, index) => {
                        const provider = providers.find(
                          (provider) => provider?.id === item?.user
                        )
                        return (
                          <Fragment key={index}>
                            {item?.permission === '1' && (
                              <li>{`${provider?.first_name} ${provider?.last_name}`}</li>
                            )}
                          </Fragment>
                        )
                      })}
                    </ul>
                  </div>
                )}
                {permission === 2 && (
                  <div className="authorizations">
                    <p className="bg-yellow px-2 py-1">Restricted Users</p>
                    <ul>
                      {formik.values.room_authorization.map((item, index) => {
                        const provider = providers.find(
                          (provider) => provider?.id === item?.user
                        )
                        return (
                          <Fragment key={index}>
                            {item?.permission === '2' && (
                              <li>{`${provider?.first_name} ${provider?.last_name}`}</li>
                            )}
                          </Fragment>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-2" />

            <div className="px-4 pb-3">
              <Button
                className="button-success wd-100Percent pd mb-1"
                type="submit"
                onClick={() => formik.handleSubmit()}
                disabled={loading}
              >
                <Icon icon={loading ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                <span className="px-1 whiteSpace">Save</span>
              </Button>
              <Button
                className="button-cancel wd-100Percent pd"
                onClick={() => {
                  handleModal()
                  setSearch('')
                  setPermission(null)
                  formik.resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </FormikProvider>
      </ModalBody>
      {/* </PerfectScrollbar> */}
    </Modal>
  )
}

export default AddNewRoomModal
