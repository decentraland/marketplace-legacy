import { expect } from 'chai'
import { QueryBuilder } from './QueryBuilder'

describe('QueryBuilder', function() {
  const Model = { name: 'Model name', tableName: 'models' }

  describe('.buildRowToJsonAttribute', function() {
    it('should return an array with the row to json function and name from the model', function() {
      const attribute = QueryBuilder.buildRowToJsonAttribute(Model)
      const [dbFn, name] = attribute

      expect(name).to.be.equal(Model.name)
      expect(dbFn.fn).to.be.equal('row_to_json')
      expect(dbFn.args.length).to.be.equal(1)
      expect(dbFn.args[0].col).to.be.equal(`${Model.name}.*`)
    })
  })

  xdescribe('.buildWhereColsAreEqual', function() {})

  describe('.buildSelectSQL', function() {
    it('should build an SQL statement from the options', function() {
      const query = {
        where: {
          x: 1,
          y: 2
        }
      }
      expect(QueryBuilder.buildSelectSQL(Model, query)).to.be.equal(
        `SELECT * FROM "${Model.tableName}" AS "${Model.name}" WHERE "${
          Model.name
        }"."x" = 1 AND "${Model.name}"."y" = 2`
      )
    })
  })

  describe('#build', function() {
    it('should return the current query', function() {
      const baseQuery = { name: 'query' }
      const queryBuilder = new QueryBuilder(baseQuery)

      queryBuilder.assign({ value: 100 })
      expect(queryBuilder.build()).to.deep.equal(baseQuery)

      queryBuilder.assign({ price: 'high' })
      expect(queryBuilder.build()).to.deep.equal({
        name: 'query',
        value: 100,
        price: 'high'
      })
    })
  })

  describe('#reset', function() {
    it('should go back to the base query', function() {
      const baseQuery = { name: 'query', number: 3 }
      const queryBuilder = new QueryBuilder(baseQuery)

      queryBuilder.assign({ value: 100 }).reset()

      expect(queryBuilder.build()).to.deep.equal(baseQuery)
    })
  })
})
