import PropTypes from 'prop-types'
import Avatar from '@components/avatar'
import { X } from 'react-feather'
import toast from 'react-hot-toast'


export const ToastContent = ({ t, name, icon, color, msg }) => {
  return (
    <div className="d-flex">
      <div className="me-1">
        <Avatar size="sm" color={color} icon={icon} />
      </div>
      <div className="d-flex flex-column">
        <div className="d-flex justify-content-between">
          <h6>{name}</h6>
          <X
            size={17}
            className="pointer ml-1"
            onClick={() => toast.dismiss(t.id)}
          />
        </div>
        <span>
          {msg}
        </span>
      </div>
    </div>
  )
}

ToastContent.propTypes = {
  t: PropTypes.object,
  name: PropTypes.string,
  icon: PropTypes.element,
  color: PropTypes.string,
  msg: PropTypes.string
}