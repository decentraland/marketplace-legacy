import React from 'react'
import PropTypes from 'prop-types'
import blockies from 'ethereum-blockies/blockies'

export default class Blockie extends React.Component {
  static propTypes = {
    seed: PropTypes.string.isRequired,
    color: PropTypes.string,
    spotcolor: PropTypes.string,
    bgcolor: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number
  }

  static defaultProps = {
    color: '#7ea9da',
    bgcolor: '#8b5ac2',
    size: 10,
    scale: 2
  }

  componentDidMount() {
    this.draw()
  }

  getOpts() {
    const { seed, color, spotcolor, bgcolor, size, scale } = this.props

    return {
      seed,
      color,
      spotcolor,
      bgcolor,
      size,
      scale
    }
  }

  draw() {
    blockies.render(this.getOpts(), this.canvas)
  }

  render() {
    return React.createElement('canvas', {
      className: 'Blockie',
      ref: canvas => (this.canvas = canvas)
    })
  }
}
