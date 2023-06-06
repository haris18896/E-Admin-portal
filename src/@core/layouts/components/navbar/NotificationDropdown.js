// ** React Imports
import { Fragment } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'

// ** Reactstrap Imports
import {
  Button,
  Badge,
  Input,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown
} from 'reactstrap'

const NotificationDropdown = () => {
  // ** Notification Array
  // const notificationsArray = [
  //   {
  //     img: require('@src/assets/images/portrait/small/avatar-s-15.jpg').default,
  //     subtitle: 'Won the monthly best seller badge.',
  //     title: (
  //       <p className="media-heading">
  //         <span className="fw-bolder">Congratulation Sam 🎉</span>winner!
  //       </p>
  //     )
  //   },
  //   {
  //     img: require('@src/assets/images/portrait/small/avatar-s-3.jpg').default,
  //     subtitle: 'You have 10 unread messages.',
  //     title: (
  //       <p className="media-heading">
  //         <span className="fw-bolder">New message</span>&nbsp;received
  //       </p>
  //     )
  //   },
  //   {
  //     avatarContent: 'MD',
  //     color: 'light-danger',
  //     subtitle: 'MD Inc. order updated',
  //     title: (
  //       <p className="media-heading">
  //         <span className="fw-bolder">Revised Order 👋</span>&nbsp;checkout
  //       </p>
  //     )
  //   }
  // ]

  const notificationsArray = []

  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component="li"
        className="media-list scrollable-container"
        options={{
          wheelPropagation: false
        }}
      >
        {notificationsArray.map((item, index) => {
          return (
            <a
              key={index}
              className="d-flex"
              href={item.switch ? '#' : '/'}
              onClick={(e) => {
                if (!item.switch) {
                  e.preventDefault()
                }
              }}
            >
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
              >
                {!item.switch ? (
                  <Fragment>
                    <div className="me-1">
                      <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                          ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                          : item.avatarIcon
                          ? {
                              icon: item.avatarIcon,
                              color: item.color
                            }
                          : null)}
                      />
                    </div>
                    <div className="list-item-body flex-grow-1">
                      {item.title}
                      <small className="notification-text">
                        {item.subtitle}
                      </small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <Bell color="#4b4b4b" size={21} />
        <Badge pill color="danger" className="badge-up">
          0
        </Badge>
      </DropdownToggle>
      <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
        <li className="dropdown-menu-header">
          <DropdownItem className="d-flex" tag="div" header>
            <h4 className="notification-title mb-0 me-auto">Notifications</h4>
            <Badge tag="div" color="light-primary" pill>
              0 New
            </Badge>
          </DropdownItem>
        </li>
        {renderNotificationItems()}
        <li className="dropdown-menu-footer">
          <Button disabled color="primary" block>
            Read all notifications
          </Button>
        </li>
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
