import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { formatMana } from 'lib/utils'
import { auctionParamsType } from 'components/types'
import AtlasPage from 'components/AtlasPage'

import './AuctionFinishedPage.css'

export default class AuctionFinishedPage extends React.PureComponent {
  static propTypes = {
    onFetchAuctionParams: PropTypes.func.isRequired,
    onGoToMarketplace: PropTypes.func.isRequired,
    params: auctionParamsType
  }

  componentWillMount() {
    this.props.onFetchAuctionParams()
  }

  render() {
    const { params, onGoToMarketplace } = this.props
    const { landsBidded, totalManaBurned, endtTime } = params

    return (
      <React.Fragment>
        <AtlasPage />
        <div className="AuctionFinishedPage">
          <div className="message-wrapper">
            <h1 className="title">{t('auction_finished.title')}</h1>
            <div className="description">
              {t('auction_finished.description')}
              <br />
              {t('auction_finished.stats_title')}
              <div className="stats">
                <div className="stat">
                  <p>{landsBidded}</p>
                  <p>{t('auction_finished.land_sold')}</p>
                </div>
                <div className="stat">
                  <p>{formatMana(totalManaBurned, '')}</p>
                  <p>{t('auction_finished.mana_burned')}</p>
                </div>
                <div className="stat">
                  <p>{endtTime}</p>
                  <p>{t('global.duration')}</p>
                </div>
              </div>
            </div>
            <div className="actions">
              <Button primary={true} onClick={onGoToMarketplace}>
                {t('auction_finished.cta').toUpperCase()}
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
