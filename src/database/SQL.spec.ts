import { expect } from 'chai'
import { SQL } from './SQL'
import { database as db } from './database'

describe('SQL', () => {
  it('should work with a simple query', () => {
    const query = SQL`SELECT * FROM table`

    expect(query.text).to.equal('SELECT * FROM table')
    expect(query.values).to.deep.equal([])
  })

  it('should work with a query with values', () => {
    const value = 1234
    const query = SQL`SELECT * FROM table WHERE column = ${value}`
    expect(query.text).to.equal('SELECT * FROM table WHERE column = $1')
    expect(query.values).to.deep.equal([value])
  })

  it('should work with falsy values', () => {
    const value1 = false
    const value2 = null
    const query = SQL`SELECT * FROM table WHERE column1 = ${value1} AND column2 = ${value2}`
    expect(query.text).to.equal(
      'SELECT * FROM table WHERE column1 = $1 AND column2 = $2'
    )
    expect(query.values).to.deep.equal([value1, value2])
  })

  it('should work with nested queries', () => {
    const query1 = SQL`SELECT * FROM table WHERE column1 = ${1}`
    const query2 = SQL`SELECT * FROM (${query1}) query1 WHERE column2 = ${2}`
    expect(query2.text).to.equal(
      'SELECT * FROM (SELECT * FROM table WHERE column1 = $1) query1 WHERE column2 = $2'
    )
    expect(query2.values).to.deep.equal([1, 2])
  })

  it('should work with parameterless nested queries', () => {
    const query1 = SQL`tableName`
    const query2 = SQL`SELECT * FROM ${query1}`
    expect(query2.text).to.equal('SELECT * FROM tableName')
  })

  it('should work with multiple nested queries', () => {
    let query1 = SQL`b=${2}, c=${3}`
    let query2 = SQL`d=${4}, e=${5}`
    let query3 = SQL`foo`
    let query = SQL`a=${1}, ${query1}, ${query3}, ${query2}, f=${6}`
    expect(query.text).to.equal('a=$1, b=$2, c=$3, foo, d=$4, e=$5, f=$6')
    expect(query.values).to.deep.equal([1, 2, 3, 4, 5, 6])
  })

  describe('append()', () => {
    it('should return this', () => {
      const query = SQL`SELECT * FROM table`
      expect(query).to.equal(query.append('whatever'))
    })

    it('should append a second SQLStatement', () => {
      const value1 = 1234
      const value2 = 5678
      const query = SQL`SELECT * FROM table WHERE column = ${value1}`.append(
        SQL` AND other_column = ${value2}`
      )
      expect(query.text).to.equal(
        'SELECT * FROM table WHERE column = $1 AND other_column = $2'
      )
      expect(query.values).to.deep.equal([value1, value2])
    })

    it('should append a string', () => {
      const value = 1234
      const query = SQL`SELECT * FROM table WHERE column = ${value}`.append(
        ' ORDER BY other_column'
      )
      expect(query.text).to.equal(
        'SELECT * FROM table WHERE column = $1 ORDER BY other_column'
      )
      expect(query.values).to.deep.equal([value])
    })
  })

  describe('setName()', () => {
    it('should set the name and return this', () => {
      expect(SQL`SELECT * FROM table`.setName('my_query').name).to.equal(
        'my_query'
      )
    })
  })
})

describe('pg', function() {
  this.timeout(10000)

  it('should work with a simple query', async () => {
    const result = await db.query(SQL`SELECT ${1} + 1 as result`)
    expect(result[0].result).to.equal(2)
  })

  it('should work with a named statement', async () => {
    const result = await db.query(
      SQL`SELECT ${1} + 1 as result`.setName('my_query')
    )
    expect(result[0].result).to.equal(2)
  })
})
