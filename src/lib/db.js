import { db, env } from 'decentraland-commons'

export default {
  ...db.postgres,

  async connect() {
    const CONNECTION_STRING = env.get('CONNECTION_STRING')

    this.client = await db.postgres.connect(CONNECTION_STRING)

    await this.createSchema()

    return this
  },

  async createIndex() {},

  async createSchema() {
    await this.createTable(
      'address_states',
      `"id" int NOT NULL DEFAULT nextval('address_states_id_seq'),
      "address" varchar(42) NOT NULL UNIQUE,
      "balance" text NOT NULL,
      "email" text,
      "latestBidGroupId" int`
    )
    await this.createIndex('address_states', 'address_state_address_idx', [
      'address'
    ])
    await this.createIndex('address_states', 'address_state_email_idx', [
      'email'
    ])

    await this.createTable(
      'parcel_states',
      `"id" text NOT NULL,
      "x" int NOT NULL,
      "y" int NOT NULL,
      "address" varchar(42),
      "amount" text,
      "endsAt" timestamp,
      "bidIndex" int,
      "bidGroupId" int,
      "projectId" TEXT`,
      { sequenceName: null }
    )
    await this.createIndex('parcel_states', 'parcel_states_x_y_idx', ['x', 'y'])
    await this.createIndex('parcel_states', 'parcel_states_address_idx', [
      'address'
    ])
    await this.createIndex('parcel_states', 'parcel_states_ends_at_idx', [
      '"endsAt"'
    ])
    await this.createIndex('parcel_states', 'parcel_states_amount_idx', [
      'amount'
    ])

    await this.createTable(
      'projects',
      `"id" TEXT NOT NULL,
      "name" TEXT,
      "desc" TEXT,
      "link" TEXT,
      "public" BOOLEAN NOT NULL DEFAULT true,
      "parcels" DECIMAL,
      "priority" INT,
      "lookup" TEXT,
      "disabled" BOOLEAN NOT NULL DEFAULT false`,
      { sequenceName: null }
    )
  }
}
