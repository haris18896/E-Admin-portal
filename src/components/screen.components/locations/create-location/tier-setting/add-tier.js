/* eslint-disable no-unused-vars */
import React, { memo, useEffect, useState } from 'react'

// ** Third Party Components
import * as Yup from 'yup'
import { X } from 'react-feather'
import { Icon } from '@iconify/react'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Button,
  Spinner
} from 'reactstrap'

// ** Utils
import { isObjEmpty } from '@utils'

// **  Components
import FormGroupElement from '@FormGroupElement'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { addTierAction } from '@store/tiers/tiersAction'

function AddTierModal({ open, number, lastTier, handleOpen, pending, id }) {
  const dispatch = useDispatch()

  let num1 = number

  const [num, setNum] = useState(0)

  const schema = Yup.object().shape({
    tier_setting: Yup.array().of(
      Yup.object().shape({
        tier: Yup.string().required('Tier is required'),
        start_hours: Yup.number()
          .positive()
          .required('Start Hours is required'),
        end_hours: Yup.number()
          .positive()
          .min(
            Yup.ref('start_hours'),
            'End Hours must be greater than Start Hours'
          )
          .required('End Hours is required')
      })
    )
  })

  const formik = useFormik({
    initialValues: {
      tier_setting: [
        {
          tier: `Tier ${num + 1}`,
          start_hours: parseInt(lastTier?.end_hours) + 1 || 1,
          end_hours: ''
        }
      ]
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        dispatch(addTierAction({ id, data: values }))
        resetForm()
      }
    }
  })

  const CloseBtn = (
    <X
      className="pointer fw-600"
      size={15}
      onClick={() => {
        handleOpen()
        formik.resetForm()
      }}
    />
  )

  useEffect(() => {
    setNum(number)
    if (pending) {
      handleOpen()
    }
  }, [pending, number])

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        handleOpen()
        formik.resetForm()
      }}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        toggle={() => {
          handleOpen()
          formik.resetForm()
        }}
        close={CloseBtn}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">Add Tiers</h5>
      </ModalHeader>
      <PerfectScrollbar options={{ wheelPropagation: false }}>
        <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit} className="px-2 pb-2">
              <FieldArray
                name="tier_setting"
                render={(arrayHelpers) => (
                  <>
                    {formik.values.tier_setting.map((tier, index) => (
                      <div key={index}>
                        <p className="sub-heading-2 fw-700 mb-1">
                          {/* Tier {number + formik.values.tier_setting.length} */}
                          Tier {num + index + 1}
                        </p>
                        <FormGroupElement
                          required
                          type="text"
                          label="Tier"
                          placeholder="Tier"
                          labelClassName="pl-10px"
                          name={`tier_setting.${index}.tier`}
                          disabled
                          inputClassName="form-fields radius-25 skin-change"
                          defaultValue={`Tier ${
                            number + formik.values.tier_setting.length
                          }`}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `tier_setting.${index}.tier`,
                              e.target.value
                            )
                          }}
                          formikTouched={
                            formik.touched?.tier_setting?.[index]?.tier
                          }
                          formikError={
                            formik.errors?.tier_setting?.[index]?.tier
                          }
                        />
                        <FormGroupElement
                          required
                          type="number"
                          label="Start Hours"
                          labelClassName="pl-10px"
                          placeholder="Start Hours"
                          disabled
                          name={`tier_setting.${index}.start_hours`}
                          inputClassName="form-fields radius-25 skin-change"
                          value={formik.values.tier_setting[index].start_hours}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `tier_setting.${index}.start_hours`,
                              e.target.value
                            )
                          }}
                          formikTouched={
                            formik.touched?.tier_setting?.[index]?.start_hours
                          }
                          formikError={
                            formik.errors?.tier_setting?.[index]?.start_hours
                          }
                        />
                        <FormGroupElement
                          required
                          type="number"
                          label="End Hours"
                          placeholder="End Hours"
                          labelClassName="pl-10px"
                          name={`tier_setting.${index}.end_hours`}
                          inputClassName="form-fields radius-25 skin-change"
                          value={formik.values.tier_setting[index].end_hours}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `tier_setting.${index}.end_hours`,
                              e.target.value
                            )
                          }}
                          formikTouched={
                            formik.touched?.tier_setting?.[index]?.end_hours
                          }
                          formikError={
                            formik.errors?.tier_setting?.[index]?.end_hours
                          }
                        />

                        {formik.values.tier_setting.length > 1 && (
                          <Icon
                            icon="ic:baseline-delete"
                            className="pointer floatRight error"
                            width={20}
                            height={20}
                            onClick={() => arrayHelpers.remove(index)}
                          />
                        )}
                      </div>
                    ))}

                    <Button className="add-more mx-1" type="button">
                      <Icon icon="ic:baseline-plus" />
                      <span
                        className="px-1"
                        onClick={() => {
                          num1++
                          arrayHelpers.push({
                            tier: `Tier ${
                              number + formik.values.tier_setting.length + 1
                            }`,
                            start_hours:
                              parseInt(
                                formik?.values?.tier_setting[
                                  formik?.values?.tier_setting.length - 1
                                ]?.end_hours
                              ) + 1,
                            end_hours: ''
                          })
                        }}
                      >
                        Add More Tier
                      </span>
                    </Button>
                  </>
                )}
              />

              <div className="mt-1 d-flex align-items-center justify-content-end">
                <Button
                  className="button-cancel wd-100Percent pd mx-1"
                  onClick={() => {
                    handleOpen()
                    formik.resetForm()
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="button-success wd-100Percent pd mx-1"
                  type="submit"
                  onClick={() => formik.handleSubmit()}
                  disabled={pending}
                >
                  <Icon icon={pending ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
                  <span className="px-1 whiteSpace">Save</span>
                </Button>
              </div>
            </Form>
          </FormikProvider>
        </ModalBody>
      </PerfectScrollbar>
    </Modal>
  )
}

export default memo(AddTierModal)
