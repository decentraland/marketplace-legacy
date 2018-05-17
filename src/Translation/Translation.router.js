"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decentraland_commons_1 = require("decentraland-commons");
const Translation_1 = require("./Translation");
const lib_1 = require("../lib");
class TranslationRouter extends lib_1.Router {
    mount() {
        /**
         * Returns the translations for a given locale
         * @param  {string} locale - locale name
         * @return {array<Translation>}
         */
        this.app.get('/api/translations/:locale', decentraland_commons_1.server.handleRequest(this.getTranslations));
    }
    async getTranslations(req) {
        let locale = decentraland_commons_1.server.extractFromReq(req, 'locale');
        locale = locale.slice(0, 2); // We support base locales for now, like en, it, etc
        return await new Translation_1.Translation().fetch(locale);
    }
}
exports.TranslationRouter = TranslationRouter;
//# sourceMappingURL=Translation.router.js.map