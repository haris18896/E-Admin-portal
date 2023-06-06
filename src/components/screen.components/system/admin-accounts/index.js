/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

// third Party packages
import { Icon } from '@iconify/react'

//components
import Avatar from '@components/avatar'
import { Badge, Button, Table, Spinner } from 'reactstrap'
import { X } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteAdminAction,
  deleteServiceAction,
  getAdminAction,
  getAllAdminAction,
  getAllServiceAction
} from '../../../../redux/system/systemActions'
import SystemModal from '../../../modal/SystemModal'
import LargeSpinner from '@spinner'
import { useNavigate } from 'react-router-dom'
import NameBoardModal from '../../../modal/SystemModal/NameBoardModal'
import KioskModal from '../../../modal/SystemModal/KioskModal'
import AlertModal from '@customComponents/alert'

// ** Images
import defaultAvatar from '@src/assets/default.png'
import { resetGetAdmin } from '../../../../redux/system/systemSlice'

function AdminAccountsTab() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    success,
    listPending,
    adminLoading,
    deleteLoading,
    getAllAdminsData,
    getAllServicesData,
    deleteAdminLoading,
    adminRegisterLoading,
    serviceRegisterLoading
  } = useSelector((state) => state.system)

  const adminRows = getAllAdminsData?.adminsList
  const serviceRows = getAllServicesData?.servicesList

  // ** States
  const [edit, setEdit] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [deleteAdmin, setDeleteAdmin] = useState(false)
  const [adminDeleteId, setAdminDeleteId] = useState(null)
  const [openNameModal, setOpenNameModal] = useState(false)
  const [deleteService, setDeleteService] = useState(false)
  const [openKioskModal, setOpenKioskModal] = useState(false)
  const [serviceDeleteId, setServiceDeleteId] = useState(null)
  const handleDeleteServiceClose = () => setDeleteService(null)
  const handleDeleteServiceOpen = (id) => {
    setDeleteService(true)
    setServiceDeleteId(id)
  }

  const handleCloseDeleteAdmin = () => setDeleteAdmin(false)
  const handleOpenDeleteAdmin = (id) => {
    setDeleteAdmin(true)
    setAdminDeleteId(id)
  }

  const handleCloseModal = () => setOpenModal(false)
  const handleModalName = () => setOpenNameModal(!openNameModal)
  const handleCloseModalName = () => setOpenNameModal(false)
  const handleCloseModalKiosk = () => setOpenKioskModal(false)
  const handleModalKiosk = () => setOpenKioskModal(!openKioskModal)

  const handleGetAdmin = (id, edit, admin) => {
    setEdit(edit)
    setAdmin(admin)
    dispatch(getAdminAction(id))
    setOpenModal(!openModal)
  }

  useEffect(() => {
    dispatch(getAllAdminAction())
    dispatch(getAllServiceAction())
  }, [])

  const handleModal = (admin, edit) => {
    setAdmin(admin)
    setEdit(edit)
    setOpenModal(!openModal)
    dispatch(resetGetAdmin())
  }

  useEffect(() => {
    if (success) {
      handleDeleteServiceClose()
      handleCloseDeleteAdmin()
      handleCloseModalName()
      handleCloseModalKiosk()
      handleCloseModal()
    }
  }, [success])

  return (
    <>
      <AlertModal
        loading={deleteAdminLoading}
        open={deleteAdmin}
        handleOpen={handleOpenDeleteAdmin}
        handleClose={handleCloseDeleteAdmin}
        handleAction={() => {
          dispatch(deleteAdminAction({ id: adminDeleteId, navigate }))
        }}
        title="Delete Admin"
        message="Are you sure you want to delete this admin ?"
      />

      <AlertModal
        loading={deleteLoading}
        open={deleteService}
        handleOpen={handleDeleteServiceOpen}
        handleClose={handleDeleteServiceClose}
        handleAction={() => {
          dispatch(deleteServiceAction({ id: serviceDeleteId, navigate }))
        }}
        title="Delete Service Account"
        message="Are you sure you want to delete this service account ?"
      />

      <div className="system-settings--adminACcounts">
        {adminLoading ? (
          <div className="system-settings--adminACcounts__system align-items-center">
            <LargeSpinner />
          </div>
        ) : (
          <div className="system-settings--adminACcounts__system">
            <p className="heading-3">System Admin Account</p>
            <Table bordered responsive>
              <tbody>
                <tr>
                  <td className="fw-600 bluishColor">USER</td>
                  <td className="fw-600 bluishColor">CONTACT</td>
                </tr>
                {adminRows?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <Avatar
                          img={item?.avatar || defaultAvatar}
                          imgHeight="40"
                          imgWidth="40"
                        />
                        <span className="sub-heading-1 whiteSpace fw-600 ml-1 d-flex">
                          {item.first_name} {item.last_name}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="system-settings--adminACcounts__system--data">
                        <div className="system-settings--adminACcounts__system--data__email">
                          <Icon icon="ic:round-mail" width="20" height="20" className='bluishColor'/>
                          <span className="ml-1">{item.email}</span>
                        </div>

                        <div className="system-settings--adminACcounts__system--actions">
                          <div
                            className="edit skin-change pointer"
                            onClick={() => handleGetAdmin(item.id, true, true)}
                          >
                            <Icon icon="uiw:edit" width="15" height="15" />
                          </div>
                          <div
                            className="edit skin-change pointer"
                            onClick={() => handleOpenDeleteAdmin(item.id)}
                          >
                            <Icon icon="bi:trash-fill" width="15" height="15" />
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button
              className="button-success pd"
              onClick={() => handleModal(true, false)}
            >
              Add New
            </Button>
          </div>
        )}

        <div className="system-settings--adminACcounts__other">
          <div className="system-settings--adminACcounts__other--kiosk">
            <p className="heading-3 bold ">Kiosk Account</p>
            <hr className="m-0" />
            <p className="sub-heading-1 p-1 bluishColor bold-5">EMAIL</p>
            <hr className="m-0" />
            {listPending ? (
              <LargeSpinner />
            ) : (
              serviceRows
                .filter((row) => row.is_kiosk === true)
                .map((item, index) => (
                  <div key={index}>
                    <div className=" p-1 system-settings--adminACcounts__other--board__emails">
                      <div>
                        <Icon icon="ic:round-mail" className='bluishColor'/>
                        <span className="mx-1">{item.email}</span>
                      </div>

                      <div>
                        <Badge
                          color="light-danger pointer"
                          onClick={() => handleDeleteServiceOpen(item.id)}
                        >
                          <Icon icon="bi:trash-fill" />
                          <span className="px-1">Delete</span>
                        </Badge>
                      </div>
                    </div>
                    <hr className="m-0" />
                  </div>
                ))
            )}
            <div className="p-1 system-settings--adminACcounts__other--board__add">
              <Button
                className="button-green"
                onClick={() => handleModalKiosk()}
              >
                Add Service Account
              </Button>
            </div>
          </div>
          <div className="system-settings--adminACcounts__other--board">
            <p className="heading-2">Name Board</p>
            <hr className="m-0" />
            <p className="sub-heading-1 p-1 bluishColor bold-5">EMAIL</p>
            <hr className="m-0" />
            {listPending ? (
              <LargeSpinner />
            ) : (
              serviceRows
                .filter((row) => row.is_welcome_board === true)
                .map((item, index) => (
                  <div key={index}>
                    <div className=" p-1 system-settings--adminACcounts__other--board__emails">
                      <div>
                        <Icon icon="ic:round-mail" className='bluishColor'/>
                        <span className="mx-1">{item.email}</span>
                      </div>

                      <div>
                        <Badge
                          color="light-danger pointer"
                          onClick={() => handleDeleteServiceOpen(item.id)}
                        >
                          <Icon icon="bi:trash-fill" />
                          <span className="px-1">Delete</span>
                        </Badge>
                      </div>
                    </div>
                    <hr className="m-0" />
                  </div>
                ))
            )}

            <div className="p-1 system-settings--adminACcounts__other--board__add">
              <Button
                className="button-green"
                onClick={() => handleModalName()}
              >
                Add Service Account
              </Button>
            </div>
          </div>
        </div>
      </div>
      <SystemModal
        open={openModal}
        handleModal={handleModal}
        admin={admin}
        edit={edit}
        loading={adminRegisterLoading}
      />
      <NameBoardModal
        loading={serviceRegisterLoading}
        open={openNameModal}
        handleModal={handleModalName}
      />
      <KioskModal
        loading={serviceRegisterLoading}
        open={openKioskModal}
        handleModal={handleModalKiosk}
      />
    </>
  )
}

export default AdminAccountsTab
