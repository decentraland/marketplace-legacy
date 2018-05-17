"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const flat_1 = require("flat");
const decentraland_commons_1 = require("decentraland-commons");
class Translation {
    constructor() {
        this.localesPath = decentraland_commons_1.env.get('LOCALES_PATH', path.resolve(__dirname, './locales'));
        this.cache = {}; // {locale: translations}
    }
    async fetch(locale) {
        if (!this.cache[locale]) {
            const availableLocales = await this.getAvailableLocales();
            if (availableLocales.includes(locale)) {
                this.cache[locale] = this.parse(await this.readFile(locale));
            }
        }
        return this.cache[locale] || {};
    }
    async getAvailableLocales() {
        const files = await decentraland_commons_1.utils.promisify(fs.readdir)(this.localesPath);
        return files.map(filePath => path.basename(filePath, path.extname(filePath)));
    }
    parse(fileContents) {
        // The translation lib ( https://github.com/yahoo/react-intl ) doesn't support nested values
        // So instead we flatten the structure to look like `{ 'nested.prop': 'value' }`
        const translations = JSON.parse(fileContents);
        return flat_1.default(translations);
    }
    async readFile(locale) {
        return await decentraland_commons_1.utils.promisify(fs.readFile)(path.resolve(this.localesPath, `${locale}.json`), 'utf8');
    }
}
Translation.DEFAULT_LOCALE = 'en';
exports.Translation = Translation;
//# sourceMappingURL=Translation.js.map