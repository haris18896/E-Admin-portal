/* eslint-disable quote-props */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from 'react'

// ** Third Party Packages
import { Button } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'

// ** Components
import SelectField from '@select'
import FormGroupElement from '@FormGroupElement'
import { ProviderType } from '@status/ProviderTypes'
import { ProviderStatusObj } from '@status/BadgeColors'

// ** CSV Export
import { CSVLink } from 'react-csv'

// ** Store & Actions
import { useSelector } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'

function ProvidersHeader({
  status,
  statusList,
  handleReset,
  provider_type,
  onChangeType,
  onChangeHandler,
  licenseTypesList,
  onSearchChange,
  selectedValue,
  setSelectedValue
}) {
  const navigate = useNavigate()
  const today = new Date()
  const [isOpen, setIsOpen] = useState(true)

  const { loading, getAllProvidersData } = useSelector(
    (state) => state.provider
  )
  const toggleOpen = (isOpen) => {
    setIsOpen(isOpen)
  }

  const rows = getAllProvidersData?.providersList

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Practice', key: 'practice' },
    { label: 'Date of birth', key: 'date_of_birth' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone_number' },
    { label: 'Provider Type', key: 'provider_type' },
    { label: 'License number', key: 'license_number' },
    { label: 'License Expiration', key: 'expire_date' },
    { label: 'License State', key: 'state' },
    { label: 'NPI Type 1', key: 'npi' },
    { label: 'NPI Type 2', key: 'npi_two' },
    { label: 'Tax ID for NPI Type 1', key: 'tax' },
    { label: 'Tax ID for NPI Type 2', key: 'tax_two' },
    { label: 'Taxonomy Code', key: 'taxonomy' },
    { label: 'CAQH', key: 'caqh' },
    { label: 'Booking Per Month', key: 'booking_per_month' },
    { label: 'Booking Last 30 Days', key: 'booking_last_30_days' },
    { label: 'Total Bookings', key: 'total_bookings' },
    { label: 'Cancellations Per Month', key: 'cancellations_per_month' }
  ]

  const data = useMemo(() => {
    return rows.map((row, i) => {
      return {
        name: `${row.first_name} ${row.last_name}`,
        practice: row.practice || '--',
        date_of_birth:
          row?.date_of_birth !== undefined
            ? moment.unix(row.date_of_birth).format('MM/DD/YYYY')
            : '--',
        email: row.email || '--',
        phone_number: row.phone_number || '--',
        provider_type: row?.provider_license.map(
          (license) => ProviderType[license?.license_type].text || '--'
        ),
        license_number: row?.provider_license.map(
          (license) => license.license_number || '--'
        ),
        state: row?.provider_license.map((license) => license.state || '--'),
        expire_date: row?.provider_license.map(
          (license) =>
            moment.unix(license.expire_date).format('MM/DD/YYYY') || '--'
        ),
        status: ProviderStatusObj[row?.status]?.label || '--',
        npi: row.npi || '--',
        npi_two: row.npi_two || '--',
        tax: row.tax || '--',
        tax_two: row.tax_two || '--',
        taxonomy: row.taxonomy || '--',
        caqh: row.caqh || '--',
        booking_per_month: row.avg_booking_per_month || '--',
        booking_last_30_days: row?.total_bookings_to_thirty_days || '--',
        total_bookings: row?.total_bookings || '--',
        cancellations_per_month: row?.avg_cancelled_per_month || '--'
      }
    })
  }, [rows])

  return (
    <div className="pt-3 p-2 bg-yellow provider--header">
      <div className="provider--header__dropdown">
        <div className="provider--header__dropdown--selectors ">
          <ReactMultiSelectCheckboxes
            hideSearch
            onChange={(e) => onChangeType(e)}
            className="multiValue-select "
            placeholderButtonLabel="Provider Type"
            options={licenseTypesList}
            setState={setSelectedValue}
            onPress={() => {}}
            isOpen={() => {}}
            onClose={() => {}}
            value={licenseTypesList?.filter((obj) =>
              selectedValue?.includes(obj.value)
            )}
          />
        </div>

        <div className="provider--header__dropdown--selectors">
          <SelectField
            header
            wd="100%"
            search={false}
            containerZIndex="400"
            controlMinWidth="150px"
            placeholder="Status"
            data={statusList}
            value={status}
            onChange={(e) => onChangeHandler('status', e)}
          />
        </div>

        <div className="provider--header__dropdown--selectors">
          <Button
            className="button-reset pd-s"
            onClick={() => {
              handleReset()
            }}
          >
            <Icon icon="fa6-solid:arrows-rotate" width="20" height="20" />
            <span className="pl-1">Reset</span>
          </Button>
        </div>
      </div>

      <div className="provider--header__search">
        <div>
          <FormGroupElement
            bsSize="sm"
            placeholder="Search..."
            inputType="text"
            id="search"
            inputName="search"
            formGroupClassName="provider--header__search__input"
            onChange={onSearchChange}
            inputClassName="radius-25 skin-change"
          />
        </div>

        <div>
          <Button
            className="button-green pd-s"
            onClick={() => navigate('/providers/add-provider')}
          >
            Add Provider
          </Button>
        </div>
        <div>
          <CSVLink
            data={data}
            headers={headers}
            filename={`providers-list-${today}.csv`}
            className="text-decoration-none"
          >
            <Button className="button-white pd-s">
              <Icon icon="fe:export" width="20" height="20" />
              <span className="px-1">Export</span>
            </Button>
          </CSVLink>
        </div>
      </div>
    </div>
  )
}

export default ProvidersHeader
