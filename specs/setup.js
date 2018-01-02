import db from '../src/lib/db'

before(() => db.connect())
after(() => db.close())
