const i18n = require('i18next');
const backend = require('i18next-node-fs-backend');
const path = require('path');

i18n
    .use(backend)
    .init({
        backend: {
            loadPath: path.join(__dirname, 'locales', '{{lng}}', '{{ns}}.json'),
        },
        fallbackLng: 'en',
        preload: ['en', 'fa'], // Preload the supported languages
        ns: ['translation'], // Namespace for your translation files
        defaultNS: 'translation', // Default namespace
        detection: {
            order: ['querystring', 'cookie', 'header'],
            caches: ['cookie'],
        },
    });

module.exports = i18n;