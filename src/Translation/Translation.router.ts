import { server } from 'decentraland-commons'
import * as express from 'express'

import { Translation, TranslationData } from './Translation'
import { Router } from '../lib'

export class TranslationRouter extends Router {
  mount() {
    /**
     * Returns the translations for a given locale
     * @param  {string} locale - locale name
     * @return {array<Translation>}
     */
    this.app.get(
      '/api/translations/:locale',
      server.handleRequest(this.getTranslations)
    )
  }

  async getTranslations(req: express.Request): Promise<TranslationData> {
    let locale = server.extractFromReq(req, 'locale')
    locale = locale.slice(0, 2) // We support base locales for now, like en, it, etc
    return new Translation().fetch(locale)
  }
}
