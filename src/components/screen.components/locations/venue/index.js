/* eslint-disable no-useless-return */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import themeConfig from '@configs/themeConfig'
import logo from '@src/assets/images/logo/logo.png'
import EtheraBuilding from '@src/assets/etheraImgs/brand/etheraBuilding1.jpeg'
// Third Party Packages
import { Icon } from '@iconify/react'
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  CardText,
  CardImg,
  Row,
  Col
} from 'reactstrap'

// components
import Spinner from '@spinner'
import { venues } from './constants'
import { useNavigate } from 'react-router-dom'
import {
  getAllLocationsAction,
  getLocationAction
} from '../../../../redux/locations/locationsAction'
import { useDispatch, useSelector } from 'react-redux'

function Venue() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading, getAllLocations } = useSelector((state) => state.locations)
  const rows = getAllLocations.locationsList

  useEffect(() => {
    dispatch(getAllLocationsAction())
  }, [])

  const handleLocationDetail = (idx) => {
    navigate(`/locations/create-location/${idx}`)
  }

  return (
    <Row className="match-height">
      {/* {loading ? (<Spinner />) : {}} */}

      {loading ? (
        <Spinner />
      ) : !!rows?.length ? (
        rows.map((venue, index) => (
          <Col lg="4" md="6" key={index}>
            <Card className="locations--card skin-change">
              <CardImg
                top
                style={{ height: '300px', objectFit: 'cover' }}
                width={100}
                src={venue?.image || EtheraBuilding}
                alt="Card cap"
                onError={(e) => {
                  if (e.target.onerror) {
                    e.target.onerror = null
                  }
                  e.target.src = `${EtheraBuilding}`
                  return
                }}
              />
              <CardBody className="locations--card__body">
                <CardTitle tag="h4">{venue.name}</CardTitle>
                <CardText>
                  Total Space : <strong>{venue.total_rooms}</strong>
                </CardText>
                <Button
                  className="button-gray pd"
                  onClick={() => handleLocationDetail(venue?.id)}
                >
                  Location Details
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))
      ) : (
        null
      )}

      {!loading && (
        <Col lg="4" md="6" className="align-self-center">
          <div
            className="locations--addVenue"
            onClick={() => navigate('/locations/create-location')}
          >
            <Icon icon="typcn:plus" width="25" height="25" />
            <p>
              Add <br />
              Location
            </p>
          </div>
        </Col>
      )}
    </Row>
  )
}

export default Venue
