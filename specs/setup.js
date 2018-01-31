import { db } from '../src/database'

before(() => db.connect())
after(() => db.close())
