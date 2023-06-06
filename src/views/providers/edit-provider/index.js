/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { getModifiedValues } from '@utils'

// ** third party packages
import { Card } from 'reactstrap'
import toast from 'react-hot-toast'
import { X } from 'react-feather'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
// ** components
import { ToastContent } from '@src/components/toast'
import ProviderForm from '../provider-form/ProviderForm'
import AddProviderHeader from '@ScreenComponent/providers.screen/headers/add-provider-header'

// actions
import {
  getProviderAction,
  updateProviderAction
} from '@store/provider/providerAction'
import { useDispatch, useSelector } from 'react-redux'
import { getPromoCreditAction } from '../../../redux/provider/providerAction'
import { resetGetProvider } from '../../../redux/provider/providerSlice'

function EditProvider() {
  const idx = useParams()

  const [imageChanged, setImageChanged] = React.useState(false)
  const [active, setActive] = React.useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { getProvider, loading, loadingImage, error } = useSelector(
    (state) => state.provider
  )

 //** Split the Dashes */
  const dateString = moment
    .unix(getProvider?.date_of_birth)
    .format('MM/DD/YYYY')
  const splitDashes = dateString.split('/')
  const month = splitDashes[0]
  const day = splitDashes[1]
  const year = splitDashes[2]


  useEffect(() => {
    dispatch(getProviderAction(idx.id))
    // dispatch(getPromoCreditAction(idx.id))
  }, [])

  const avatar = getProvider?.avatar

  const initialValues = () => {
    return {
      first_name: getProvider?.first_name || '',
      last_name: getProvider?.last_name || '',
      middle_name: getProvider?.middle_name || '',
      suffix: getProvider?.suffix || '',
      date_of_birth: getProvider?.date_of_birth || null,
      day: getProvider?.date_of_birth === null ? '' : day,
      month: getProvider?.date_of_birth === null ? '' : month,
      year: getProvider?.date_of_birth === null ? '' : year,
      practice: getProvider?.practice || '',
      email: getProvider?.email || '',
      phone_number: getProvider?.phone_number || '',
      provider_license: getProvider?.provider_license || [],
      npi: getProvider?.npi || '',
      npi_two: getProvider?.npi_two || '',
      tax: getProvider?.npi || '',
      tax_two: getProvider?.npi_two || '',
      taxonomy: getProvider?.taxonomy || '',
      caqh: getProvider?.caqh || '',
      avatar: getProvider?.avatar || '',
      status: getProvider?.status || ''
    }
  }
  const initials = initialValues()
  
  //** Clean Null Key Pair In Object */
  function clean(obj) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName]
      }
    }
    return obj
  }

  const handleSubmit = ({ values, image }) => {
    let imageData = null
    if (image) {
      imageData = new FormData()
      imageData.append('image', image)
    }

    const modifiedValues = getModifiedValues(values, initials)

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
      if (active === 3) {
        const InActiveData = {
          status: 3
        }
        dispatch(
          updateProviderAction({
            id: idx.id,
            data: InActiveData,
            navigate,
            setActive
          })
        )
      }
      if (active === 2) {
        const ActiveData = {
          status: 2
        }
        dispatch(
          updateProviderAction({
            id: idx.id,
            data: ActiveData,
            navigate,
            setActive
          })
        )
      }
      if (active === 0) {
        const dateString = new Date(
          `${values.month}/${values.day}/${values.year}`
        )
        const ts = moment(dateString).unix()
        const modifiedData = {
          ...modifiedValues,
          date_of_birth: ts || null
        }
        const FilterProviderData = clean(modifiedData)
        dispatch(
          updateProviderAction({
            id: idx.id,
            data: FilterProviderData,
            img: imageData,
            imageChanged,
            navigate,
            setActive
          })
        )
      }
    }
  }

  useEffect(() => {
    return () => {
      dispatch(resetGetProvider())
    }
  }, [])

  return (
    <>
      <AddProviderHeader
        editProvider={true}
        name={`${initials?.first_name} ${initials?.last_name}`}
        created_at={getProvider?.created_at}
        loading
      />

      <Card className="provider--addProvider">
        <ProviderForm
          initials={initials}
          avatar={avatar}
          edit={idx.id}
          loadingImage={loadingImage}
          loading={loading}
          error={error}
          submit={handleSubmit}
          imageUrl={getProvider?.avatar}
          setActive={setActive}
          active={active}
        />
      </Card>
    </>
  )
}

export default EditProvider
