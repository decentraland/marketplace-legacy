import React from 'react'
import PropTypes from 'prop-types'

import ParcelModal from 'components/ParcelModal'
import ParcelDetailLink from 'components/ParcelDetailLink'
import Parcel from 'components/Parcel'
import Mana from 'components/Mana'
import {
  walletType,
  authorizationType,
  publicationType
} from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import {
  BuyWarningMessage,
  Loading,
  NotConnected
} from 'components/BuyAssetPage'
import { getCurrentAllowance } from 'modules/authorization/utils'
import './BuyParcelPage.css'

export default class BuyParcelPage extends React.PureComponent {
  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    wallet: walletType,
    authorization: authorizationType,
    publication: publicationType,
    isDisabled: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isConnected: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  handleConfirm = () => {
    const { publication, onConfirm } = this.props
    onConfirm(publication)
  }

  renderPage() {
    const {
      x,
      y,
      wallet,
      publication,
      authorization,
      isDisabled,
      isTxIdle,
      onCancel
    } = this.props
    const { balance } = wallet

    return (
      <Parcel x={x} y={y} ownerNotAllowed withPublications>
        {parcel => {
          if (publication) {
            // to avoid a race condition we expect a valid publication
            const allowance = getCurrentAllowance(publication, authorization)

            const price = parseFloat(publication.price)

            const isNotEnoughMana = balance < price
            const isNotEnoughAllowance = allowance < price
            return (
              <div className="BuyParcelPage">
                {(isNotEnoughMana || isNotEnoughAllowance) && (
                  <BuyWarningMessage
                    publication={publication}
                    wallet={wallet}
                    allowance={allowance}
                  />
                )}
                <ParcelModal
                  x={x}
                  y={y}
                  title={t('asset_buy.buy_asset', {
                    asset_type: t('name.parcel')
                  })}
                  subtitle={
                    <T
                      id="asset_buy.about_to_buy"
                      values={{
                        name: <ParcelDetailLink parcel={parcel} />,
                        price: (
                          <React.Fragment>
                            &nbsp;{t('global.for')}&nbsp;&nbsp;
                            <span
                              style={{
                                display: 'inline-block',
                                transform: 'translateY(3px)'
                              }}
                            >
                              <Mana amount={publication.price} size={14} />
                            </span>
                          </React.Fragment>
                        )
                      }}
                    />
                  }
                  onCancel={onCancel}
                  onConfirm={this.handleConfirm}
                  isDisabled={
                    isDisabled || isNotEnoughMana || isNotEnoughAllowance
                  }
                  isTxIdle={isTxIdle}
                />
              </div>
            )
          }
          return null
        }}
      </Parcel>
    )
  }

  render() {
    const { isConnected, isLoading } = this.props

    if (isLoading) {
      return <Loading />
    }

    if (!isConnected) {
      return <NotConnected assetType={t('name.estate')} />
    }

    return this.renderPage()
  }
}
