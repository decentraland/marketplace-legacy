import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Grid, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import { walletType, publicationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { formatMana } from 'lib/utils'
import { isLegacyPublication } from 'modules/publication/utils'

export default class BuyWarningMessage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    publication: publicationType,
    allowance: PropTypes.number.isRequired
  }

  render() {
    const { wallet, publication, allowance } = this.props
    const { balance } = wallet

    const isNotEnoughMana = balance < parseFloat(publication.price)
    const isMarketplaceAllowed = allowance > 0
    const isLegacyMarketplace = isLegacyPublication(publication)

    return (
      <Container text>
        <Grid.Column>
          <Message
            warning
            icon="warning sign"
            header={
              isNotEnoughMana
                ? t('asset_buy.total_balance', {
                    balance: formatMana(balance)
                  })
                : isMarketplaceAllowed
                  ? t('asset_buy.allowed_balance', {
                      allowance: formatMana(allowance)
                    })
                  : isLegacyMarketplace
                    ? t('asset_buy.didnt_allow')
                    : t('asset_buy.didnt_allow_new_marketplace')
            }
            content={
              isNotEnoughMana ? (
                <React.Fragment>
                  <span>
                    {t('asset_buy.needs_at_least', {
                      mana: formatMana(publication.price),
                      asset_type: t('name.estate')
                    })}
                  </span>
                  <br />
                  <T
                    id="asset_buy.buy_mana"
                    values={{
                      click_here: (
                        <Link to={locations.buyMana()}>
                          {t('global.click_here')}
                        </Link>
                      )
                    }}
                  />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {isMarketplaceAllowed ? (
                    <span>
                      {t('asset_buy.needs_at_least', {
                        mana: formatMana(publication.price)
                      })}
                      <br />
                    </span>
                  ) : null}
                  <T
                    id={
                      isLegacyMarketplace
                        ? 'asset_buy.please_allow'
                        : 'asset_buy.please_allow_new_marketplace'
                    }
                    values={{
                      settings_link: (
                        <Link to={locations.settings()}>
                          {t('global.settings')}
                        </Link>
                      )
                    }}
                  />
                </React.Fragment>
              )
            }
          />
        </Grid.Column>
      </Container>
    )
  }
}
