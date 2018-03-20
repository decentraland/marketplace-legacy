import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import './Mana.css'

export default class Mana extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number,
    icon: PropTypes.node,
    unit: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number
  }

  static defaultProps = {
    unit: '',
    size: 14,
    scale: 1.2
  }

  getLocalizedAmount() {
    const { amount } = this.props

    if (amount >= 0) {
      return amount.toLocaleString()
    }
  }

  render() {
    const { size, scale, unit } = this.props

    const iconSize = Math.round(size * scale)
    const icon = this.props.icon || <Icon width={iconSize} height={iconSize} />
    const style = {
      fontSize: size
    }
    const amount = this.getLocalizedAmount()

    return (
      <span
        className="Mana"
        style={style}
        title={amount ? `${amount} MANA` : ''}
      >
        {icon} {amount ? `${amount} ${unit}` : null}
      </span>
    )
  }
}
