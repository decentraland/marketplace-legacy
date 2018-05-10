import { db } from './database'

export class QueryBuilder {
  static buildRowToJsonAttribute(Model, name = Model.name) {
    return [db.fn('row_to_json', db.col(`${Model.name}.*`)), name]
  }

  static buildWhereColsAreEqual(SourceModel, TargetModel, columnName) {
    return db.where(
      db.col(`${SourceModel.name}.${columnName}`),
      ' = ',
      db.col(`${TargetModel.name}.${columnName}`)
    )
  }

  static buildInsertSQL(Model, valueHash, options) {
    const sql = db.dialect.QueryGenerator.insertQuery(
      Model.tableName,
      valueHash,
      Model.tableAttributes,
      options
    )
    return sanitizeRawSQL(sql)
  }

  static buildUpdateSQL(Model, attrValueHash, where, options) {
    const sql = db.dialect.QueryGenerator.updateQuery(
      Model.tableName,
      attrValueHash,
      where,
      options
    )
    return sanitizeRawSQL(sql)
  }

  static buildSelectSQL(Model, options) {
    const sql = db.dialect.QueryGenerator.selectQuery(
      Model.tableName,
      options,
      Model
    )
    return sanitizeRawSQL(sql)
  }

  constructor(query = {}) {
    this.baseQuery = query
    this.query = query
  }

  assign(conditions = {}) {
    Object.assign(this.query, conditions)
    return this
  }

  whereColsAreEqual(SourceModel, TargetModel, columnName) {
    return this.assign({
      [columnName]: QueryBuilder.buildWhereColsAreEqual(
        SourceModel,
        TargetModel,
        columnName
      )
    })
  }

  build() {
    return this.query
  }

  reset() {
    this.baseQuery = this.query
  }
}

function sanitizeRawSQL(sql) {
  // remove unwanted ;
  return sql.slice(-1) === ';' ? sql.slice(0, -1) : sql
}
