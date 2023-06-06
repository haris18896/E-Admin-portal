/* eslint-disable no-unused-vars */
import React, { useState, useEffect, Fragment } from 'react'

// ** Utils
import { isObjEmpty, dateUS, dateUnix, getModifiedValues } from '@utils'

// ** hooks
import { useSkin } from '@hooks/useSkin'

// ** Third Party Packages
import moment from 'moment'
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Spinner, Table } from 'reactstrap'
import { FieldArray, FormikProvider, useFormik } from 'formik'

// ** Components
import CustomSpinner from '@spinner'
import FormIconField from '@FormIconField'
import FormGroupElement from '@FormGroupElement'
import { roomDetailsSchema } from './constants'
import AddNewRoomModal from '../../add-new-room'
import { DayOfWeek, operatingHours } from '@status/DayOfWeek'
import AlertModal from '@customComponents/alert'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAllTiers } from '@store/tiers/tiersAction'
import { getAllProviders } from '@store/provider/providerAction'
import {
  getAllRoomsAction,
  getRoomAction,
  deleteRoomAction,
  updateRoomAction
} from '@store/rooms/roomsAction'
import {
  resetAllRooms,
  resetGetRoom
} from '../../../../../redux/rooms/roomsSlice'
import { resetProvidersList } from '../../../../../redux/provider/providerSlice'

