import React from 'react'
import blockies from 'ethereum-blockies/blockies'

export default class Blockie extends React.Component {
  componentDidMount() {
    this.draw()
  }

  getOpts() {
    return {
      seed: this.props.seed,
      color: '#7ea9da',
      spotcolor: '#571b37',
      bgcolor: '#8b5ac2',
      size: 10,
      scale: 2
    }
  }

  draw() {
    blockies.render(this.getOpts(), this.canvas)
  }

  render() {
    return React.createElement('canvas', {
      ref: canvas => (this.canvas = canvas)
    })
  }
}
