import { Estate } from '../src/Asset'

exports.up = pgm => {
  pgm.createIndex(Estate.tableName, 'id', { unique: true })
}

exports.down = pgm => {
  pgm.dropIndex(Estate.tableName, 'id', {
    unique: true,
    ifExists: true,
    cascade: true
  })
}
