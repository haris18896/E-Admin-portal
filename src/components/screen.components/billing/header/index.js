/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react'

// ** Third Party Packages
import moment from 'moment'
import { Icon } from '@iconify/react'
import { Button } from 'reactstrap'
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes'

// ** Components
import SelectField from '@select'
import FormIconField from '@FormIconField'
import { BillingStatusObj } from '@status/BadgeColors'
import { ProviderType } from '@status/ProviderTypes'

// ** CSV Export
import { CSVLink } from 'react-csv'
import { licenseTypesList } from '../../../../views/providers/constants'

function BillingHeader(props) {
  const {
    rows,
    status,
    search,
    statusList,
    provider_type,
    onChangeHandler,
    onSearchChange,
    onChangeType,
    setSelectedValue,
    selectedValue
  } = props

  const today = new Date()

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Invoice Number', key: 'invoice_number' },
    { label: 'Provider', key: 'provider' },
    { label: 'Provider Type', key: 'provider_type' },
    { label: 'Status', key: 'status' },
    { label: 'Total', key: 'total' }
  ]

  const data = useMemo(() => {
    return rows.map((row, i) => {
      return {
        date:
          row.created_at !== undefined
            ? moment.unix(row?.created_at).format('MMMM, YYYY')
            : '--',
        invoice_number: `# ${row?.invoice_number || '--'}`,
        provider: `${row?.provider?.first_name || '--'} ${
          row?.provider?.last_name || '--'
        }`,
        provider_type: row?.provider?.provider_license.map(
          (license) => ProviderType[license?.license_type].text || '--'
        ),
        status: BillingStatusObj[row?.status]?.label || '--',
        total: `$ ${row?.total_amount || 0}`
      }
    })
  }, [rows])
  return (
    <div className="pt-3 p-2 bg-yellow">
      <div className="billing--header">
        <div className="billing--header__left">
          <SelectField
            header
            search={false}
            controlMinWidth="170px"
            className="billing--header__left--select-field"
            wd="100%"
            value={status}
            data={statusList}
            placeholder="Status"
            onChange={(e) => onChangeHandler('status', e)}
          />

          <section className={'p-l-7'}>
          <ReactMultiSelectCheckboxes
            hideSearch
            onChange={(e) => onChangeType(e)}
            className="multiValue-select"
            placeholderButtonLabel="Provider Type"
            options={licenseTypesList}
            setState={setSelectedValue}
            value={licenseTypesList?.filter((obj) =>
              selectedValue?.includes(obj.value)
            )}
          />
          </section>
        </div>

        <div className="billing--header__right">
          <FormIconField
            id="Search"
            name="search"
            size={10}
            iconsName="ant-design:search-outlined"
            onChange={(e) => onSearchChange(e)}
            className="input-group-merge billing--header__right__search"
            inputClassName="input-control skin-change"
            iconClassName="icon-control skin-change"
          />
          <CSVLink
            data={data}
            headers={headers}
            filename={`billing-list-${today}.csv`}
            className="text-decoration-none"
          >
            <Button size="sm " className="fs-x-small button-white pd-s">
              <Icon icon="dashicons:upload" width="15" height="15" />
              <span className="ml-5px">Export</span>
            </Button>
          </CSVLink>
        </div>
      </div>
    </div>
  )
}

export default BillingHeader
