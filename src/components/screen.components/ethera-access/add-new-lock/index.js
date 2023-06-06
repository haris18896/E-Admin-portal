/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'

// third party packages
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { isObjEmpty } from '@utils'
import { Icon } from '@iconify/react'
import { Button, CardBody, Col, Form, Row, Spinner } from 'reactstrap'

// components
import FormGroupElement from '@FormGroupElement'

// Store
import { useDispatch, useSelector } from 'react-redux'
import { createLockAction, testLockAction } from '@store/access/accessAction'

function EtheraAccessAddNewLock({setLocation, location}) {
  const { testLoading, createLoading } = useSelector((state) => state.access)
  const [testLock, setTestLock] = useState('')

  const dispatch = useDispatch()
  const etheraAccessSchema = Yup.object().shape({
    name: Yup.string()
      .required('Lock name is required')
      .min(3, 'Lock name should be at least 3 characters')
      .max(10, 'Lock name should be at most 10 characters'),
    token: Yup.string().required('Lock token is required')
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      token: ''
    },
    validationSchema: etheraAccessSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = {
          name: values.name,
          token: values.token
        }
        const id = useJwt.getData('location')
        dispatch(
          createLockAction({
            id,
            data,
            callBack: () => {
              resetForm()
              useJwt.removeData('location')
              setLocation(null)
            }
          })
        )
      }
    }
  })

  useEffect(() => {
    return () => {
      useJwt.removeData('location')
    }
  }, [])

  return (
    <div className="mt-1">
      <div className="tags">
        <Icon icon="bxs:lock" width="20" height="20" />
        <span>Add New Lock</span>
      </div>

      <CardBody>
        <Form name="locks-form" onSubmit={formik.handleSubmit}>
          <Row className="ethera-access--addNewLock">
            <Col sm={12} md={3}>
              <FormGroupElement
                min={3}
                max={10}
                label="Name"
                inputType="text"
                inputName="name"
                labelClassName="pl-10px"
                placeholder="Enter Lock Name"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('name')}
                formikTouchedClass={formik.touched.name}
                formikErrorClass={formik.errors.name}
              />
            </Col>
            <Col sm={12} md={5}>
              <FormGroupElement
                inputType="text"
                inputName="token"
                label="Cloud Token"
                labelClassName="pl-10px"
                placeholder="Enter Lock Token"
                formGroupClassName="mb-1"
                inputClassName="form-fields radius-25 skin-change"
                {...formik.getFieldProps('token')}
                formikTouchedClass={formik.touched.token}
                formikErrorClass={formik.errors.token}
              />
            </Col>
            <Col sm={12} md={4}>
              <div className="ethera-access--addNewLock__save">
                <Button
                  className="btn-gold whiteSpace pd me-1"
                  type="button"
                  disabled={
                    !formik.values.token ||
                    (testLoading && testLock === 'mainLock')
                  }
                  onClick={() => {
                    setTestLock('mainLock')
                    dispatch(
                      testLockAction({
                        token: formik.values?.token,
                        callBack: () => setTestLock(null)
                      })
                    )
                  }}
                >
                  {testLoading && testLock === 'mainLock' && (
                    <Spinner className="spinner-size" />
                  )}{' '}
                  Test Lock
                </Button>
                <Button
                  type="submit"
                  disabled={testLoading || createLoading}
                  onClick={formik.handleSubmit}
                  className="btn-green whiteSpace pd"
                >
                  {createLoading && <Spinner className="spinner-size" />} Add
                  Lock
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>

      <hr />
    </div>
  )
}

export default EtheraAccessAddNewLock
