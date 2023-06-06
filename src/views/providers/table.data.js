/* eslint-disable no-unused-vars */
import { Badge } from 'reactstrap'
import Avatar from '@components/avatar'
import { ProviderStatusObj } from '@status/BadgeColors'
import { ProviderType } from '@status/ProviderTypes'

// ** Components
import defaultAvatar from '@src/assets/default.png'
import { useNavigate } from 'react-router-dom'

const caseInsensitiveSort = (rowA, rowB) => {
  const a = rowA.first_name.toLowerCase()
  const b = rowB.first_name.toLowerCase()

  if (a > b) {
    return 1
  }

  if (b > a) {
    return -1
  }

  return 0
}

export const columns = [
  {
    name: 'Name',
    minWidth: '300px',
    sortable: true,
    sortFunction: caseInsensitiveSort,
    cell: (row) => {
      const navigate = useNavigate()
      return (
        <div
          className="table--name"
          onClick={() => navigate(`edit-provider/${row?.id}`)}
        >
          <Avatar
            img={row?.avatar || defaultAvatar}
            imgHeight="25"
            imgWidth="25"
          />
          <span>
            {row.first_name}&nbsp;{row.last_name}
          </span>
        </div>
      )
    }
  },

  {
    name: 'Provider Type',
    sortable: false,
    minWidth: '230px',
    cell: (row) => (
      <div className="d-flex align-items-center justify-content-start flex-wrap">
        {row?.provider_license?.map((license, index) => {
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
      <Badge
        color={ProviderStatusObj[row?.status]?.color}
        pill
        className={
          ProviderStatusObj[row?.status]?.label !== 'Active'
            ? 'fw-300 inactive-padding'
            : 'fw-300 active-color'
        }
      >
        {ProviderStatusObj[row?.status]?.label || '--'}
      </Badge>
    )
  },

  {
    name: 'Bookings Per Month',
    sortable: false,
    selector: (row) => row?.avg_booking_per_month || '--'
  },
  {
    name: 'Bookings Last 30 Days',
    sortable: false,
    selector: (row) => row?.total_bookings_to_thirty_days || '--'
  },
  {
    name: 'Total Bookings',
    sortable: false,
    selector: (row) => row?.total_bookings || '--'
  },
  {
    name: 'Cancellation Per Month',
    sortable: false,
    selector: (row) => parseInt(row?.avg_cancelled_per_month)
  }
]
