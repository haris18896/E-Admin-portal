/* eslint-disable no-unused-vars */
import React, { useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'

// ** third party packages
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import { Button, Card, CardBody, Input, Spinner } from 'reactstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import { useNavigate } from 'react-router-dom'
// ** Custom Components
import { columns } from './table.data'
import SpinnerComponent from '@spinner'

// ** Submission
import * as Yup from 'yup'
import { isObjEmpty } from '@utils'
import { useFormik } from 'formik'

// ** Store and Actions
import { useDispatch, useSelector } from 'react-redux'
import { getAllTiers, updateTierAction } from '@store/tiers/tiersAction'

createTheme(
  'solarized',
  {
    text: {
      primary: '#',
      secondary: '#2aa198'
    },
    background: {
      default: 'transparent'
    },
    context: {
      background: '#e3f2fd',
      text: '#000'
    },
    divider: {
      default: 'rgba(216, 214, 222, 0.1)'
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(0,0,0,.08)',
      disabled: 'rgba(0,0,0,.12)'
    }
  },
  'dark'
)

const customStyles = {
  cells: {
    style: {
      '&:first-child': {
        borderRight: 'transparent !important'
      }
    }
  },
  headCells: {
    style: {
      '&:first-child': {
        borderRight: 'transparent !important'
      }
    }
  }
}

function LocationTierSettings({ id, rows, cancel }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addPending, loading, deleteTier, updatePending } = useSelector(
    (state) => state.tiers
  )

  // ** Get Tiers List
  useEffect(() => {
    if (id) {
      dispatch(getAllTiers(id))
    }
  }, [id])

  const schema = Yup.object().shape({
    tier_setting: Yup.array().of(
      Yup.object().shape({
        tier: Yup.string()
          .max(20, 'Tier name should not increase more than 20 characters')
          .required('Tier is required'),
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

  const initialValues = () => {
    return rows.map((tier) => ({
      id: tier.id,
      location: id,
      tier: tier.tier,
      end_hours: tier.end_hours,
      start_hours: tier.start_hours
    }))
  }

  const formik = useFormik({
    initialValues: {
      tier_setting: initialValues()
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, resetForm }) => {
      if (isObjEmpty(formik.errors)) {
        const data = { ...values }

        dispatch(updateTierAction({ id, data }))
      }
    }
  })

  return (
    <Card className="mt-3 create-location--location_tier">
      <form className="react-dataTable">
        {loading ? (
          <SpinnerComponent />
        ) : (
          <DataTable
            data={rows}
            pointerOnHover
            highlightOnHover
            theme="solarized"
            columns={columns({ formik })}
            className="react-dataTable "
            customStyles={customStyles}
            sortIcon={<ChevronDown size={10} />}
          />
        )}
      </form>

      <CardBody className="px-2">
        <div className="create-location--location_tier__buttons">
          <Button className="button-cancel pd" onClick={() => formik.resetForm()}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="button-success pd"
            onClick={() => formik.handleSubmit()}
            disabled={addPending || deleteTier || updatePending}
          >
            <Icon icon={(addPending || deleteTier || updatePending) ? 'eos-icons:loading' : "material-symbols:check-small-rounded" } color="#fefefe" width="16" height="16" />
            <span className="px-1">Save</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  )
}

export default LocationTierSettings

LocationTierSettings.propTypes = {
  id: PropTypes.string,
  rows: PropTypes.array,

  cancel: PropTypes.func
}
