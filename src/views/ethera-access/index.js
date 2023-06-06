/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect } from 'react'

// third party packages
import { Card } from 'reactstrap'
import { Icon } from '@iconify/react'
import { ChevronDown, X } from 'react-feather'
import DataTable, { createTheme } from 'react-data-table-component'

// components
import { columns } from './table.data'
import Spinner from '@spinner'
import CustomPagination from '@pagination/ReactPaginate'
import AccessHeader from '@ScreenComponent/ethera-access/headers'
import EtheraAccessAddNewLock from '@ScreenComponent/ethera-access/add-new-lock'

import toast from 'react-hot-toast'
import { ToastContent } from '@src/components/toast'
// Store
import { useDispatch, useSelector } from 'react-redux'
import { getAllLocationsAction } from '../../redux/locations/locationsAction'
import {
  getAllLocksAction,
  handleLimitChange,
  handlePageChange
} from '../../redux/access/accessAction'

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

function EtheraAccess() {
  const [page, setPage] = useState(1)

  const dispatch = useDispatch()
  const getAllLocations = useSelector(
    (state) => state.locations.getAllLocations?.locationsList
  )

  const { loading, getAllLocks } = useSelector((state) => state.access)
  const limit = getAllLocks.limit
  const offset = getAllLocks.offset
  const rows = getAllLocks?.locksList?.result

  const [locationsList, setLocationsList] = useState([])
  const [location, setLocation] = useState(null)


  useEffect(() => {
    dispatch(getAllLocationsAction())
  }, [])

  useEffect(() => {
    dispatch(getAllLocksAction({ offset, limit }))
  }, [])

  useEffect(() => {
    if (getAllLocations) {
      const arr = []
      getAllLocations.forEach((item) => {
        arr.push({
          text: item?.name,
          value: item.id
        })
      })
      setLocationsList(arr)
    }
  }, [getAllLocations])

  const handleLimit = (newLimit) => {
    dispatch(handleLimitChange({ oldLimit: limit, newLimit }))
  }

  // ! Something is wrong with offset and pagination
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({ offset: newOffset === 0 ? 0 : newOffset + 1, limit })
    )
    setPage(() => Math.ceil((offset + 1) / limit))
  }

  // const dataToRender = useCallback(() => {
  //   const firstIndex = page * limit
  //   const lastIndex = parseInt(firstIndex) + parseInt(limit)
  //   return rows.slice(firstIndex, lastIndex)
  // }, [page, limit])

  return (
    <Card>
      <AccessHeader locations={locationsList} location={location} setLocation={setLocation} />
      <EtheraAccessAddNewLock setLocation={setLocation} />

      <div className="tags mb-1">
        <Icon icon="bxs:lock" width="20" height="20" />
        <span>Current Locks</span>
      </div>

      <div className="react-dataTable">
        {loading ? (
          <Spinner />
        ) : !!rows?.length ? (
          <DataTable
            pagination
            paginationServer
            rowsPerPage={limit}
            data={rows}
            pointerOnHover
            dispatch
            highlightOnHover
            theme="solarized"
            columns={columns({ getAllLocations })}
            className="react-dataTable "
            paginationDefaultPage={page}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={() => {
              if (rows.length > 10) {
                CustomPagination({
                  limit,
                  handleLimit,
                  page,
                  rows,
                  handlePagination
                })
              }
            }}
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
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default EtheraAccess
