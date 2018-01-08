import db from '../src/db'

before(() => db.connect())
after(() => db.close())
