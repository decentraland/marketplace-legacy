import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'semantic-ui-react'
import { hasPublication } from 'lib/parcelUtils'
import { parcelType, publicationType } from 'components/types'
import { t } from 'modules/translation/utils'
import { locations } from 'locations'

import './ParcelActions.css'

export default class ParcelActions extends React.PureComponent {
  static propTypes = {
    parcel: parcelType.isRequired,
    publications: PropTypes.objectOf(publicationType),
    onTransfer: PropTypes.func.isRequired,
    isOwner: PropTypes.bool
  }

  handleTransfer = () => {
    const { parcel, onTransfer } = this.props
    onTransfer(parcel)
  }

  handleEdit = () => {
    const { parcel, onEdit } = this.props
    onEdit(parcel)
  }

  isOnSale() {
    const { parcel, publications } = this.props
    return hasPublication(parcel, publications)
  }

  handleSell = () => {
    const { parcel, onSell, onCancelSale } = this.props
    if (this.isOnSale()) {
      onCancelSale(parcel)
    } else {
      onSell(parcel)
    }
  }

  render() {
    const { parcel, isOwner } = this.props
    if (!parcel) {
      return null
    }
    const { x, y } = parcel
    return (
      <span className="ParcelActions">
        {isOwner ? (
          <React.Fragment>
            <Link to={locations.editLand(x, y)}>
              <Button size="tiny">
                <Icon name="edit" />
                {t('parcel_detail.actions.edit')}
              </Button>
            </Link>
            <Link to={locations.transferLand(x, y)}>
              <Button size="tiny">
                <Icon name="exchange" />
                {t('parcel_detail.actions.transfer')}
              </Button>
            </Link>
            {this.isOnSale() ? (
              <Link to={locations.cancelSaleLand(x, y)}>
                <Button size="tiny">
                  <Icon name="cancel" />
                  {t('parcel_detail.actions.cancel')}
                </Button>
              </Link>
            ) : (
              <Link to={locations.sellLand(x, y)}>
                <Button size="tiny">
                  <Icon name="tag" />
                  {t('parcel_detail.actions.sell')}
                </Button>
              </Link>
            )}
          </React.Fragment>
        ) : this.isOnSale() ? (
          <Link to={locations.buyLand(x, y)}>
            <Button primary size="large">
              {t('parcel_detail.publication.buy')}
            </Button>
          </Link>
        ) : null}
      </span>
    )
  }
}
