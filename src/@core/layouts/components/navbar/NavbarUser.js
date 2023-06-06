// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
import { NavItem, NavLink } from 'reactstrap'
import { Sun, Moon } from 'react-feather'
import NotificationDropdown from './NotificationDropdown'

const NavbarUser = props => {
  const { skin, setSkin } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className='ficon' onClick={() => setSkin('light')} />
    } else {
      return <Moon className='ficon' color='#4b4b4b' onClick={() => setSkin('dark')} />
    }
  }

  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      <NavItem className='d-lg-block'>
        <NavLink className='nav-link-style'>
          <ThemeToggler />
        </NavLink>
      </NavItem>
      <NotificationDropdown />
      {/* <NotificationDropdown /> */}
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
