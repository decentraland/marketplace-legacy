import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import './Mana.css'

export default class Mana extends React.PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    icon: PropTypes.node,
    unit: PropTypes.string,
    size: PropTypes.number,
    scale: PropTypes.number
  }

  static defaultProps = {
    size: 14,
    scale: 1.2
  }
  render() {
    const { amount, size, scale, unit } = this.props
    const iconSize = Math.round(size * scale)
    const icon = this.props.icon || <Icon width={iconSize} height={iconSize} />
    const style = {
      fontSize: size
    }
    const localizedAmount = amount.toLocaleString()
    return (
      <span className="Mana" style={style} title={`${localizedAmount} MANA`}>
        {icon} {localizedAmount} {unit}
      </span>
    )
  }
}
