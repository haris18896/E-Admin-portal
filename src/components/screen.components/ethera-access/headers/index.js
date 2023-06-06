/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import useJwt from '@src/auth/jwt/useJwt'

// components
import SelectField from '@select'

function AccessHeader({ locations, location, setLocation }) {
  const handleLocationChange = (e) => {
    setLocation(e)
    useJwt.setData('location', e.value)
  }

  return (
    <div className="pt-3 p-2 bg-yellow ethera-access--header">
      <div className="ethera-access--header__heading">
        <span className="heading-1">Ethera Access</span>
      </div>

      <div className="ethera-access--header__locations">
        <p className="p-heading-2 f-bold">Location:</p>
        <div className="ethera-access--header__locations--dropDown">
          <SelectField
            header
            defaultWidth="100%"
            wd="100%"
            menuHeight="20rem"
            className="ethera-access--header__locations--dropDown--select-field"
            search={false}
            controlMinWidth={'150px'}
            placeholder="Select Location..."
            value={location}
            data={locations}
            onChange={(e) => handleLocationChange(e)}
          />
        </div>
      </div>
    </div>
  )
}

export default AccessHeader
