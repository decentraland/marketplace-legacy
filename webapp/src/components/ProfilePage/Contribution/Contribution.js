import React from 'react'
import { Card, Header, Button, Icon } from 'semantic-ui-react'
import { contributionType } from 'components/types'
import LandAmount from 'components/LandAmount'
import { t } from '@dapps/modules/translation/utils'

import './Contribution.css'

export default class Contribution extends React.PureComponent {
  static propTypes = {
    contribution: contributionType
  }

  renderProposalButton() {
    const { contribution } = this.props

    let proposalButton = (
      <Button floated="right" size="tiny" disabled={!contribution.district}>
        {t('contribution.proposal')}
      </Button>
    )

    if (contribution.district) {
      proposalButton = (
        <a
          href={contribution.district.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {proposalButton}
        </a>
      )
    }

    return proposalButton
  }

  render() {
    const { contribution } = this.props

    return (
      <Card
        className="Contribution"
        href={contribution.district ? contribution.district.link : undefined}
      >
        <Card.Content className="body">
          {contribution.district ? (
            <React.Fragment>
              <Header size="medium">{contribution.district.name}</Header>
              <Card.Meta>{contribution.district.description}</Card.Meta>
              <LandAmount value={contribution.land_count} />
            </React.Fragment>
          ) : (
            <div className="text-center">
              <Icon name="circle notched" size="big" loading />
            </div>
          )}
        </Card.Content>
      </Card>
    )
  }
}
