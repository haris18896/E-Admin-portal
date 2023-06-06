 import React, { useState } from 'react'

// Third Party Packages
import classNames from 'classnames'
import { Card, CardBody } from 'reactstrap'

// components
import AdminAccountsTab from '@ScreenComponent/system/admin-accounts'

function System() {
  const [tab, setTab] = useState('Admin Accounts'.toLowerCase().trim())

  return (
    <Card className="system-settings">
      <div className="p-2 pt-3 bg-yellow">
        <span className="heading-1">System Setting</span>
      </div>

      <div className="notes-and-forms--tabs bg-yellow">
        <div className="head--tabs notes-and-forms--tabs__tab">
          {['Admin Accounts'].map((item, index) => (
            <span
              key={index}
              className={classNames({
                'span-tabs ': true,
                'head--tabs__selected white-border':
                  tab === item.toLowerCase().trim()
              })}
              onClick={() => setTab(item.toLowerCase().trim())}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <CardBody>{tab === 'admin accounts' && <AdminAccountsTab />}</CardBody>
    </Card>
  )
}

export default System
