import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, Message } from 'semantic-ui-react'

import { locations } from 'locations'
import { walletType, publicationType } from 'components/types'
import { t, T } from '@dapps/modules/translation/utils'
import { formatMana } from 'lib/utils'

export default class BuyWarningMessage extends React.PureComponent {
  static propTypes = {
    wallet: walletType,
    publication: publicationType
  }

  render() {
    const { wallet, publication } = this.props
    const { balance } = wallet
    const allowance = this.getCurrentAllowance()

    const isNotEnoughMana = balance < parseFloat(publication.price)
    const isMarketplaceAllowed = allowance > 0

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
                  : this.isLegacyMarketplace()
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
                      this.isLegacyMarketplace()
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