function RoomDetails({ id, cancel }) {
  const dispatch = useDispatch()

  const { getAllTiersData } = useSelector((state) => state.tiers)
  const { getAllProvidersData } = useSelector((state) => state.provider)
  const {
    loading,
    getAllRooms,
    getRoomPending,
    getRoom,
    deletePending,
    updateRoomPending
  } = useSelector((state) => state.rooms)

  const rooms = getAllRooms?.roomsList
  const tiersList = getAllTiersData.tiersList
  const providers = getAllProvidersData.providersList
  const skin = useSkin()
  const today = new Date()
  const navigate = useNavigate()

  const [permission, setPermission] = useState(1) // authorized: 1, unauthorized: 2
  const [providerId, setProviderId] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [alertModalOpen, setAlertModalOpen] = useState(false)

  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  const handleModal = () => setOpenModal(!openModal)
  const closeModal = () => setOpenModal(false)
  const handleCloseAlertModal = () => setAlertModalOpen(false)
  const handleOpenAlertModal = () => {
    setAlertModalOpen(true)
  }
  useEffect(() => {
    dispatch(getAllRoomsAction({ id }))
  }, [id])

  useEffect(() => {
    dispatch(getAllTiers(id))
    dispatch(getAllProviders({ offset: 0, limit: 999 }))
  }, [])

  useEffect(() => {
    return () => {
      dispatch(resetProvidersList())
    }
  }, [])

  const handleGetRoom = (room_id) => {
    dispatch(
      getRoomAction({
        id,
        room_id,
        callback: (res) =>
          setPermission(
            (res?.data?.room_authorization &&
              res?.data?.room_authorization[0]?.permission) ||
              1
          )
      })
    )
  }

  const data = providers.filter(({ first_name, last_name }) => {
    const name = `${first_name} ${last_name}`
    return name.toLowerCase().includes(search.toString().toLowerCase())
  })

  const formik = useFormik({
    initialValues: {
      name: getRoom?.name || '',
      tiers_excluded: getRoom?.tiers_excluded || false,
      comment: getRoom?.comment || '',
      operating_hours: getRoom?.operating_hours || operatingHours,
      closed_dates: getRoom?.closed_date || [],
      room_prices: getRoom?.room_prices || [],
      room_authorization: getRoom?.room_authorization || []
    },
    validationSchema: roomDetailsSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          comment: values.comment,
          tiers_excluded: values.tiers_excluded,
          operating_hours: values.operating_hours,
          closed_dates: values.closed_dates
          // room_authorization: values.room_authorization
          // room_authorization: values.room_authorization.filter(
          //   (auth) => auth.permission === permission
          // )
        }

        if (!formik.values.tiers_excluded) {
          const tiers = []
          formik.values.room_prices.forEach((item, index) => {
            tiers.push({
              tier: tiersList[index]?.id,
              cost: item.cost
            })
          })

          data.room_prices = tiers
        }

        const modifiedValues = getModifiedValues(data, formik?.initialValues)
        modifiedValues.room_authorization = values.room_authorization

        dispatch(
          updateRoomAction({
            id,
            room_id: getRoom?.id,
            data: modifiedValues,
            callback: () => {
              setPermission(permission)
            }
          })
        )
      }
    }
  })

  useEffect(() => {
    return () => {
      dispatch(resetGetRoom())
      dispatch(resetAllRooms())
    }
  }, [])

  return (
    <>
      <AlertModal
        loading={deletePending}
        open={alertModalOpen}
        handleOpen={handleOpenAlertModal}
        handleClose={handleCloseAlertModal}
        handleAction={() => {
          dispatch(
            deleteRoomAction({
              id,
              room_id: getRoom?.id,
              callback: () => {
                formik.resetForm()
                handleCloseAlertModal()
                setPermission()
              }
            })
          )
        }}
        title="Delete Room"
        message="Are you sure you want to delete this room ?"
      />
      <AddNewRoomModal
        open={openModal}
        close={closeModal}
        handleModal={handleModal}
        id={id}
      />
      <Card className="create-location--room_detail">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className="create-location--room_detail__top">
              <div className="pt-1 create-location--room_detail__top--left">
                {getRoomPending ? (
                  <CustomSpinner style={{ width: '100%' }} />
                ) : (
                  <>
                    <div className="pt-1 create-location--room_detail__input">
                      <Col className="px-2">
                        <FormGroupElement
                          inputType="text"
                          name="name"
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
                          name="comment"
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
                    <div className="px-2">
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
                              inputName={`${item.day_of_week}`}
                              label={DayOfWeek[item.day_of_week].text}
                              labelClassName="pl-10px"
                              formGroupClassName="client_profile--checkbox"
                              inputClassName="skin-change"
                              checked={
                                formik.values?.operating_hours?.[index]
                                  ?.is_useable
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
                                  formik.values?.operating_hours[index]
                                    ?.start_time
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
                                  formik.values?.operating_hours[index]
                                    ?.close_time
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

                    <div className="px-2 create-location--room_detail__closedDates">
                      <p className="sub-heading-2 mt-2 fw-700 mb-1">
                        Closed Dates
                      </p>
                      <FieldArray
                        name="closed_dates"
                        render={(arrayHelpers) => (
                          <>
                            {formik?.values?.closed_dates?.map(
                              (item, index) => (
                                <Col md="6" lg="3" key={index}>
                                  <Flatpickr
                                    data-enable-time
                                    id="closed_dates"
                                    name="closed_dates"
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
                              )
                            )}

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
                  </>
                )}
              </div>

              <div className="px-2 create-location--room_detail__top--right">
                <div className="create-location--room_detail__top--right--data">
                  <p className="heading-3">Room List</p>
                  <hr className="m-0" />
                  {loading ? (
                    <CustomSpinner />
                  ) : (
                    <div className="create-location--room_detail__top--right--list">
                      {rooms.map((item, index) => (
                        <div
                          className="create-location--room_detail__top--right--list__obj"
                          onClick={() => handleGetRoom(item?.id)}
                          key={index}
                        >
                          <div
                            className={classNames({
                              'create-location--room_detail__top--right--list__obj--tag': true,
                              'create-location--room_detail__top--right--list__obj--tag__selected':
                                getRoom?.id === item?.id
                            })}
                          />
                          <span>{item?.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="create-location--room_detail__top--right--data__button">
                    <Button className="button-green pd" onClick={handleModal}>
                      Add More Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Selected */}
            {getRoom && !getRoomPending && (
              <div className="create-location--room_detail__roomSelected">
                <hr className="mt-3" />
                <div className="px-2 pt-1 create-location--room_detail__roomSelected--tierSettings">
                  <span className="heading-5 fw-600">Tiers</span>
                  <FormGroupElement
                    inputType="checkbox"
                    label="Exclude From Tiers"
                    labelClassName="pl-10px"
                    inputName="tiers_excluded"
                    inputClassName="form-fields radius-25 skin-change"
                    formGroupClassName="client_profile--checkbox mt-2 mb-2"
                    value={formik.values.tiers_excluded}
                    checked={formik.values.tiers_excluded === true}
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
                      {tiersList.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <span className="whiteSpace">{item.tier}</span>
                          </td>
                          <td>{item.start_hours}</td>
                          <td>{item.end_hours}</td>
                          <td>
                            <FormGroupElement
                              inputType="number"
                              name={`room_prices[${index}].id`}
                              labelClassName="pl-10px"
                              placeholder="$ 0.00"
                              bsSize="sm"
                              inputClassName="form-fields radius-25 skin-change wd-90px"
                              value={formik.values.room_prices[index]?.cost}
                              onChange={(e) => {
                                formik.setFieldValue(
                                  `room_prices[${index}].cost`,
                                  e.target.value
                                )
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <hr className="mt-3" />
                <div className="px-2 pt-1 create-location--room_detail__roomSelected--roomAuthorization">
                  <span className="heading-5 fw-600">Room Authorization</span>
                  <div className="pt-2 create-location--room_detail__roomSelected--roomAuthorization__radio">
                    <FormGroupElement
                      inputType="radio"
                      inputName="authorizedUser"
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
                      inputName="restrictedUser"
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

                  <div className="create-location--room_detail__roomSelected--roomAuthorization__search">
                    <FormIconField
                      id="Search"
                      name="searchKeyword"
                      size={10}
                      iconsName="entypo:select-arrows"
                      className="input-group-merge"
                      inputClassName="input-control skin-change padding-y-search-md"
                      iconClassName="icon-control skin-change"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setOpen(true)
                      }}
                    />

                    {search && open && (
                      <ul>
                        {data.map((item, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              setSearch(`${item.first_name} ${item.last_name}`)
                              setProviderId(item.id)
                              setOpen(false)
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
                    name="add user"
                    className="mt-1 pd-x-3 mb-3 wd-100Percent button-success"
                    onClick={() => {
                      const isExist = formik.values.room_authorization.map(
                        (item) => item?.user !== providerId
                      )

                      if (
                        formik.values.room_authorization.length === 0 &&
                        providerId
                      ) {
                        formik.setFieldValue('room_authorization', [
                          {
                            user: providerId,
                            permission
                          }
                        ])
                      } else if (
                        !isExist.includes(false) &&
                        providerId &&
                        formik.values.room_authorization.length !== 0
                      ) {
                        formik.setFieldValue('room_authorization', [
                          ...formik.values.room_authorization,
                          {
                            user: providerId,
                            permission
                          }
                        ])
                      }
                      setSearch('')
                    }}
                  >
                    Add
                  </Button>

                  <div className="create-location--room_detail__roomSelected--roomAuthorization__authorizationList">
                    {permission === 1 && (
                      <div className="authorizations">
                        <p className="bg-yellow px-2 py-1">Authorized Users</p>
                        <ul className="px-2">
                          {formik.values?.room_authorization.map(
                            (item, index) => {
                              const provider = providers.find(
                                (provider) => provider?.id === item?.user
                              )

                              return (
                                <Fragment key={index}>
                                  {item?.permission === 1 && (
                                    <li className="d-flex justify-content-between">
                                      {`${provider?.first_name} ${provider?.last_name}`}
                                      <Icon
                                        onClick={() =>
                                          formik.setFieldValue(
                                            'room_authorization',
                                            formik.values.room_authorization.filter(
                                              (item) =>
                                                item.user !== provider.id
                                            )
                                          )
                                        }
                                        style={{
                                          color: '#ea5455',
                                          cursor: 'pointer'
                                        }}
                                        icon="bi:trash-fill"
                                      />
                                    </li>
                                  )}
                                </Fragment>
                              )
                            }
                          )}
                          {formik.values?.room_authorization.length > 0 ? (
                            <li className="text-end">
                              <Button
                                onClick={() =>
                                  formik.setFieldValue('room_authorization', [])
                                }
                                color="danger"
                                className="pd delete-pd"
                              >
                                <span className="px-1 whiteSpace">
                                  Clear All
                                </span>
                              </Button>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    )}

                    {permission === 2 && (
                      <div className="authorizations">
                        <p className="bg-yellow px-2 py-1">Restricted Users</p>
                        <ul className="px-2">
                          {formik.values?.room_authorization.map(
                            (item, index) => {
                              const provider = providers.find(
                                (provider) => provider?.id === item?.user
                              )

                              return (
                                <Fragment key={index}>
                                  {item?.permission === 2 && (
                                    <li className="d-flex justify-content-between">
                                      {`${provider?.first_name} ${provider?.last_name}`}
                                      <Icon
                                        onClick={() =>
                                          formik.setFieldValue(
                                            'room_authorization',
                                            formik.values.room_authorization.filter(
                                              (item) =>
                                                item.user !== provider.id
                                            )
                                          )
                                        }
                                        style={{
                                          color: '#ea5455',
                                          cursor: 'pointer'
                                        }}
                                        icon="bi:trash-fill"
                                      />
                                    </li>
                                  )}
                                </Fragment>
                              )
                            }
                          )}
                          {formik.values?.room_authorization.length > 0 ? (
                            <li className="text-end">
                              <Button
                                onClick={() =>
                                  formik.setFieldValue('room_authorization', [])
                                }
                                color="danger"
                                className="pd delete-pd"
                              >
                                <span className="px-1 whiteSpace">
                                  Clear All
                                </span>
                              </Button>
                            </li>
                          ) : null}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <hr className="mt-3" />
                <div className="px-2 pt-1 create-location--room_detail__roomSelected__actions">
                  <div>
                    <Button
                      color="danger"
                      className="pd delete-pd"
                      onClick={() => handleOpenAlertModal()}
                    >
                      {deletePending ? (
                        <Spinner size="sm" />
                      ) : (
                        <Icon icon="bi:trash-fill" />
                      )}
                      <span className="px-1 whiteSpace">Delete Room</span>
                    </Button>
                  </div>

                  <div className="create-location--room_detail__roomSelected__actions--save">
                    <Button
                      className="button-cancel pd"
                      onClick={() => formik.resetForm()}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="button-success pd"
                      type="submit"
                      onClick={() => formik.handleSubmit()}
                      disabled={updateRoomPending}
                    >
                      <Icon icon={updateRoomPending ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                      <span className="px-1 whiteSpace">Save Changes</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </FormikProvider>
      </Card>
    </>
  )
}

export default RoomDetails
