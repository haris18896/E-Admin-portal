/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useCallback, useEffect } from 'react'

// ** Third Party Packages
import classNames from 'classnames'
import { Icon } from '@iconify/react'
import { Button, Card } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'

// ** Components
import RoomDetails from '@ScreenComponent/locations/create-location/room-details'
import LocationDetails from '@ScreenComponent/locations/create-location/locations-details'
import LocationTierSettings from '@ScreenComponent/locations/create-location/tier-setting'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import AddTierModal from '@ScreenComponent/locations/create-location/tier-setting/add-tier'
import { removeTierAction } from '@store/tiers/tiersAction'
import { resetProvidersList } from '../../../redux/provider/providerSlice'

function CreateLocation() {
  const dispatch = useDispatch()
  const { getAllTiersData, deleteTier, addPending } = useSelector(
    (state) => state.tiers
  )
  const tiers = getAllTiersData?.tiersList

  // ** states
  const [tab, setTab] = useState('Location Details'.toLowerCase().trim())
  const [addTierModal, setAddTierModal] = useState(false)

  const idx = useParams()
  const navigate = useNavigate()

  const handleAddTier = () => setAddTierModal(!addTierModal)

  useEffect(() => {
    return () => {
      dispatch(resetProvidersList())
    }
  }, [])

  return (
    <Card className="create-location">
      <div className="pt-3 p-2 bg-yellow page-header xSmall-up-between">
        <div className="page-header--title d-flex align-items-center">
          <Icon
            className="page-header--title__leftArrow"
            icon="bx:chevron-left"
            width="40"
            height="40"
            onClick={() => navigate(-1)}
          />
          <span className="heading-1">
            {idx?.id && tab === 'location details'
              ? 'Edit Location'
              : idx?.id && tab === 'room details'
              ? 'Room Details'
              : idx?.id && tab === 'tier setting'
              ? 'Tier Setting'
              : 'Create Location'}
          </span>
        </div>
        {tab === 'Tier Setting'.toLowerCase().trim() && (
          <div className="page-header--buttons_right">
            <Button
              className="button-green pd-s mb-1"
              onClick={() => handleAddTier()}
            >
              Add Tier
            </Button>
            <Button
              className="button-icon-delete pd-s mb-1"
              disabled={deleteTier || tiers.length === 0}
              onClick={() => {
                dispatch(
                  removeTierAction({
                    id: idx?.id,
                    tier_id: tiers[tiers.length - 1]?.id
                  })
                )
              }}
            >
              Remove Tier
            </Button>
          </div>
        )}
      </div>

      <div className="notes-and-forms--tabs bg-yellow">
        <div className="head--tabs notes-and-forms--tabs__tab">
          {[
            'Location Details',
            `${idx?.id && 'Room Details'}`,
            `${idx?.id && 'Tier Setting'}`
          ].map((item, index) => (
            <span
              key={index}
              className={classNames({
                'span-tabs ': true,
                'd-none': item === 'undefined',
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

      <Fragment>
        <AddTierModal
          open={addTierModal}
          handleOpen={handleAddTier}
          number={tiers.length}
          pending={addPending}
          id={idx?.id}
          lastTier={tiers[tiers.length - 1]}
        />
        <RenderTabs
          tab={tab}
          edit={idx?.id && true}
          id={idx?.id}
          rows={tiers}
          cancel={() => setTab('location details')}
        />
      </Fragment>
    </Card>
  )
}

export default CreateLocation

const RenderTabs = (props) => {
  switch (props.tab) {
    case 'location details':
      return <LocationDetails {...props} />
    case 'room details':
      return <RoomDetails {...props} />
    case 'tier setting':
      return <LocationTierSettings {...props} />

    default:
      break
  }
}
