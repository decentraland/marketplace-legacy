import React from 'react'
import PropTypes from 'prop-types'
import { Button, Loader } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { formatMana } from 'lib/utils'
import { AUCTION_DURATION_IN_DAYS } from 'modules/auction/utils'
import { auctionParamsType } from 'components/types'
import AtlasPage from 'components/AtlasPage'
import SignInNotice from 'components/SignInNotice'

import './AuctionFinishedPage.css'

export default class AuctionFinishedPage extends React.PureComponent {
  static propTypes = {
    onGoToMarketplace: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    isConnecting: PropTypes.bool.isRequired,
    params: auctionParamsType
  }

  getAuctionRealDuration = () => {
    const { startTime, endTime } = this.props.params
    const oneDayInSeconds = 60 * 60 * 24
    const durationInDays = (endTime - startTime) / oneDayInSeconds
    return `${
      durationInDays > AUCTION_DURATION_IN_DAYS
        ? AUCTION_DURATION_IN_DAYS
        : durationInDays
    } days`
  }

  render() {
    const { params, onGoToMarketplace, isConnecting, isConnected } = this.props
    const { totalLandsBidded, totalManaBurned } = params

    if (!isConnecting && !isConnected) {
      return (
        <div>
          <SignInNotice />
        </div>
      )
    }

    return (
      <React.Fragment>
        <AtlasPage />
        <div className="AuctionFinishedPage">
          <div className="message-wrapper">
            {isConnecting ||
            (totalLandsBidded == null && totalManaBurned == null) ? (
              <Loader active size="massive" />
            ) : (
              <React.Fragment>
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
                      <p>{this.getAuctionRealDuration()}</p>
                      <p>{t('global.duration')}</p>
                    </div>
                  </div>
                </div>
                <div className="actions">
                  <Button primary={true} onClick={onGoToMarketplace}>
                    {t('auction_finished.cta').toUpperCase()}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}
