import React from 'react'
import PropTypes from 'prop-types'
import { eth } from 'decentraland-eth'
import { Button, Form, Loader } from 'semantic-ui-react'
import { parcelType } from 'components/types'
import TxStatus from 'components/TxStatus'
import AddressInput from 'components/AddressInput'
import { getUpdateOperator } from 'lib/parcelUtils'
import { preventDefault, shortenAddress } from 'lib/utils'
import { t } from 'modules/translation/utils'

import './ManageParcelForm.css'
import AddressBlock from 'components/AddressBlock'

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
      loading: false,
      editing: false,
      revoked: false,
      dirty: false
    }
  }

  async componentWillMount() {
    this.setState({ loading: true })
    const { parcel } = this.props
    const address = await getUpdateOperator(parcel.x, parcel.y)
    if (address != null) {
      this.setState({ address, loading: false, editing: true })
    } else {
      this.setState({ loading: false })
    }
  }

  handleAddressChange = address => {
    this.setState({ address, dirty: true })
  }

  handleRevoke = () => {
    this.setState({ revoked: true, dirty: true })
  }

  handleChange = () => {
    this.setState({
      address: '',
      editing: false
    })
  }

  handleSubmit = () => {
    const { parcel } = this.props
    const { address, revoked } = this.state
    const safeAddress = address.trim().toLowerCase()
    this.props.onSubmit(parcel, safeAddress, revoked)
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  isEmptyAddress() {
    return this.state.address.trim() === ''
  }

  renderLoading() {
    return (
      <div className="loader-wrapper">
        <Loader active />
      </div>
    )
  }

  renderEditOperatorForm() {
    const { address, revoked } = this.state
    return (
      <React.Fragment>
        <label>{t('parcel_manage.address')}</label>
        <div className={revoked ? 'address-input revoked' : 'address-input'}>
          <div className="address-wrapper">
            <AddressBlock
              address={address}
              hasTooltip={false}
              hasLink={false}
            />
            <span className="address-label">{shortenAddress(address)}</span>
          </div>
          {revoked ? null : (
            <div className="address-actions">
              <Button
                size="tiny"
                className="link"
                onClick={this.handleChange}
                type="button"
              >
                {t('global.change')}
              </Button>
              <Button size="tiny" className="link" onClick={this.handleRevoke}>
                {t('global.revoke')}
              </Button>
            </div>
          )}
        </div>
      </React.Fragment>
    )
  }

  renderSetOperatorForm() {
    const { address, loading } = this.state
    return (
      <React.Fragment>
        <AddressInput
          label={t('parcel_manage.address')}
          address={address}
          onChange={this.handleAddressChange}
          disabled={loading}
        />
        <span className="transfer-warning">
          {t('parcel_manage.address_permission')}
        </span>
        <br />
        <span className="transfer-warning">
          {t('parcel_manage.check_address')}
        </span>
        <br />
      </React.Fragment>
    )
  }

  render() {
    const { isTxIdle } = this.props
    const { address, loading, dirty } = this.state

    if (loading) {
      return this.renderLoading()
    }

    return (
      <Form
        className="ManageParcelForm"
        onSubmit={preventDefault(this.handleSubmit)}
      >
        <Form.Field>
          {this.state.editing
            ? this.renderEditOperatorForm()
            : this.renderSetOperatorForm()}
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
            disabled={
              this.isEmptyAddress() ||
              isTxIdle ||
              loading ||
              !dirty ||
              !eth.utils.isValidAddress(address)
            }
          >
            {t('global.submit')}
          </Button>
        </div>
      </Form>
    )
  }
}
