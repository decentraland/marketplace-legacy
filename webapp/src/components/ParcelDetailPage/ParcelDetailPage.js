import React from 'react'
import PropTypes from 'prop-types'

import { locations } from 'locations'
import { Container } from 'semantic-ui-react'
import Navbar from 'components/Navbar'
import ParcelPreview from 'components/ParcelPreview'
import ParcelDetail from './ParcelDetail'
import Parcel from 'components/Parcel'

import './ParcelDetailPage.css'

export default class ParcelDetailPage extends React.PureComponent {
  static propTypes = {
    error: PropTypes.string,
    x: PropTypes.string.isRequired,
    y: PropTypes.string.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      return this.props.onNavigate(locations.root)
    }
  }

  render() {
    const { x, y, error } = this.props
    if (error) {
      return null
    }
    return (
      <div className="ParcelDetailPage">
        <Navbar />
        <Parcel x={x} y={y}>
          {(parcel, isOwner) => (
            <React.Fragment>
              <div className="parcel-preview">
                <ParcelPreview x={parcel.x} y={parcel.y} />
              </div>
              <Container>
                <ParcelDetail parcel={parcel} isOwner={isOwner} />
              </Container>
            </React.Fragment>
          )}
        </Parcel>
      </div>
    )
  }
}
