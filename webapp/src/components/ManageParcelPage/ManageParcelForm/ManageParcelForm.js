import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'

import { Button, Form, Input } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import { preventDefault } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './ManageParcelForm.css'

export default class ManageParcelForm extends React.PureComponent {
  static propTypes = {
    parcel: parcelType,
    isTxIdle: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      address: '',
      loading: false
    }
  }

  isValidAddress(address) {
    return
  }

  async componentWillMount() {
    try {
      this.setState({ loading: true })
      const { parcel } = this.props
      const contract = eth.getContract('LANDRegistry')
      const assetId = await contract.encodeTokenId(parcel.x, parcel.y)
      const address = await contract.updateOperator(assetId)
      if (
        eth.utils.isValidAddress(address) &&
        address !== '0x0000000000000000000000000000000000000000'
      ) {
        this.setState({ address, loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      console.error('Error fetching updateOperator:', error.message)
      this.setState({ loading: false })
    }
  }

  handleAddressChange = e => {
    const { address } = this.state
    const newAddress = e.currentTarget.value

    if (address !== newAddress.toLowerCase()) {
      this.setState({ address: newAddress })
    }
  }

  handleSubmit = () => {
    const { parcel } = this.props
    const newAddress = this.state.address.trim().toLowerCase()
    this.props.onSubmit(parcel, newAddress)
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  isEmptyAddress() {
    return this.state.address.trim() === ''
  }

  render() {
    const { isTxIdle } = this.props
    const { address } = this.state

    return (
      <Form
        className="ManageParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          <label>{t('parcel_manage.address')}</label>
          <Input
            id="address-input"
            className="address-input"
            type="text"
            placeholder={
              this.state.loading
                ? `${t('global.loading')}...`
                : t('parcel_manage.placeholder', {
                    address: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942'
                  })
            }
            value={address}
            onChange={this.handleAddressChange}
            autoComplete="off"
            autoFocus={true}
            disabled={this.state.loading}
          />
          <span className="transfer-warning">
            {t('parcel_manage.address_permission')}
          </span>
          <br />
          <span className="transfer-warning">
            {t('parcel_manage.check_address')}
          </span>
          <br />
          <TxStatus.Idle isIdle={isTxIdle} />
        </Form.Field>

        <br />

        <div>
          <Button type="button" onClick={this.handleCancel}>
            {t('global.cancel')}
          </Button>

          <Button
            type="submit"
            primary={true}
            disabled={this.isEmptyAddress() || isTxIdle || this.state.loading}
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
