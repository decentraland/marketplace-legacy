import React from 'react'
import { Card, Header, Button } from 'semantic-ui-react'
import { contributionType } from 'components/types'

import './Contribution.css'

export default class Publication extends React.PureComponent {
  static propTypes = {
    contribution: contributionType
  }
  render() {
    const { contribution } = this.props

    return (
      <Card className="Contribution">
        <Card.Content className="body">
          <Header size="medium">
            {contribution.district ? contribution.district.name : 'Loading...'}
          </Header>
          <Card.Meta>
            {contribution.district
              ? contribution.district.description
              : 'Loading...'}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <span className="footer">
            <Header size="medium" floated="left" className="land-count">
              <span className="amount">{contribution.land_count}</span>{' '}
              &nbsp;LAND
            </Header>
            <a
              href={contribution.district ? contribution.district.link : '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button floated="right" size="tiny">
                Proposal
              </Button>
            </a>
          </span>
        </Card.Content>
      </Card>
    )
  }
}
