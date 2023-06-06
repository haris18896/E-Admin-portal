/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Spinner } from 'reactstrap'
import {
  deleteLockAction,
  getLockAction,
  testLockAction
} from '../../redux/access/accessAction'
import { useState } from 'react'
import ModalTest from '../../components/modal/ModalTest'
import AlertModal from '@customComponents/alert'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

export const columns = ({ getAllLocations }) => {
  return [
    {
      name: 'Location',
      sortable: false,
      cell: (row) => {
        const location = getAllLocations?.find(
          (location) => location.id === row.location
        )

        return <div>{location?.name}</div>
      }
    },
    {
      name: 'Access',
      sortable: false,
      selector: (row) => row.name
    },
    {
      name: 'Token',
      sortable: false,
      minWidth: '250px',
      selector: (row) => row.token
    },
    {
      name: 'Actions',
      sortable: false,
      minWidth: '350px',
      cell: (row) => {
        const dispatch = useDispatch()
        const navigate = useNavigate()
        const { location, id, token } = row
        const [openModal, setOpenModal] = useState(false)
        const [alertModalOpen, setAlertModalOpen] = useState(false)

        const [idx, setIdx] = useState(null)
        const { testLoading, deleteLockPending } = useSelector(
          (state) => state.access
        )
        const handleModal = () => setOpenModal(!openModal)
        const handleEditModal = () => {
          setOpenModal(true)
          dispatch(getLockAction({ location, id }))
        }
        // ** Handle Modals
        const handleCloseAlertModal = () => setAlertModalOpen(false)
        const handleOpenAlertModal = (id) => {
          setIdx(id)
          setAlertModalOpen(true)
        }
        return (
          <>
            <AlertModal
              loading={deleteLockPending}
              open={alertModalOpen}
              handleOpen={handleOpenAlertModal}
              handleClose={handleCloseAlertModal}
              handleAction={() =>
                dispatch(
                  deleteLockAction({
                    location,
                    id: idx,
                    navigate,
                    callBack: () => {
                      setIdx(null)
                    }
                  })
                )
              }
              title="Delete Lock"
              message="Are you sure you want to delete this lock ?"
            />

            <div className="ethera-access--actions">
              <Button
                className="btn-gold whiteSpace pd me-1"
                type="button"
                disabled={testLoading && idx === row.id}
                onClick={() => {
                  setIdx(row.id)
                  dispatch(
                    testLockAction({ token, callBack: () => setIdx(null) })
                  )
                }}
              >
                {testLoading && idx === row.id && (
                  <Spinner className="spinner-size" />
                )}{' '}
                Test Lock
              </Button>
              <Badge
                className="ethera-access--actions__edit"
                pill
                onClick={handleEditModal}
              >
                Edit
              </Badge>
              <ModalTest open={openModal} handleModal={handleModal} />
              <Badge
                className="ethera-access--actions__delete"
                pill
                disabled={deleteLockPending && idx === row.id}
                onClick={() => handleOpenAlertModal(row.id)}
              >
                Delete
              </Badge>
            </div>
          </>
        )
      }
    }
  ]
}
