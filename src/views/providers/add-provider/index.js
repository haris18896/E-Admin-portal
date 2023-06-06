/* eslint-disable no-unused-vars */
import React, { useState } from 'react'

// ** Third Party Components
import { Card } from 'reactstrap'
import toast from 'react-hot-toast'
import { X } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
// * Components
import { ToastContent } from '@src/components/toast'
import ProviderForm from '../provider-form/ProviderForm'
import AddProviderHeader from '@ScreenComponent/providers.screen/headers/add-provider-header'

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { registerProvider } from '@store/provider/providerAction'

function AddProvider() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initialValues = {
    first_name: '',
    last_name: '',
    middle_name: '',
    suffix: '',
    date_of_birth: '',
    day: '',
    month: '',
    year: '',
    practice: '',
    email: '',
    phone_number: '',
    provider_license: [
      {
        license_type: 1,
        license_number: '',
        expire_date: '',
        state: ''
      }
    ],
    npi: '',
    npi_two: '',
    tax: '',
    tax_two: '',
    taxonomy: '',
    caqh: ''
  }

  function cleanNullKeyPair(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName]
      }
    }
    return obj
  }

  const handleSubmit = ({ values, image }) => {
    const WithOutDOB = {}
    // provider_license shouldn't include empty values

    const notEmptyLicense = values.provider_license.filter(
      (license) =>
        license.license_type === '' ||
        license.license_number === '' ||
        license.expire_date === '' ||
        license.state === ''
    )

    if (notEmptyLicense.length > 0) {
      toast((t) => (
        <ToastContent
          t={t}
          name="Add Provider"
          icon={<X size={14} />}
          color="danger"
          msg="Please fill all license fields"
        />
      ))
    } else {
      const dateString = new Date(
        `${values.month}/${values.day}/${values.year}`
      )
      const ts = moment(dateString).unix()
      const UpdatedData = {
        ...values,
        date_of_birth: ts || null
      }
      const FilterProviderData = cleanNullKeyPair(UpdatedData)

      dispatch(
        registerProvider({ data: FilterProviderData, img: image, navigate })
      )
    }
  }

  return (
    <>
      <AddProviderHeader />

      <Card className="provider--addProvider">
        <ProviderForm
          initials={initialValues}
          edit={false}
          submit={handleSubmit}
        />
      </Card>
    </>
  )
}

export default AddProvider
