import React from 'react'
import PropTypes from 'prop-types'
import { Button, Loader, Icon } from 'semantic-ui-react'
import { eth } from 'decentraland-eth'
import { t, T } from '@dapps/modules/translation/utils'

import ContractLink from 'components/ContractLink'
import { parcelType } from 'components/types'
import {
  TOKEN_SYMBOLS,
  TOKEN_ADDRESSES,
  parseFloatWithDecimal
} from 'modules/auction/utils'
import { token } from 'lib/token'
import { etherscan } from 'lib/EtherscanAPI'
import BaseModal from '../BaseModal'

import './BidConfirmationModal.css'

export default class BidConfirmationModal extends React.PureComponent {
  static propTypes = {
    ...BaseModal.propTypes,
    token: PropTypes.oneOf(TOKEN_SYMBOLS),
    parcels: PropTypes.arrayOf(parcelType),
    beneficiary: PropTypes.string,
    isAuthorized: PropTypes.bool,
    isAuthorizing: PropTypes.bool,
    hasError: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onAuthorize: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      balance: null
    }
  }

  componentWillMount() {
    const { token, address } = this.props
    this.fetchBalance(token, address)
  }

  componentWillReceiveProps({ token, address }) {
    if (this.props.token !== token || this.props.address !== address) {
      this.fetchBalance(token, address)
    }
  }

  fetchBalance = async (symbol, address) => {
    this.setState({ balance: null, isLoading: true })

    let balance
    try {
      const contractAddress = TOKEN_ADDRESSES[symbol]
      balance = await etherscan.balanceOf(address, contractAddress)
    } catch (error) {
      window.Rollbar.info('Fetching balance via Infura')
      const contractName = token.getContractNameBySymbol(symbol)
      const contract = eth.getContract(contractName)
      balance = await contract.balanceOf(address)
      if (balance && typeof balance.toNumber === 'function') {
        balance = balance.toNumber()
      }
    }

    this.setState({
      balance:
        balance != null
          ? balance / (symbol === 'ZIL' ? 10 ** 12 : 10 ** 18)
          : null,
      isLoading: false
    })
  }

  handleSubmit = () => {
    const { parcels, beneficiary, isAuthorized, onSubmit } = this.props
    if (isAuthorized) {
      onSubmit(parcels, beneficiary)
    }
  }

  handleAuthorize = () => {
    const { token, onAuthorize } = this.props
    onAuthorize(token)
  }

  renderConfirmation = () => {
    const { parcels, token, price, onClose } = this.props
    const { balance, isLoading } = this.state
    const hasEnoughBalance = balance !== null && balance >= price
    return (
      <div className="modal-body">
        <h1 className="title">{t('auction_modal.confirmation')}</h1>

        <div className="description">
          <T
            id="auction_modal.confirmation_description"
            values={{
              parcels: parcels.length,
              token,
              price: parseFloatWithDecimal(price, 2).toLocaleString()
            }}
          />
        </div>

        {!isLoading && balance != null ? (
          <React.Fragment>
            <div className="your-balance">
              {t('auction_modal.your_balance', {
                balance: parseFloatWithDecimal(balance, 2).toLocaleString(),
                token
              })}
            </div>
            {!hasEnoughBalance ? (
              <div className="insufficient-funds">
                <Icon name="warning sign" size="small" />{' '}
                {t('auction_modal.insufficient_funds')}
              </div>
            ) : null}
          </React.Fragment>
        ) : null}

        <div className="actions">
          <Button
            primary
            onClick={this.handleSubmit}
            disabled={!hasEnoughBalance || isLoading}
          >
            {!isLoading ? t('auction_modal.submit') : t('global.loading')}
          </Button>

          <Button onClick={onClose}>{t('global.cancel')}</Button>
        </div>
      </div>
    )
  }

  renderAuthorization = () => {
    const { token, isAuthorizing, hasError, onClose } = this.props
    return (
      <div className="modal-body">
        <h1 className="title">{t('auction_modal.authorization')}</h1>

        <div className="description">
          <T
            id="auction_modal.authorization_description"
            values={{
              contract_link: <ContractLink contractName="LANDAuction" />,
              token
            }}
          />
        </div>

        <div className="actions">
          {isAuthorizing ? (
            <div className="processing-tx">
              <span>{t('auction_modal.processing_tx')}</span>
              <Loader active size="tiny" />
            </div>
          ) : hasError ? (
            <div className="processing-tx">
              <span>{t('auction_modal.tx_failed')}</span>
              <span className="retry" onClick={this.handleAuthorize}>
                {t('global.retry')}
              </span>
            </div>
          ) : (
            <Button primary onClick={this.handleAuthorize}>
              {t('auction_modal.authorize_token', { token })}
            </Button>
          )}
          <Button disabled={isAuthorizing} onClick={onClose}>
            {t('global.cancel')}
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { isLoading, isAuthorized } = this.props
    return (
      <BaseModal
        className="BidConfirmationModal modal-lg"
        isCloseable={false}
        {...this.props}
      >
        {isLoading ? (
          <Loader active size="massive" />
        ) : isAuthorized ? (
          this.renderConfirmation()
        ) : (
          this.renderAuthorization()
        )}
      </BaseModal>
    )
  }
}
