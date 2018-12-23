import React from 'react'
import PropTypes from 'prop-types'
import { Button, Loader } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { formatMana } from 'lib/utils'
import { getAuctionRealDuration } from 'modules/auction/utils'
import { auctionParamsType } from 'components/types'
import AuctionStaticPage from 'components/AuctionStaticPage'
import SignInNotice from 'components/SignInNotice'

import './AuctionFinishedPage.css'

export default class AuctionFinishedPage extends React.PureComponent {
  static propTypes = {
    onNavigateToMarketplace: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    params: auctionParamsType
  }

  render() {
    const {
      params,
      onNavigateToMarketplace,
      isConnecting,
      isConnected
    } = this.props
    const { totalLandsBidded, totalManaBurned, endTime } = params

    if (!isConnecting && !isConnected) {
      return (
        <div>
          <SignInNotice />
        </div>
      )
    }

    const duration = getAuctionRealDuration(endTime)
    const realDuration = duration > 0 ? duration : 14

    return (
      <AuctionStaticPage>
        {isConnecting ||
        (totalLandsBidded == null && totalManaBurned == null) ? (
          <Loader active size="massive" />
        ) : (
          <div className="AuctionFinishedPage">
            <h1 className="title">{t('auction_finished.title')}</h1>
            <div className="description">
              {t('auction_finished.description')}
              <br />
              {t('auction_finished.stats_title')}
              <div className="stats">
                <div className="stat">
                  <p>{parseInt(totalLandsBidded)}</p>
                  <p>{t('auction_finished.land_sold')}</p>
                </div>
                <div className="stat">
                  <p>{formatMana(parseInt(totalManaBurned), '')}</p>
                  <p>{t('auction_finished.mana_burned')}</p>
                </div>
                <div className="stat">
                  <p>{realDuration}</p>
                  <p>{t('global.duration')}</p>
                </div>
              </div>
            </div>
            <div className="actions">
              <Button primary={true} onClick={onNavigateToMarketplace}>
                {t('auction_finished.cta').toUpperCase()}
              </Button>
            </div>
          </div>
        )}
      </AuctionStaticPage>
    )
  }
}
