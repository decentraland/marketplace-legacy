import { db, env } from 'decentraland-commons'

export default {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')

    this.client = await db.postgres.connect(CONNECTION_STRING)

    await this.createSchema()

    return this
  },

  async createSchema() {
    await this.createTable(
      'parcels',
      `"id" TEXT NOT NULL,
      "x" int NOT NULL,
      "y" int NOT NULL,
      "price" TEXT,
      "name" TEXT,
      "description" TEXT,
      "district_id" TEXT`,
      { sequenceName: null }
    )
    await this.createIndex('parcels', 'parcels_x_y_idx', ['x', 'y'])

    await this.createTable(
      'districts',
      `"id" TEXT NOT NULL,
      "name" TEXT,
      "description" TEXT,
      "link" TEXT,
      "public" BOOLEAN NOT NULL DEFAULT true,
      "parcel_count" DECIMAL,
      "parcel_ids" TEXT[],
      "priority" INT,
      "center" TEXT,
      "disabled" BOOLEAN NOT NULL DEFAULT false`,
      { sequenceName: null }
    )
  }
}
