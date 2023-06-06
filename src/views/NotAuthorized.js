// ** React Imports
import { Link, useNavigate } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Utils
import {} from '@utils'

// ** Styles
import '@styles/base/pages/page-misc.scss'

import themeConfig from '@configs/themeConfig'

const NotAuthorized = () => {
  // ** Hooks
  const { skin } = useSkin()
  const navigate = useNavigate()

  const illustration =
      skin === 'dark' ? 'not-authorized-dark.svg' : 'not-authorized.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className="misc-wrapper">
      <Link className="brand-logo" to="/" onClick={() => navigate('/calendar')}>
        <img
          src={themeConfig.app.appLogoImage}
          width={35}
          height={35}
          alt="logo"
        />
        <h2 className='mb-0 mx-1'>ethera</h2>
      </Link>
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">You are not authorized! 🔐</h2>
          <p className="mb-2">
            The Web trends Marketing Lab website in IIS uses the default IUSR
            account credentials to access the web pages it serves.
          </p>
          <Button
            tag={Link}
            color="primary"
            className="btn-sm-block mb-1"
            to={'/'}
          >
            Back to Home
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  )
}
export default NotAuthorized
