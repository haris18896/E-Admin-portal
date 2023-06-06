/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// ** Third Party Packages
import moment from 'moment'
import { Check, X } from 'react-feather'
import { Icon } from '@iconify/react'
import {
  Badge,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  Spinner
} from 'reactstrap'

// ** Components
import FormGroupElement from '@FormGroupElement'
import { StatusObj } from '@status/BadgeColors'

// ** Actions and Store
import { useDispatch, useSelector } from 'react-redux'
import {
  addEtheraCreditAction,
  addPromoCreditAction,
  bulkAddPromoCreditAction,
  bulkAddEtheraCreditAction
} from '@store/provider/providerAction'
import classNames from 'classnames'

function CreditModal({
  promo,
  open,
  table,
  selected,
  handleModal,
  setSelectedRows,
  handleSelectedIds
}) {
  const dispatch = useDispatch()

  const {
    getPromo,
    getEthera,
    creditPending,
    addPromoCreditLoading,
    addEtheraCreditLoading,
    bulkAddPromoCreditLoading,
    bulkAddEtheraCreditLoading
  } = useSelector((state) => state.provider)
  const promoRows = getPromo?.result
  const etheraRows = getEthera?.result

  // ** States
  const [amount, setAmount] = useState('')
  const [notes, setNote] = useState('')

  // ** ids list
  const ids = handleSelectedIds()
  const idx = ids[0]

  // ** Modal Close Handle
  const CloseBtn = (
    <X className="pointer fw-600" size={15} onClick={handleModal} />
  )

  // ** Adding Promo Credit handle
  const HandleAddedPromoCredit = ({ status }) => {
    const data = { status, amount, notes }
    if (ids.length === 1) return dispatch(addPromoCreditAction({idx, data, setSelectedRows, callback: () => setNote('')}))
    dispatch(
      bulkAddPromoCreditAction({
        ids,
        status,
        amount,
        notes,
        callback: () => setNote('')
      })
    )
  }

  // ** Adding Ethera Credit handle
  const HandleAddedEtheraCredit = ({ status }) => {
    const data = { status, amount, notes }
    if (ids.length === 1) return dispatch(addEtheraCreditAction({idx, data, setSelectedRows,  callback: () => setNote('')}))
    dispatch(
      bulkAddEtheraCreditAction({
        ids,
        status,
        amount,
        notes,
        callback: () => setNote('')
      })
    )
  }

  return (
    <Modal
      scrollable={true}
      isOpen={open}
      toggle={handleModal}
      className="modal-dialog-centered calendarModal"
    >
      <ModalHeader
        className="mb-1 ethera-modal-top-background"
        close={CloseBtn}
        toggle={handleModal}
        tag="div"
      >
        <h5 className="modal-title ethera-dark fw-600">
          {!!promo ? 'Promo' : 'Ethera'} Credit
        </h5>
      </ModalHeader>

      {/* <PerfectScrollbar options={{ wheelPropagation: false }}> */}
      <ModalBody className="mt-1 flex-grow-1 pb-sm-0 pb-3">
        <div className="pl-2 ">
          <p className="sub-heading-1 gray mb-1">
            <strong>{moment().format('ddd')}</strong>,{' '}
            <span>{moment().format('MMMM D, YYYY')}</span>
          </p>
          {table && (
            <>
              <p>Amount Available</p>
              <h2>{selected?.price}</h2>
            </>
          )}
        </div>
        <div className="px-2">
          <FormGroupElement
            inputType="number"
            label={!!promo ? 'Promo Credit' : 'Ethera Credit'}
            labelClassName="pl-10px"
            inputName="credit"
            prefix={<Icon icon="bx:dollar" />}
            placeholder="Add Amount"
            formGroupClassName="relative"
            prefixClassName="prefix"
            inputClassName="form-fields radius-25 skin-change pl-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="px-2">
          <FormGroupElement
            inputType="text"
            label="Note"
            labelClassName="pl-10px"
            inputName="Note"
            placeholder="Add Note"
            formGroupClassName="mb-3 relative"
            inputClassName="form-fields radius-25 skin-change pl-2"
            value={notes}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <hr className="mt-2" />

        <div
          className={
            table
              ? 'pb-0 px-2 modal-credit-buttons'
              : 'px-2 pb-2 modal-credit-buttons'
          }
        >
          <Button className="button-delete-credit"  disabled={
              addPromoCreditLoading ||
              addEtheraCreditLoading ||
              bulkAddPromoCreditLoading ||
              bulkAddEtheraCreditLoading ||
              !amount
            }
            onClick={() => {
              setAmount('')
              handleModal(false)
              {
                promo
                  ? HandleAddedPromoCredit({ status: 2 })
                  : HandleAddedEtheraCredit({ status: 2 })
              }
            }}
            >
              {(addPromoCreditLoading ||
              addEtheraCreditLoading ||
              bulkAddPromoCreditLoading ||
              bulkAddEtheraCreditLoading) && <Spinner size='sm' className='spinner-size-remove'/>}
            <span className="px-1">
              Remove
            </span>
          </Button>

          <Button
            className="button-success pd"
            disabled={
              addPromoCreditLoading ||
              addEtheraCreditLoading ||
              bulkAddPromoCreditLoading ||
              bulkAddEtheraCreditLoading ||
              !amount
            }
            onClick={() => {
              setAmount('')
              handleModal(false)
              {
                promo
                  ? HandleAddedPromoCredit({ status: 1 })
                  : HandleAddedEtheraCredit({ status: 1 })
              }
            }}
          >
            {addPromoCreditLoading ||
              addEtheraCreditLoading ||
              bulkAddPromoCreditLoading ||
              bulkAddEtheraCreditLoading ? <Spinner size='sm' /> : <Check size={14} />}
            <span className="px-1">Add</span>
          </Button>
        </div>
        {table && (
          <div className="table-wrapper mt-1">
            <h5 className="recent-activity">Recent Activity</h5>
            <div
              className={classNames({
                'table-scroll': true,
                'd-flex justify-content-center align-items-center':
                  creditPending
              })}
            >
              {creditPending ? (
                <Spinner size="lg" />
              ) : (
                <Table className="show-credit-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Notes</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(!!promo ? promoRows : etheraRows)?.map((item, i) => {
                      return (
                        <tr key={i}>
                          <td>{moment.unix(item.date).format('MM/DD/YYYY')}</td>
                          <td>{item.notes}</td>
                          <td>{item.amount}</td>
                          <td>
                            <Badge
                              size="sm"
                              color={
                                item.status === '1'
                                  ? StatusObj['add'].color
                                  : StatusObj['remove'].color
                              }
                              pill
                            >
                              {item.status === '1' ? 'Add' : 'Remove'}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        )}
      </ModalBody>
      {/* </PerfectScrollbar> */}
    </Modal>
  )
}

export default CreditModal
