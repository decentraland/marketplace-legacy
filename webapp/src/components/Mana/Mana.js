import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import './Mana.css'

export default class Mana extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number,
    icon: PropTypes.node,
    unit: PropTypes.string,
    className: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number,
    disabled: PropTypes.bool,
    children: PropTypes.node
  }

  static defaultProps = {
    unit: '',
    size: 14,
    scale: 1.2,
    disabled: false,
    className: ''
  }

  getLocalizedAmount() {
    const { amount } = this.props

    if (amount >= 0) {
      return amount.toLocaleString()
    }
  }

  render() {
    const { size, scale, unit, disabled, className, ...rest } = this.props

    const iconSize = Math.round(size * scale)
    const icon = this.props.icon || <Icon width={iconSize} height={iconSize} />
    const amount = this.getLocalizedAmount()
    const classes = `Mana ${className}` + (disabled ? ' disabled' : '')
    return (
      <span
        className={classes}
        title={amount ? `${amount} MANA` : ''}
        {...rest}
      >
        {icon} {amount ? `${amount} ${unit}` : null}
      </span>
    )
  }
}
