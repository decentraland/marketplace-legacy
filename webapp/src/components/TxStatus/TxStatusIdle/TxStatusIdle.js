import React from 'react'
import PropTypes from 'prop-types'
import { Message, Icon } from 'semantic-ui-react'

export default class TxStatusIdle extends React.PureComponent {
  static propTypes = {
    isIdle: PropTypes.bool.isRequired
  }

  render() {
    const { isIdle } = this.props

    return isIdle ? (
      <Message icon>
        <Icon name="circle notched" loading />
        <Message.Content>Please confirm the transaction</Message.Content>
      </Message>
    ) : null
  }
}
