// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import NavbarUser from './NavbarUser'
import themeConfig from '@configs/themeConfig'

// ** Third Party Components
import { Sun, Moon, Menu } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
// import classNames from 'classnames'

const ThemeNavbar = (props) => {
  // ** Props
  const { skin, setSkin, setMenuVisibility } = props

  // ** Function to toggle Theme (Light/Dark)
  const ThemeToggler = () => {
    if (skin === 'dark') {
      return <Sun className="ficon" onClick={() => setSkin('light')} />
    } else {
      return <Moon className="ficon" onClick={() => setSkin('dark')} />
    }
  }

  const navigate = useNavigate()

  return (
    <Fragment>
      <div className="bookmark-wrapper d-flex align-items-center">
        <ul className="navbar-nav d-xl-none">
          <NavItem className="mobile-menu me-auto">
            <NavLink
              className="nav-menu-main menu-toggle hidden-xs is-active"
              onClick={() => setMenuVisibility(true)}
            >
              <Menu
                className="ficon"
                color={skin === 'dark' ? '#fff' : '#636b7b'}
              />
            </NavLink>
          </NavItem>
        </ul>
        <NavItem className="d-block">
          <NavLink
            className="nav-link-style ml-1 d-flex align-items-center justify-content-start"
            onClick={() => navigate('/calendar')}
          >
            <img
              src={themeConfig.app.appLogoImage}
              width={35}
              height={35}
              alt="logo"
            />
            <span
              className={classNames({
                'logo-text': true,
                'dark-logo-text': skin === 'dark'
              })}
            >
              ethera
            </span>
          </NavLink>
        </NavItem>
      </div>

      <NavbarUser skin={skin} setSkin={setSkin} />
    </Fragment>
  )
}

export default ThemeNavbar
