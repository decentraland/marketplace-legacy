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
    color: '#5d5890',
    bgcolor: '#3e396b',
    spotcolor: '#9794bf',
    size: 10,
    scale: 2
  }

  componentDidMount() {
    this.draw()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.seed !== nextProps.seed) {
      this.shouldRefresh = true
    }
  }

  componentDidUpdate() {
    if (this.shouldRefresh) {
      this.shouldRefresh = false
      this.draw()
    }
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
    const { size, scale } = this.props
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0, 0, size * scale, size * scale)
    blockies.render(this.getOpts(), this.canvas)
  }

  render() {
    return React.createElement('canvas', {
      className: 'Blockie',
      ref: canvas => (this.canvas = canvas)
    })
  }
}
