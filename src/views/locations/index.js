import React, { useEffect } from 'react'

// Third party
import classNames from 'classnames'
import { Card, CardBody } from 'reactstrap'

// Component
import Venue from '@ScreenComponent/locations/venue'

// ** Store
import { useDispatch, useSelector } from 'react-redux'
import { resetProvidersList } from '../../redux/provider/providerSlice'

function Locations() {
  const dispatch = useDispatch()
  const locationPending = useSelector((state) => state.locations.loading)

  useEffect(() => {
    return () => {
      dispatch(resetProvidersList())
    }
  }, [])

  return (
    <Card className="locations">
      <div className="p-2 pt-3 bg-yellow">
        <span className="heading-1">Locations</span>
      </div>

      <CardBody
        className={classNames({
          'bg-yellow': locationPending
        })}
      >
        <Venue />
      </CardBody>
    </Card>
  )
}

export default Locations
