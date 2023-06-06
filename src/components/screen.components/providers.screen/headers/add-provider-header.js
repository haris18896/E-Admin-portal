/* eslint-disable no-unused-vars */
import React from 'react'

// components
import { Button } from 'reactstrap'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

function AddProviderHeader({ editProvider, name, created_at, loading }) {
  const navigate = useNavigate()

  return (
    <div className="pt-3 p-2 bg-yellow provider--header__editScreen">
      <div className="provider--header__editScreen--title">
        <div className="provider--header__editScreen--title__name">
          {editProvider && (
            <Icon
              className="page-header--title__leftArrow"
              icon="bx:chevron-left"
              width="40"
              height="40"
              onClick={() => navigate(-1)}
            />
          )}
          <span className="heading-2 whiteSpace">
            {editProvider ? 'Edit Provider' : 'Add new Provider'}
          </span>
        </div>

        {editProvider && name && (
          <>
            <div className="EditClient provider--header__editScreen--title__providerName">
              <span className="heading-3 whiteSpace">{name || ''}</span>
            </div>
            {created_at !== undefined && (
              <span className="heading-3 px-1">
                {moment.unix(created_at).format('MM/DD/YYYY') || 'loading...'}
              </span>
            )}
          </>
        )}
      </div>
      <div className="provider--header__editScreen--button">
        <Button
          className="button-cancel"
          onClick={() => navigate('/providers')}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

export default AddProviderHeader
