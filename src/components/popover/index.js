import classNames from 'classnames'
import React from 'react'
import { X } from 'react-feather'
import { UncontrolledPopover, PopoverHeader, PopoverBody } from 'reactstrap'

export const Popup = ({event, target, body, popoverClassName }) => {
  const CloseBtn = <X className='pointer' size={15} onClick={() => document.body.click()} />

    if (!target) {
      return null
    }
    return (
      <UncontrolledPopover trigger='legacy' placement='auto' target={target} className={classNames({
        [popoverClassName] : popoverClassName
      })}>
        <PopoverHeader>
          <div className='Popover-custom-header'>
            <span>{event}</span>
            {CloseBtn}
          </div>
        </PopoverHeader>
        <PopoverBody>{body}</PopoverBody>
      </UncontrolledPopover>
    )
  }
