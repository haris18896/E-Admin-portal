/* eslint-disable prefer-template */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
import moment from 'moment'
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Spinner
} from 'reactstrap'
import { BillingStatusObj } from '../../components/status/BadgeColors'
import { ProviderType } from '../../components/status/ProviderTypes'
import { useState } from 'react'
import { MoreVertical } from 'react-feather'
import { useNavigate } from 'react-router-dom'
import 'jspdf-autotable'
import jsPDF from 'jspdf'
import { useDispatch, useSelector } from 'react-redux'
import {
  BillingInvoiceAction,
  updateBillingInvoiceAction
} from '../../redux/billing/billingAction'

export const columns = [
  {
    name: 'Date',
    sortable: true,
    cell: (row) => (
      <>
        <span>
          {row.created_at !== null 
            ? moment.unix(row?.created_at).format('MMMM, YYYY')
            : '--'}
        </span>
      </>
    )
  },
  {
    name: 'Invoice Number',
    sortable: true,
    minWidth: '140px',
    cell: (row) => {
      const navigate = useNavigate()
      return (
        <span
          className="link pointer"
          onClick={() => navigate(`/billing/invoice/${row?.id}`)}
        >
          # {row?.invoice_number || '--'} 
        </span>
      )
    }
  },
  {
    name: 'Provider',
    sortable: false,

    cell: (row) => (
      <>
        <span>
          {`${row?.provider?.first_name || '--'} ${
            row?.provider?.last_name || '--'
          }`}
        </span>
      </>
    )
  },
  {
    name: 'Provider Type',
    sortable: false,
    minWidth: '250px',
    cell: (row) => (
      <div className="d-flex align-items-center justify-content-start flex-wrap">
        {row?.provider?.provider_license?.map((license, index) => {
          return (
            <p key={index} className="whiteSpace tableListSpan">
              {ProviderType[license?.license_type]?.text || '--'}
              <span>, &nbsp;</span>
            </p>
          )
        })}
      </div>
    )
  },
  {
    name: 'Status',
    sortable: false,
    cell: (row) => (
      <>
        <Badge
          color={BillingStatusObj[row?.status]?.color}
          pill
          className={
            BillingStatusObj[row?.status]?.label === 'Over Due'
              ? 'active-color'
              : null
          }
        >
          {BillingStatusObj[row?.status]?.label}
        </Badge>
      </>
    )
  },
  {
    name: 'Total',
    sortable: false,
    width: '150px',
    cell: (row) => {
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const [open, setOpen] = useState(false)
      const [dropdownOpen, setDropdownOpen] = useState(false)
      const toggle = () => setDropdownOpen((prevState) => !prevState)
      const { invoiceLoading, invoiceStatusLoading } = useSelector(
        (state) => state.billing
      )
      const handleEmailInvoice = () => {
        setDropdownOpen(false)
        const unit = 'pt'
        const size = 'A4' // Use A1, A2, A3 or A4
        const orientation = 'landscape' // portrait or landscape
        const margin = 40
        const doc = new jsPDF(orientation, unit, size)
        doc.setFontSize(12)
        const title = `Ethera Invoice.`

        doc.text(40, 30, title)
        doc.autoTable({
          html: '#invoice-list'
        })
        let finalY = doc.lastAutoTable.finalY + 40 // The y position on the page

        const output = doc.output('datauristring')
        const formData = new FormData()
        formData.append('file', output)
        dispatch(
          BillingInvoiceAction({
            data: formData,
            id: row?.id,
            callback: () => setDropdownOpen(true)
          })
        )
      }
      const handlePostInvoice = ({ status, id }) => {
        setDropdownOpen(false)
        const data = {
          status
        }
        dispatch(updateBillingInvoiceAction({ data, id }))
      }

      return (
        <div className="d-f-between w-100Percent">
          <div>
            <span>$ {row?.total_amount.toFixed(2)}</span>
          </div>

          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggle}
            direction="start"
            className="billing-dropdown"
          >
            <DropdownToggle className="dropdown-btn">
              <MoreVertical size={20} id="invoice" />
            </DropdownToggle>
            <DropdownMenu className="billing-dropdown-menu">
              <DropdownItem
                className="billing-dropdown-menu-item"
                disabled={invoiceStatusLoading || row?.status === 3}
                onClick={() => handlePostInvoice({ status: 3, id: row?.id })}
              >
                {invoiceStatusLoading && row?.status === 1 ? (
                  <Spinner size="sm" />
                ) : null}{' '}
                Void
              </DropdownItem>
              <DropdownItem
                className="billing-dropdown-menu-item"
                disabled={invoiceStatusLoading || row?.status === 1}
                onClick={() => handlePostInvoice({ status: 1, id: row?.id })}
              >
                {invoiceStatusLoading && row?.status === 3 ? (
                  <Spinner size="sm" />
                ) : null}{' '}
                Paid
              </DropdownItem>
              <DropdownItem
                disabled={invoiceLoading}
                className="billing-dropdown-menu-item"
                onClick={handleEmailInvoice}
              >
                {invoiceLoading ? <Spinner size="sm" /> : 'Email'} Invoice
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )
    }
  }
]
