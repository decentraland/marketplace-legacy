import { expect } from 'chai'

import { db } from '../database'
import { Publication } from './Publication'

describe('Publication', function() {
  afterEach(() => db.truncate('publications'))
})
