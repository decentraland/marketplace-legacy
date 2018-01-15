import React, { Component } from 'react'
import blockies from 'ethereum-blockies/blockies'

class Blockie extends Component {
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
  componentDidMount() {
    this.draw()
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

export default Blockie
