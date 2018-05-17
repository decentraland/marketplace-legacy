const { db } = require('../src/database')

before(() => db.connect())
after(() => db.close())
