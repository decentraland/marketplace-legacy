import { db, env } from 'decentraland-commons'

export const database = {
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

    await this.createTable(
      'contributions',
      `"id" int NOT NULL DEFAULT nextval('contributions_id_seq'),
      "address" varchar(42) NOT NULL,
      "district_id" varchar(36) NOT NULL,
      "land_counts" int NOT NULL,
      "timestamp" varchar(20) NOT NULL,
      "message" BYTEA DEFAULT NULL,
      "signature" BYTEA DEFAULT NULL`
    )
    await this.createIndex('contributions', 'contributions_address_idx', [
      'address'
    ])
    await this.createIndex('contributions', 'contributions_district_id_idx', [
      'district_id'
    ])

    await this.createTable(
      'publications',
      `"tx_hash" TEXT NOT NULL,
      "address" varchar(42) NOT NULL,
      "price" DECIMAL NOT NULL,
      "status" TEXT NOT NULL,
      "expires_at" timestamp`,
      { primaryKey: 'tx_hash', sequenceName: null }
    )
    await this.createIndex('publications', 'publications_address_idx', [
      'address'
    ])
  }
}
