import React from 'react'
import PropTypes from 'prop-types'

import Estate from 'components/Estate'
import EstateModal from 'components/EstateDetailPage/EditEstateMetadata/EstateModal'
import EstateName from 'components/EstateName'
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

import './BuyEstatePage.css'

export default class BuyEstatePage extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
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
      id,
      wallet,
      publication,
      isDisabled,
      isTxIdle,
      onCancel,
      authorization
    } = this.props
    const { balance } = wallet

    return (
      <Estate id={id} ownerNotAllowed withPublications>
        {estate => {
          if (publication) {
            // to avoid a race condition we expect a valid publication
            const allowance = getCurrentAllowance(publication, authorization)

            const price = parseFloat(publication.price)

            const isNotEnoughMana = balance < price
            const isNotEnoughAllowance = allowance < price
            return (
              <div className="BuyEstatePage">
                {(isNotEnoughMana || isNotEnoughAllowance) && (
                  <BuyWarningMessage
                    publication={publication}
                    wallet={wallet}
                    allowance={allowance}
                  />
                )}
                <EstateModal
                  parcels={estate.data.parcels}
                  title={t('asset_buy.buy_asset', {
                    asset_type: t('name.estate')
                  })}
                  subtitle={
                    <T
                      id="asset_buy.about_to_buy"
                      values={{
                        name: <EstateName estate={estate} />,
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
      </Estate>
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
