import React from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'

import { parcelType } from 'components/types'
import ParcelCoord from './ParcelCoord'
import './ParcelCoords.css'

export default class ParcelCoords extends React.PureComponent {
  static propTypes = {
    ...ParcelCoord.propTypes,
    parcels: PropTypes.arrayOf(parcelType),
    maxHeight: PropTypes.number,
    children: PropTypes.node
  }

  static defaultProps = {
    maxHeight: 60
  }

  constructor(props) {
    super(props)
    this.wrapperElement = null
    this.debouncedSetCollapsableUsingHeight = debounce(
      this.setCollapsableUsingHeight,
      200
    )

    this.state = {
      isCollapsed: true,
      isCollapsable: false
    }
  }

  toggleSeeMore = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed })
  }

  componentWillMount() {
    window.addEventListener('resize', this.debouncedSetCollapsableUsingHeight)
  }

  componentWillUnmount() {
    window.removeEventListener(
      'resize',
      this.debouncedSetCollapsableUsingHeight
    )
  }

  setWrapperElement = wrapperElement => {
    this.wrapperElement = wrapperElement
    this.setCollapsableUsingHeight()
  }

  setCollapsableUsingHeight = () => {
    const { maxHeight } = this.props
    const isCollapsable =
      maxHeight && this.wrapperElement.offsetHeight > maxHeight

    this.setState({ isCollapsable })
  }

  render() {
    const { parcels, maxHeight, children, ...parcelCoordProps } = this.props
    const { isCollapsable, isCollapsed } = this.state

    return (
      <div className="ParcelCoords">
        <div
          className="see-more-wrapper"
          style={{
            maxHeight: isCollapsable && isCollapsed ? `${maxHeight}px` : '100%'
          }}
        >
          <div
            className="see-more-wrap parcels-included"
            ref={this.setWrapperElement}
          >
            {children ||
              parcels.map((parcel, index) => (
                <ParcelCoord
                  key={index}
                  parcel={parcel}
                  {...parcelCoordProps}
                />
              ))}
          </div>
        </div>
        {isCollapsable ? (
          <div className="link see-more-trigger" onClick={this.toggleSeeMore}>
            {isCollapsed ? 'See more' : 'See less'}
          </div>
        ) : null}
      </div>
    )
  }
}
