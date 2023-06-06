/* eslint-disable no-unused-vars */
// ** React Imports
import { Link } from 'react-router-dom'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import { Icon } from '@iconify/react'
import { useDispatch } from 'react-redux'

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem
} from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/default.png'

// actions
import { handleLogout } from '@store/authentication/authSlice'

const UserDropdown = () => {
  const dispatch = useDispatch()

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          {/* <span className="user-name fw-bold">John Doe</span> */}
          {/* <span className="user-status">Admin</span> */}
        </div>
        <Avatar
          img={defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          // status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <Icon icon="bxs:user" className="me-75" />
          <span className="align-middle">
            <strong>Profile</strong>
          </span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <Icon icon="eva:settings-fill" className="me-75" />
          <span className="align-middle">
            <strong>Settings</strong>
          </span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <Icon icon="dashicons:editor-help" className="me-75" />
          <span className="align-middle">
            <strong>Help</strong>
          </span>
        </DropdownItem>
        <DropdownItem tag={Link} to="/" onClick={(e) => e.preventDefault()}>
          <Icon icon="ant-design:bulb-filled" className="me-75" />
          <span className="align-middle">
            <strong>Request a Feature</strong>
          </span>
        </DropdownItem> */}
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Icon icon="entypo:log-out" className="me-75" />
          <span className="align-middle">
            <strong>Logout</strong>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
