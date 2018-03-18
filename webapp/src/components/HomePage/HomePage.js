import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Button, Icon } from 'semantic-ui-react'
import Publication from 'components/MarketplacePage/Publication'
import { locations } from 'locations'
import { t } from 'modules/translation/utils'

import './HomePage.css'

export default class HomePage extends React.PureComponent {
  componentWillMount() {
    const { onFetchPublications } = this.props
    onFetchPublications()
  }

  render() {
    const { publications } = this.props
    return (
      <div className="HomePage">
        <div className="hero-image" />
        <div className="hero-text">
          <h1>{t('homepage.hero_title')}</h1>
          <p>{t('homepage.hero_subtitle')}</p>
          <Link to={locations.parcelMapDetail(0, 0)}>
            <Button primary>{t('homepage.get_started')}</Button>
          </Link>
        </div>
        <Container className="publications">
          <div className="publications-header">
            <h3>{t('homepage.newest_lands')}</h3>
            <Link to={locations.marketplace}>
              <span role="button" onClick={this.handleNext}>
                {t('homepage.view_more')}&nbsp;<Icon name="chevron right" />
              </span>
            </Link>
          </div>
          <div className="publications-scroller">
            {publications.map(publication => (
              <Publication
                key={publication.tx_hash}
                publication={publication}
              />
            ))}
          </div>
        </Container>
      </div>
    )
  }
}
