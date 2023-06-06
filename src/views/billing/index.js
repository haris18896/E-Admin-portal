/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react'

// ** Third Party Packages
import Spinner from '@spinner'
import { Card } from 'reactstrap'
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import DataTable, { createTheme } from 'react-data-table-component'
import debounce from 'lodash/debounce'

// ** Components
import { columns } from './table.data'
import { statusList } from './constants'
import CustomPagination from '@pagination/ReactPaginate'
import BillingHeader from '@ScreenComponent/billing/header'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import { resetBillings } from '@store/billing/billingSlice'
import {
  getAllBillingAction,
  handlePageChange,
  handleLimitChange
} from '@store/billing/billingAction'

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

function Billing() {
  const dispatch = useDispatch()
  const { loading, getAllBillings } = useSelector((state) => state.billing)

  const rows = getAllBillings?.billingsList
  const offset = getAllBillings?.offset
  const limit = getAllBillings?.limit
  const count = getAllBillings?.total

  // ** States
  const [currentPage, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(null)
  const [selectedValue, setSelectedValue] = useState([])
  const [provider_type, setProviderType] = useState()
  const providerTypeValue = JSON.stringify(selectedValue)

  // ** Getting Billings
  useEffect(() => {
    dispatch(
      getAllBillingAction({
        offset:
          search ||
          status ||
          (providerTypeValue !== '[]' && providerTypeValue !== undefined)
            ? 0
            : offset,
        limit,
        status: status?.value,
        provider_type: JSON.stringify(selectedValue),
        search
      })
    )
  }, [status, selectedValue])

  // ** Function to handle filters
  const onChangeHandler = (name, value) => {
    if (name === 'status') setStatus(value)
    setPage(0)
  }
  const onChangeType = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : [])
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
    dispatch(
      getAllBillingAction({
        offset:
          search ||
          status ||
          (providerTypeValue !== '[]' && providerTypeValue !== undefined)
            ? 0
            : offset,
        limit,
        status: status?.value,
        provider_type: JSON.stringify(selectedValue),
        search: e.target.value
      })
    )
    setPage(0)
  }
  const onChange = useCallback(
    debounce((value) => handleSearch(value), 600),
    [handleSearch]
  )

  // ** Changing limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        status: status?.value,
        provider_type: JSON.stringify(selectedValue),
        search
      })
    )
  }

  // ** Changing Page
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({
        offset: newOffset === 0 ? 0 : newOffset + 1,
        limit,
        status: status?.value,
        provider_type: JSON.stringify(selectedValue),
        search
      })
    )
    setPage(() => page.selected)
  }

  // ** Reset Billings
  useEffect(() => {
    return () => {
      dispatch(resetBillings())
    }
  }, [])

  return (
    <Card>
      <BillingHeader
        rows={rows}
        status={status}
        search={search}
        statusList={statusList}
        provider_type={provider_type}
        onChangeHandler={onChangeHandler}
        onSearchChange={onChange}
        onChangeType={onChangeType}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />

      <div className="react-dataTable">
        {loading ? (
          <Spinner />
        ) : rows?.length > 0 ? (
          <DataTable
            pagination
            paginationServer
            rowsPerPage={limit}
            data={rows}
            pointerOnHover
            highlightOnHover
            paginationDefaultPage={currentPage}
            theme="solarized"
            columns={columns}
            className={
              rows.length === 1 ? 'padding-bottom-2rem' : 'react-dataTable'
            }
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={() =>
              CustomPagination({
                limit,
                handleLimit,
                currentPage,
                count,
                handlePagination
              })
            }
          />
        ) : (
          <div
            className="react-dataTable d-flex align-items-center justify-content-center"
            style={{ minHeight: '20vh' }}
          >
            <div className="mb-1 d-flex flex-column align-items-center justify-content-center">
              <Icon
                className="mb-1"
                icon="material-symbols:search-rounded"
                width="50"
                height="50"
              />
              <h5>No result found</h5>
              {/* {error?.statusCode === 404 || error?.statusCode === 500 ? <p className='text-danger'>{error.msg}</p> : ''} */}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default Billing
