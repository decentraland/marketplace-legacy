import { db, Op, QueryBuilder } from '../database'

export class PublicationQueryBuilder extends QueryBuilder {
  isActive() {
    return this.assign({
      expires_at: {
        [Op.gt]: db.literal('EXTRACT(epoch from now()) * 1000')
      }
    })
  }
}
