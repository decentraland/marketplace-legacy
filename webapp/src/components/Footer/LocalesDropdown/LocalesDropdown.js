import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown } from 'semantic-ui-react'
import { t, getAvailableLocales } from 'modules/translation/utils'

export default class LocalesDropdown extends React.PureComponent {
  static propTypes = {
    ...Dropdown.propTypes,
    defaultValue: PropTypes.string
  }

  handleOnChange = (e, data) => {
    this.props.onChange(data.value)
  }

  getLocalesOptions() {
    return getAvailableLocales().map(locale => ({
      text: t(`languages.${locale}`),
      value: locale,
      description: locale
    }))
  }

  render() {
    const { defaultValue } = this.props

    return (
      <Dropdown
        {...this.props}
        defaultValue={defaultValue}
        options={this.getLocalesOptions()}
        onChange={this.handleOnChange}
        allowAdditions={false}
        search
        selection
        size="small"
        upward={true}
      />
    )
  }
}
