import React from 'react'
import AddressLink from 'components/AddressLink'
import { walletType } from 'components/types'
import Mana from 'components/Mana'
import { locations } from 'locations'

import './Account.css'

export default class Account extends React.PureComponent {
  static propTypes = {
    wallet: walletType
  }
  render() {
    const { wallet } = this.props
    if (!wallet || !wallet.address || wallet.balance == null) {
      return null
    }
    return (
      <span className="Account">
        <Mana amount={wallet.balance} />
        <AddressLink
          scale={6}
          link={locations.settings}
          address={wallet.address}
          hasTooltip={false}
        />
      </span>
    )
  }
}
