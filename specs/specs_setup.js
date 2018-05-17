require('babel-polyfill')

const chai = require('chai')
const { env } = require('decentraland-commons')
const { omitProps } = require('./utils')

chai.use(require('chai-as-promised'))

env.load({ path: './specs/.env' })

chai.Assertion.addChainableMethod('equalRow', function(expectedRow) {
  const omittedProps = ['created_at', 'updated_at']

  if (!expectedRow.id) {
    omittedProps.push('id')
  }
  const actualRow = omitProps(this._obj, omittedProps)

  return new chai.Assertion(expectedRow).to.deep.equal(actualRow)
})

chai.Assertion.addChainableMethod('equalRows', function(expectedRows) {
  const omittedProps = ['created_at', 'updated_at']

  if (expectedRows.every(row => !row.id)) {
    omittedProps.push('id')
  }

  const actualRows = this._obj.map(_obj => omitProps(_obj, omittedProps))

  return new chai.Assertion(expectedRows).to.deep.equal(actualRows)
})
