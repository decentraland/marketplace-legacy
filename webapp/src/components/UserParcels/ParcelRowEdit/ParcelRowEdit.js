import React from 'react'
import Icon from 'components/Icon'
import CoordinateLink from '../CoordinateLink'

class ParcelRowEdit extends React.PureComponent {
  constructor(props) {
    super(props)

    const { name, description } = props.parcel
    this.state = { name, description }
  }

  getOnChange(stateName) {
    return event =>
      this.setState({
        [stateName]: event.currentTarget.value
      })
  }

  finishEditing = () => {
    const { parcel } = this.props
    const { name, description } = this.state

    this.props.finishEditing({
      ...parcel,
      name,
      description
    })
  }

  render() {
    const { parcel } = this.props
    const { name, description } = this.state

    return (
      <div className="parcel-row-editing">
        <div className="col col-editing">
          Editing&nbsp;&nbsp;
          <CoordinateLink parcel={parcel} />
        </div>
        <div className="col col-actions" onClick={this.finishEditing}>
          <Icon name="tick" />
          Done
        </div>

        <form action="POST" onSubmit={this.finishEditing}>
          <div className="editing-fields">
            <div className="field">
              <label htmlFor="name-field">NAME</label>
              <input
                type="text"
                name="name-field"
                id="name-field"
                value={name}
                onChange={this.getOnChange('name')}
              />
            </div>

            <div className="field">
              <label htmlFor="description-field">DESCRIPTION</label>
              <textarea
                name="description"
                id="description-field"
                value={description}
                onChange={this.getOnChange('description')}
              />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default ParcelRowEdit
