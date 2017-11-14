'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const gutil = require('gulp-util');
const chalk = require('chalk');
const cleanCss = require('clean-css');
const penthouse = require('penthouse');

const PLUGIN_NAME = 'penthouse-pages';

/**
 * Generate multiple critical css files for given pages array
 * @param {Object} options - plugin options merged with penthouse options
 * @param {Object[]|String[]} options.pages - array of pages, each page can be a string or an objects
 * @param {String} options.pages[].name - page name, used for dest filename
 * @param {String} options.pages[].url - page url
 * @param {String} options.baseUrl - base url common for all pages
 * @param {String} options.dest - destination directory
 */
module.exports = (options) => {
    options = Object.assign({
        pages: [],
        baseUrl: '',
        dest: '',
        cleanCssOptions: {},
    }, options);


    return new Promise(async (resolve) => {
        for (let i = 0; i < options.pages.length; i++) {
            let page = options.pages[i];
            // convert page string into object
            if (typeof page === 'string') {
                page = {
                    name: page,
                    url: page,
                }
            }
            // replace "/", e.g. "about/contacts" -> "about-contacts"
            page.name = page.name.replace('/', '-');
            // add css extension, if no one specified, .e.g. "about-contacts" -> "about-contacts.css"
            if (path.extname(page.name) === '') {
                page.name = page.name + '.css';
            }

            await penthouse(Object.assign({
                url: options.baseUrl + page.url,
            }, options))
                .then((criticalCss) => {
                    let output = new cleanCss(options.cleanCssOptions).minify(criticalCss);
                    let filePath = path.join(options.dest, page.name);
                    mkdirp(options.dest, (err) => {
                        if (err) {
                            throw err;
                        }
                        fs.writeFile(filePath, output.styles, () => {
                            gutil.log(PLUGIN_NAME + ':', chalk.green('✔ ') + page.name + chalk.gray(` from ${options.baseUrl + page.url}`));
                        });
                    });
                })
                .catch((err) => {
                    throw err;
                });
        }

        resolve();
    });
};
