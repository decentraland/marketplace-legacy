import { connectDatabase, closeDatabase } from '../src/database'

before(() => connectDatabase())
after(() => closeDatabase())
