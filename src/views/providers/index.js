/* eslint-disable no-unused-vars */
import React, {
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useEffect,
  useRef
} from 'react'

// ** Third Party Packages
import { Icon } from '@iconify/react'
import { ChevronDown } from 'react-feather'
import { Card, Input, Button, Spinner } from 'reactstrap'
import DataTable, { createTheme } from 'react-data-table-component'
import debounce from 'lodash/debounce'

// ** Components
import CustomSpinner from '@spinner'
import { columns } from './table.data'
import { useNavigate } from 'react-router-dom'
import CustomPagination from '@pagination/ReactPaginate'
import { StatusList, licenseTypesList } from './constants'
import ProvidersHeader from '@ScreenComponent/providers.screen/headers/providers-headers'
import CreditModal from '../../components/screen.components/providers.screen/credit-modal'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllProviders,
  deleteMultipleProviders,
  handleLimitChange,
  handlePageChange
} from '@store/provider/providerAction'
import { resetProvidersList } from '@store/provider/providerSlice'
// import { useDebounce } from '../../utility/Utils'

const BootstrapCheckbox = forwardRef((props, ref) => (
  <div className="form-check">
    <Input type="checkbox" ref={ref} {...props} />
  </div>
))

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
    },
    context: {
      background: '#c8d1ed !important',
      color: '#000 !important'
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

function Providers() {
  const navigate = useNavigate()
  // default page size is 5
  const [PageSize, setPagesize] = useState(10)
  const inputRef = useRef(null)
  // default to first page
  const [currentPage, setCurrentPage] = useState(0)

  const dispatch = useDispatch()
  const { loading, deletePending, getAllProvidersData } = useSelector(
    (state) => state.provider
  )

  const limit = getAllProvidersData.limit
  const count = getAllProvidersData.count
  const offset = getAllProvidersData.offset
  const rows = getAllProvidersData.providersList

  const [promo, setPromo] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState(null)
  const [selectedValue, setSelectedValue] = useState([])
  const [provider_type, setProviderType] = useState()
  const searchInput = document.getElementById('search')
  const pro = JSON.stringify(selectedValue)

  //** Handle Multiple Provider Type */
  const onChangeType = (e) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : [])
    // setIsOpen(false)
    dispatch(
      getAllProviders({
        offset: 0,
        limit,
        provider_type: JSON.stringify(
          Array.isArray(e) ? e.map((x) => x.value) : []
        ),
        status: status?.value,
        search: searchInput?.value
      })
    )
    setCurrentPage(0)
  }

  //** Handle Status Change */
  const onChangeHandler = (name, value) => {
    if (name === 'status') setStatus(value)
    dispatch(
      getAllProviders({
        offset: 0,
        limit,
        provider_type: JSON.stringify(selectedValue),
        status: value?.value,
        search: searchInput?.value
      })
    )
    setCurrentPage(0)
    setSelectedRows([])
  }

  //** Handle Search */
  const handleSearch = (e) => {
    dispatch(
      getAllProviders({
        offset: 0,
        limit,
        provider_type: JSON.stringify(selectedValue),
        status: status?.value,
        search: searchInput?.value
      })
    )
    setCurrentPage(0)
    setSelectedRows([])
  }
  const onChange = useCallback(
    debounce((e) => handleSearch(e?.target?.value || ' '), 600),
    [handleSearch]
  )

  //** Handle Reset */
  const handleReset = () => {
    const input = document.getElementById('search')
    input.value = ''
    dispatch(
      getAllProviders({
        offset: 0,
        limit: 10
      })
    )
    setStatus(null)
    setSelectedValue([])
    setCurrentPage(0)
    setSelectedRows([])
  }

  const handleModal = () => setOpenModal(!openModal)

  useEffect(() => {
    dispatch(
      getAllProviders({
        offset:
          searchInput?.value || status || (pro !== '[]' && pro !== undefined)
            ? 0
            : offset,
        limit: 10,
        provider_type: JSON.stringify(selectedValue),
        status: status?.value,
        search: searchInput?.value
      })
    )
  }, [])

  const selectedRowsCount = selectedRows.length

  // ** Rows Selected by id
  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows)
  }, [])

  const handleDelete = () => {
    const idsList = {
      ids: []
    }
    selectedRows.map((item) => idsList.ids.push(`${item.id}`))
    dispatch(
      deleteMultipleProviders({
        ids: idsList,
        callBack: () => {
          setSelectedRows([])
          setCurrentPage(0)
        }
      })
    )
  }

  const handleSelectedIds = () => {
    const ids = []
    selectedRows.map((item) => ids.push(`${item.id}`))
    return ids
  }

  useEffect(() => {
    return () => {
      dispatch(resetProvidersList())
    }
  }, [])

  // **   Handle Pagination Limit
  const handleLimit = (newLimit) => {
    dispatch(
      handleLimitChange({
        oldLimit: limit,
        newLimit,
        status: status?.value,
        search: searchInput?.value,
        provider_type: JSON.stringify(selectedValue)
      })
    )
    setSelectedRows([])
    setCurrentPage(0)
  }

  // **   Handle Pagination Page
  const handlePagination = (page) => {
    const newOffset = page.selected * limit
    dispatch(
      handlePageChange({
        offset: newOffset === 0 ? 0 : newOffset,
        limit,
        status: status?.value,
        search: searchInput?.value,
        provider_type: JSON.stringify(selectedValue)
      })
    )
    setSelectedRows([])
    setCurrentPage(() => page.selected)
  }

  return (
    <Card>
      <CreditModal
        promo={promo}
        open={openModal}
        handleModal={handleModal}
        setSelectedRows={setSelectedRows}
        handleSelectedIds={handleSelectedIds}
      />

      <ProvidersHeader
      
        status={status}
        statusList={StatusList}
        handleReset={handleReset}
        provider_type={provider_type}
        onChangeHandler={onChangeHandler}
        onChangeType={onChangeType}
        onSearchChange={onChange}
        licenseTypesList={licenseTypesList}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
      />

      <div className="react-dataTable">
        {loading ? (
          <CustomSpinner />
        ) : rows?.length > 0 ? (
          <>
            <div
              className="table--selectedRows"
              style={{ backgroundColor: '#c8d1ed', padding: '1rem' }}
            >
              <div className="table--selectedRows__actions">
                <Button
                  disabled={selectedRowsCount === 0}
                  className="button-ethera"
                  onClick={() => {
                    setPromo(false)
                    setOpenModal(!openModal)
                  }}
                >
                  <span>Ethera Credit</span>
                </Button>

                <Button
                  disabled={selectedRowsCount === 0}
                  className="button-ethera"
                  onClick={() => {
                    setPromo(true)
                    setOpenModal(!openModal)
                  }}
                >
                  <span>Promo Credit</span>
                </Button>

                <Button
                  className="button-ethera-no-icon"
                  onClick={() => handleDelete()}
                  disabled={deletePending || selectedRowsCount === 0}
                >
                  {deletePending ? (
                    <Spinner size="sm" color="danger" />
                  ) : (
                    <Icon icon="fa6-solid:trash-can" width="20" height="20" />
                  )}
                </Button>
              </div>
              {selectedRowsCount === 0 ? null : (
                <div className="table--selectedRows__count">
                  <span>{selectedRowsCount} Provider(s) Selected</span>
                </div>
              )}
            </div>

            <DataTable
              pagination
              paginationServer
              rowsPerPage={PageSize}
              paginationDefaultPage={currentPage}
              data={rows}
              pointerOnHover
              selectableRows
              highlightOnHover
              theme="solarized"
              columns={columns}
              className="react-dataTable "
              customStyles={customStyles}
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
              onSelectedRowsChange={handleRowSelected}
              selectableRowsComponent={BootstrapCheckbox}
              onRowClicked={(row) => navigate(`edit-provider/${row?.id}`)}
            />
          </>
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
              <h4>Search for result</h4>
              <h5>No data has found in the providers list</h5>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default Providers
