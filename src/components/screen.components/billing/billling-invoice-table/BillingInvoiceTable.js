/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { jsPDF } from 'jspdf'
import moment from 'moment'
import { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Badge, Button, Card, Table } from 'reactstrap'
import { getBillingAction } from '../../../../redux/billing/billingAction'
import { columns } from './table.data'
import SpinnerComponent from '@spinner'
import 'jspdf-autotable'

const BillingInvoiceTable = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  const { getBilling, loading } = useSelector((state) => state.billing)
  const GetBookings = getBilling?.bookings
  const getProvider = getBilling?.provider
  const etheraCreditRow = getProvider?.etheracredit || []
  const promoCreditRow = getProvider?.promocredit || []

  //** Merge Two Arrays */
  const CreditArray = [...etheraCreditRow, ...promoCreditRow]
  //** Apply Sorting */
  const CreditMergeArray = CreditArray.sort((a, b) => a?.date - b.date)

  useEffect(() => {
    dispatch(getBillingAction(id))
  }, [])

  //**  Total Running Hours */
  // const getBookingList = (bookingList) => {
  //   let result = []
  //   bookingList &&
  //     bookingList.forEach((booking, i) => {
  //       booking.prices &&
  //         booking.prices.forEach((price) => {
  //           const prevHours =
  //             result.length === 0 ? 0 : result[result.length - 1].totalHours

  //           let data = {
  //             ...price,
  //             ...booking,
  //             totalHours: Number(price.hours) + Number(prevHours)
  //           }
  //           result.push(data)
  //         })
  //     })
  //   return result
  // }

  const getBookingList = (bookingList) => {
    let result = []
    let total = 0
    bookingList &&
      bookingList.forEach((booking, i) => {
        let hours = 0
        let price = 0
        if (booking?.prices?.tier !== null) {
          hours += parseInt(booking?.prices?.hours)
        }
        price += parseInt(booking?.prices?.price)
        total += hours
        const data = {
          totalPrice: price,
          pricesHours: hours,
          totalHours: total,
          ...booking
        }
        result.push(data)
      })
    return result
  }

  const list = getBookingList(GetBookings)
  const totalHours = list.length > 0 && list[list.length - 1].totalHours

  //**  Generate PDF  */
  const handleGeneratePdf = () => {
    const unit = 'pt'
    const size = 'A4' // Use A1, A2, A3 or A4
    const orientation = 'landscape' // portrait or landscape
    const increaseMargin = 120
    const increaseMargin2 = 300
    const increaseMargin3 = 400

    const doc = new jsPDF(orientation, unit, size)
    doc.setFontSize(12)
    const pageSize = doc.internal.pageSize
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    let ETHERA_PAY = 'EtheraPay'
    let INVOICE_NUMBER = `Invoice ${getBilling?.invoice_number}`
    let PROVIDER_NAME = `${getBilling?.provider?.first_name} ${getBilling?.provider?.middle_name} ${getBilling?.provider?.last_name}`
    let DURATION = `${moment.unix(getBilling?.created_at).format('MMMM, YYYY')}`
    doc.text(ETHERA_PAY, pageWidth / 2, 30, 'center')
    doc.text(INVOICE_NUMBER, pageWidth / 2, 55, 'center')
    doc.text(PROVIDER_NAME, pageWidth / 2, 80, 'center')
    doc.text(DURATION, pageWidth / 2, 105, 'center')

    doc.autoTable({
      headStyles: { fillColor: [254, 251, 244], textColor: [0, 3, 5] },
      // startY: increaseMargin,
      startY: (doc.lastAutoTable.finalY + 20, { margin: { top: 80 } }),
      html: '#invoice-list'
    })
    doc.autoTable({
      headStyles: { fillColor: [254, 251, 244], textColor: [0, 3, 5] },
      // startY: increaseMargin2,
      startY: (doc.lastAutoTable.finalY + 20, { margin: { top: 80 } }),
      html: '#invoice-list2'
    })

    doc.save(`Invoice_${moment.unix(getBilling?.created_at).format('MMMYY')}`)
  }

  //**  Total Amount */
  const getTotalCharged = ({
    totalChargedBookings,
    promoCredit,
    etheraCredit
  }) => {
    if (
      Number(totalChargedBookings) >
      Number(promoCredit) + Number(etheraCredit)
    ) {
      const totalCharged =
        Number(totalChargedBookings) -
        (Number(promoCredit) + Number(etheraCredit))
      return totalCharged
    } else {
      return 0
    }
  }
  const totalCharged = getTotalCharged({
    totalChargedBookings: getBilling?.total_amount,
    promoCredit: getBilling?.applied_promo_credit,
    etheraCredit: getBilling?.applied_ethera_credit
  })

  return (
    <>
      <Card>
        <div className="p-2 pt-3 bg-yellow d-flex align-items-center justify-content-between flex-wrap">
          <div className="d-flex align-items-center">
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => navigate(-1)}
            />
            <span className="heading-1 ">Invoices</span>
            {!loading && (
              <span className="heading-3 mx-1 ">
                {moment.unix(getBilling?.created_at).format('MMMM YYYY')}
              </span>
            )}
          </div>

          <div className="m-2 d-flex" style={{ textAlign: 'right' }}>
            <Button
              size="sm "
              className="fs-x-small button-white pd-s"
              onClick={handleGeneratePdf}
            >
              <Icon icon="dashicons:upload" width="15" height="15" />
              <span className="ml-5px">Export</span>
            </Button>
          </div>
        </div>
        {loading ? (
          <SpinnerComponent />
        ) : (
          <div>
            <Table bordered responsive id="invoice-list">
              <thead className="bgThead">
                <tr>
                  {columns.map(({ header }, i) => (
                    <th key={i}>{i === 0 ? 'Tier' : header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {list?.map((item, i) => {
                  return (
                    <tr key={i} className="tableRow">
                      <td>{item.prices?.tier || '--'}</td>
                      <td>{item.booking_number || '--'}</td>
                      <td>
                        {item.created_at !== null
                          ? moment.unix(item.created_at).format('MM/DD/YYYY')
                          : '--'}
                      </td>
                      <td>
                        {item.start_date !== null
                          ? moment.unix(item.start_date).format('MM/DD/YYYY')
                          : '--'}
                      </td>
                      <td>
                        {item?.cancel_date !== null
                          ? moment.unix(item?.cancel_date).format('MM/DD/YYYY')
                          : '--'}
                      </td>
                      <td>{item.location?.name || '--'}</td>
                      <td>{item.room.name || '--'}</td>
                      <td>${item.prices?.price || '0'}</td>
                      <td>{parseInt(item.prices?.hours) || '0'} hours</td>
                      <td>{parseFloat(item?.totalHours) || '0'} hours</td>
                      <td>${item.room_cost || '--'}</td>
                    </tr>
                  )
                })}

                <tr className="borderLess-cell bgGray">
                  <td colSpan={6}>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{totalHours || 0} hour</td>
                  <td>$ {getBilling?.total_amount.toFixed(2)}</td>
                </tr>
                <tr className="borderLess-cell bgGray">
                  <td colSpan={6}>Promo Credit</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>$ {getBilling?.applied_promo_credit || 0}</td>
                </tr>
                <tr className="borderLess-cell bgGray">
                  <td colSpan={6}>Ethera Credit</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>$ {getBilling?.applied_ethera_credit || 0}</td>
                </tr>
                <tr className="borderLess-cell bgGray">
                  <td colSpan={6}>Total Charge</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    $ {totalCharged.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </Table>

            <div className="m-2">
              <Card className="card-transaction maxWidth-cardBalance">
                <div className="mt-3 mb-3">
                  <span className="p-1 creditBalance-invoiceList" tag="h4">
                    <strong>
                      <Icon icon="fa6-solid:wallet" className="mx-1" />
                      Credit Balance
                    </strong>
                  </span>
                </div>
                <hr className="m-0 dividerTop" />
                <table id="invoice-list2">
                  <thead>
                    <tr
                      className={classNames({
                        'transaction-item px-3': true
                      })}
                    >
                      <th className="transaction-title">
                        Opening Credit Balance
                      </th>
                      <th></th>
                      <th>$ {getBilling?.provider_open_credit}</th>
                    </tr>
                    <tr
                      className={classNames({
                        'transaction-item px-3 ': true
                      })}
                    >
                      <th>Add Credit</th>
                    </tr>
                    <tr
                      className={classNames({
                        'justify-content-between align-items-center d-flex px-3 bg-white border-bottom': true
                      })}
                    >
                      <th className="transaction-title">Date</th>
                      <th className="transaction-title">Notes</th>
                      <th className="transaction-title">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CreditMergeArray?.map((item, i) => {
                      return (
                        <tr
                          className={classNames({
                            'transaction-item px-3 bg-white': true
                          })}
                          key={i}
                        >
                          <td>
                            {item?.date !== null
                              ? moment.unix(item?.date).format('MM/DD/YYYY')
                              : '--'}
                          </td>

                          <td className="max-width">{item?.notes || ''}</td>
                          <td>$ {item?.amount || 0}</td>
                        </tr>
                      )
                    })}

                    <tr
                      className={classNames({
                        'transaction-item px-3': true
                      })}
                    >
                      <td className="transaction-title bold">
                        {' '}
                        Credit Applied
                      </td>
                      <td></td>
                      <td className="bold">
                        $ {getBilling?.received_credit || 0}
                      </td>
                    </tr>
                    <tr
                      className={classNames({
                        'transaction-item px-3 bgGray': true
                      })}
                    >
                      <td className="transaction-title">
                        Total Credit Balance
                      </td>
                      <td></td>
                      <td>$0 </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

export default BillingInvoiceTable
