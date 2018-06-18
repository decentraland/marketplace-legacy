import { server } from 'decentraland-commons'
import { Translation } from './Translation'

export class TranslationRouter {
  constructor(app) {
    this.app = app
  }

  mount() {
    /**
     * Returns the translations for a given locale
     * @param  {string} locale - locale name
     * @return {array<Translation>}
     */
    this.app.get(
      '/translations/:locale',
      server.handleRequest(this.getTranslations)
    )
  }

  async getTranslations(req) {
    let locale = server.extractFromReq(req, 'locale')
    locale = locale.slice(0, 2) // We support base locales for now, like en, it, etc
    return new Translation().fetch(locale)
  }
}
