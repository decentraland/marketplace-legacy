import 'babel-polyfill'

import chai from 'chai'

import { env, utils } from 'decentraland-commons'

chai.use(require('chai-as-promised'))

env.load({ path: './specs/.env' })

chai.Assertion.addChainableMethod('equalRow', function(expectedRow) {
  const ommitedProps = ['createdAt', 'updatedAt']

  if (!expectedRow.id) {
    ommitedProps.push('id')
  }
  const actualRow = utils.omit(this._obj, ommitedProps)

  return new chai.Assertion(expectedRow).to.deep.equal(actualRow)
})

chai.Assertion.addChainableMethod('equalRows', function(expectedRows) {
  const ommitedProps = ['createdAt', 'updatedAt']

  if (expectedRows.every(row => !row.id)) {
    ommitedProps.push('id')
  }

  const actualRows = this._obj.map(_obj => utils.omit(_obj, ommitedProps))

  return new chai.Assertion(expectedRows).to.deep.equal(actualRows)
})
