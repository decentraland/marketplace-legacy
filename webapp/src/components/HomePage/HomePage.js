import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Button, Icon } from 'semantic-ui-react'
import { t } from '@dapps/modules/translation/utils'

import { locations } from 'locations'
import { isFeatureEnabled } from 'lib/featureUtils'
import { hasAuctionStarted } from 'modules/auction/utils'
import { assetType } from 'components/types'
import AssetCard from 'components/AssetCard'
import AuctionCountdown from 'components/AuctionCountdown'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    assets: PropTypes.arrayOf(assetType)
  }

  componentWillMount() {
    this.props.onFetchPublications()
  }

  onLearnMore = () => {
    const { onNavigate } = this.props
    onNavigate(locations.auction())
  }

  render() {
    const { assets } = this.props

    return (
      <div className="HomePage">
        <div className="hero-image" />
        <div className="hero-text">
          <h1>{t('homepage.hero_title')}</h1>
          <p>{t('homepage.hero_subtitle')}</p>
          <Link to={locations.parcelMapDetail(0, 0)}>
            <Button primary>{t('homepage.get_started')}</Button>
          </Link>
          <a className="tutorial-link" href="https://youtu.be/uyuaN1OdOh4">
            {t('homepage.watch_tutorial')}
          </a>
        </div>
        <Container className="publications">
          <div className="gap" />
          {isFeatureEnabled('AUCTION') &&
            !hasAuctionStarted() && (
              <div className="banner-wrapper">
                <AuctionCountdown isBanner={true}>
                  <Button primary={true} onClick={this.onLearnMore}>
                    {t('global.learn_more').toUpperCase()}
                  </Button>
                </AuctionCountdown>
              </div>
            )}
          <div className="publications-header">
            <h3>{t('homepage.newest_lands')}</h3>
            <Link to={locations.marketplace()}>
              <span role="button" onClick={this.handleNext}>
                {t('homepage.view_more')}&nbsp;<Icon name="chevron right" />
              </span>
            </Link>
          </div>
          <div className="publications-scroller">
            {assets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
          </div>
        </Container>
      </div>
    )
  }
}
