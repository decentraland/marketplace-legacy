import React from 'react'
import PropTypes from 'prop-types'
import { txUtils } from 'decentraland-commons'
import dateFormat from 'date-fns/format'
import addDays from 'date-fns/add_days'
import differenceInDays from 'date-fns/difference_in_days'

import { Form, Button, Input, Message, Icon } from 'semantic-ui-react'
import TxStatus from 'components/TxStatus'

import { parcelType, publicationType } from 'components/types'
import { preventDefault } from 'lib/utils'
import { ONE_LAND_IN_MANA } from 'lib/land'

import './PublicationForm.css'

const DEFAULT_DAY_INTERVAL = 31
const MINIMUM_DAY_INTERVAL = 1

export default class PublicationForm extends React.PureComponent {
  static propTypes = {
    publication: publicationType,
    parcel: parcelType,
    onPublish: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  static defaultProps = {
    publication: {}
  }

  constructor(props) {
    super(props)

    const expiresAt = addDays(new Date(), DEFAULT_DAY_INTERVAL)

    this.state = {
      price: '',
      expiresAt: dateFormat(expiresAt, 'YYYY-MM-DD'),
      formErrors: []
    }
  }

  handlePriceChange = e => {
    this.setState({
      price: e.currentTarget.value,
      formErrors: []
    })
  }

  handleExpiresAtChange = e => {
    this.setState({
      expiresAt: e.currentTarget.value,
      formErrors: []
    })
  }

  handleClearFormErrors = () => {
    this.setState({ formErrors: [] })
  }

  handlePublish = () => {
    const { parcel, onPublish } = this.props
    const { price, expiresAt } = this.state

    const formErrors = []

    if (differenceInDays(expiresAt, new Date()) < MINIMUM_DAY_INTERVAL) {
      formErrors.push('The minimum expiration date is of one day')
    }

    if (price < ONE_LAND_IN_MANA) {
      formErrors.push(`The minimum LAND price is ${ONE_LAND_IN_MANA} MANA`)
    }

    if (formErrors.length === 0) {
      onPublish({
        x: parcel.x,
        y: parcel.y,
        expires_at: new Date(expiresAt).getTime(),
        price
      })
    } else {
      this.setState({ formErrors })
    }
  }

  render() {
    const { publication, onCancel } = this.props
    const { price, expiresAt, formErrors } = this.state

    const isConfirmed =
      publication.tx_status === txUtils.TRANSACTION_STATUS.confirmed
    const isPending =
      publication.tx_status === txUtils.TRANSACTION_STATUS.pending
    const isFailure =
      publication.tx_status === txUtils.TRANSACTION_STATUS.failed

    return (
      <Form
        className="PublicationForm"
        onSubmit={preventDefault(this.handlePublish)}
        error={!!formErrors}
        success={isConfirmed}
      >
        <Form.Field>
          <label>Price</label>
          <Input
            type="number"
            placeholder="Price in MANA for this LAND"
            value={price}
            required={true}
            onChange={this.handlePriceChange}
          />
        </Form.Field>
        <Form.Field>
          <label>Expiration</label>
          <Input
            type="date"
            placeholder="Expiration date for this publication"
            value={expiresAt}
            required={true}
            onChange={this.handleExpiresAtChange}
          />
        </Form.Field>
        {isPending || isFailure ? (
          <Message icon>
            {isPending && <Icon name="circle notched" loading />}
            <Message.Content>
              <TxStatus.Text
                txHash={publication.tx_hash}
                txStatus={publication.tx_status}
              />
            </Message.Content>
          </Message>
        ) : null}
        {formErrors.length > 0 ? (
          <Message error onDismiss={this.handleClearFormErrors}>
            {formErrors.map((error, index) => <div key={index}>{error}</div>)}
          </Message>
        ) : null}
        {isConfirmed ? (
          <Message success>
            Transaction confirmed!<br />
            You will be redirected to your activity overview
          </Message>
        ) : null}
        <br />
        <div className="text-center">
          <Button
            disabled={isPending || isConfirmed}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            primary={true}
            disabled={isPending || isConfirmed}
          >
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}
