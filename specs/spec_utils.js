import 'babel-polyfill'

import chai from 'chai'

import { utils } from 'decentraland-commons'
import { loadEnv } from '../scripts/utils'

chai.use(require('chai-as-promised'))

loadEnv('./specs/.env')

chai.Assertion.addChainableMethod('equalRow', function(expectedRow) {
  const ommitedProps = ['created_at', 'updated_at']

  if (!expectedRow.id) {
    ommitedProps.push('id')
  }
  const actualRow = utils.omit(this._obj, ommitedProps)

  return new chai.Assertion(expectedRow).to.deep.equal(actualRow)
})

chai.Assertion.addChainableMethod('equalRows', function(expectedRows) {
  const ommitedProps = ['created_at', 'updated_at']

  if (expectedRows.every(row => !row.id)) {
    ommitedProps.push('id')
  }

  const actualRows = this._obj.map(_obj => utils.omit(_obj, ommitedProps))

  return new chai.Assertion(expectedRows).to.deep.equal(actualRows)
})
