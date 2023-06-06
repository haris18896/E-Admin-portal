import React from 'react'

import PropTypes from 'prop-types'
import classNames from 'classnames'

import Avatar from '@components/avatar'
import defaultAvatar from '@src/assets/default.png'

function Chat({ isSender, messages }) {
  return (
    <div
      className={classNames({
        'message_modal--messages--chats__content--left': !isSender,
        'message_modal--messages--chats__content--right': isSender
      })}
    >
      <section>
        <Avatar
          img={defaultAvatar}
          imgHeight="40"
          imgWidth="40"
          // status="offline"
        />
        <div>
          {messages.map((item, index) => (
            <section key={index}>
              <p className='p-heading-2 t-g-b'>{item.msg}</p>
              <span className='message_modal--messages--chats__content--time'>{item.time}</span>
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Chat

Chat.propTypes = {
  isSender: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.shape({ msg: PropTypes.string, time: PropTypes.string }))
}
