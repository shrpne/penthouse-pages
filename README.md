# penthouse-pages
Plugin process array of pages through <a href="http://www.npmjs.org/package/penthouse">Penthouse</a> which extracts <a href="https://addyosmani.com/blog/detecting-critical-above-the-fold-css-with-paul-kinlan-video/">critical path css</a> to increase page speed rendering


Installation:
```
npm install penthouse-pages --save-dev
```

Can be used with gulp or separately
```js
let gulp = require('gulp');
let penthouse = require('penthouse-pages');

gulp.task('critical-css', ['less'], () => {
    return penthouse({
        // penthouse-page options
        pages: [
            {
                name: 'index',
                url: '',
            },
            'about',
            'about/contacts'
        ],
        baseUrl: 'http://example.com/',
        dest: './dest/',
        // penthouse options
        css: './styles.css',
        width: 1300,
        height: 900,
        strict: true,
    });
});
```

This task will process `example.com/`, `example.com/about`, `example.com/about/contacts` pages and generate `./dest/index.css`,  `./dest/about.css`, `./dest/about-contacts.css` files
