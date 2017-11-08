'use strict';

const fs = require('fs');
const gutil = require('gulp-util');
const cleanCss = require('clean-css');
const penthouse = require('penthouse');

/**
 * Generate multiple critical css files for given pages array
 * @param {Object} options - pages options merged with penthouse options
 * @param {Array} options.pages - page urls
 * @param {String} options.baseUrl - base url common for all pages
 * @param {String} options.dest - destination directory
 */
module.exports = (options) => {
    if (!options) {
        options = {
            pages: [],
            baseUrl: '',
            dest: '',
        };
    }


    return new Promise(async (resolve) => {
        for (let i = 0; i < options.pages.length; i++) {
            console.log(i);
            let page = options.pages[i];
            await penthouse(Object.assign({
                url: options.baseUrl + page,
            }, options))
                .then((criticalCss) => {
                    let output = new cleanCss().minify(criticalCss);
                    console.log('success', paths.dest.css + '/critical/' + page.name + '.css');
                    fs.writeFile(options.dest + page.name + '.css', output.styles, () => {
                        gutil.log('penthouse: ' + options.dest + page.name + '.css successfully generated')
                    });
                })
                .catch((err) => {
                    throw err;
                });
        }

        resolve();
    });
};