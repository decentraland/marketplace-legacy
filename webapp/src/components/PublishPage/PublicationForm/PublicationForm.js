import React from 'react'

import { Form, Button, Input } from 'semantic-ui-react'

import './PublicationForm.css'

export default class PublicationForm extends React.PureComponent {
  static propTypes = {}

  render() {
    return (
      <Form className="PublicationForm">
        <Form.Field>
          <label>Price</label>
          <Input type="number" placeholder="Price" />
        </Form.Field>
        <Form.Field>
          <label>Expiration</label>
          <Input type="date" placeholder="Expiration" />
        </Form.Field>
        <br />
        <div className="text-center">
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    )
  }
}
