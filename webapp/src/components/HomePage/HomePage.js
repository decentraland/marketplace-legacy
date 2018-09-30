import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Button, Icon } from 'semantic-ui-react'

import { locations } from 'locations'
import { parcelType } from 'components/types'
import ParcelCard from 'components/ParcelCard'
import { t } from '@dapps/modules/translation/utils'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  static propTypes = {
    parcels: PropTypes.arrayOf(parcelType)
  }

  componentWillMount() {
    const { onFetchPublications } = this.props
    onFetchPublications()
  }

  render() {
    const { parcels } = this.props

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
          <div className="publications-header">
            <h3>{t('homepage.newest_lands')}</h3>
            <Link to={locations.marketplacePageDefault()}>
              <span role="button" onClick={this.handleNext}>
                {t('homepage.view_more')}&nbsp;<Icon name="chevron right" />
              </span>
            </Link>
          </div>
          <div className="publications-scroller">
            {parcels.map(parcel => (
              <ParcelCard key={parcel.id} parcel={parcel} />
            ))}
          </div>
        </Container>
      </div>
    )
  }
}
