# gulp-ejs-monster

![Open Beta test](https://img.shields.io/badge/status-OBT-red.svg)
![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)

> _Gulp plugin for [ejs](http://ejs.co/). The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)



---

## Disclaimer v0.1.0

> This is an open test version,  
> No guarantee of correct operation  
> You can use it at your own risk.

---

## usage example

```js
const gulp = require('gulp');
const lodash = require('lodash');

const ejsMonster = require('gulp-ejs-monster');

// give +100500 for incremental build
const isWatching = true;
const watchAndTouch = require('gulp-watch-and-touch'); 
const fileWatcher = watchAndTouch(gulp);

// format
const isProduction = true;
const jsBeautify = require('js-beautify');

// Send some data for your workflow
const ejsData = {
    // some data
    // for example
    NODE_MODULES: {
        _: lodash
    },
    PROJECT_STATS: {
        version: '1.0.0'
        // ...
    }
};

// render options
const ejsOptions = {
    ext: '.html', // or .php, or ...
    layouts: './src/ejs/layouts', // resolve path
    partials: './src/ejs/partials', // resolve path
    configs: './src/ejs/configs', // resolve path
    controllers: './src/ejs/controllers', // resolve path
    reservedLocalsKeys: [ // protected properties from writing
        'NODE_MODULES',
        'PROJECT_STATS'
    ],
    afterRender: function(markup, file, data) {
        if (isWatching) {
        	let filePath = file.path;
			let sources = data.__INSTANCE.SOURCES.files[filePath] || [];
			
            fileWatcher(filePath, filePath, sources);
        }
        
        if (__ARGS.flags.production) {
        	let beautyMarkup = jsBeautify.html(markup, {
        		indent_level: 0,
                eol: '\n',
                max_preserve_newlines: 1,
                // ...
        	});
        	
        	return beautyMarkup;
        }
    }
};

// task
gulp.task('ejs', function(done) {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(ejsMonster(ejsData, ejsOptions))
        /// ...
})
```


--- 

#### markup

base.ejs layout

```html
<!DOCTYPE html>
<html lang="ru" dir="ltr">
    <head>
        <title>blocks</title>
    </head>
    <body>
        <div class="wrapper">
            <%- blocks.header %>
            <div class="container">
                <%- blocks.breadcrumbs %>
                <%- body -%>
            </div>
            <%- blocks.footer %>
        </div>
    </body>
</html>
```

index.ejs view

```html
<%
    layout('base');
    
    importController('utils.js');
    importConfig('main-menu.js'); 
    
    locals.View = {
        title: 'Главная страница',
    };
    
    block('header', partial('structure/header', {
    	title: View.title
    }));
    block('footer', partial('structure/footer'));
-%>
<h1>Hello world!</h1>
<%- partial('widgets/features') %> 
<%- partial('widgets/discounts') %> 
<%- partial('widgets/special-offers') %> 
<%- partial('widgets/popular-services') %>  
<%- partial('widgets/promotions') %> 
<%- partial('widgets/reviews') %> 
```

header.ejs partial

```html
<%
    let {
        title = 'default header title',
        subTitle = 'default header subtitle'
    } = ENTRY;
-%>
<header>
    <div class="center">
        <h2 class="title"><%- title %></h2>
        <div class="subtitle"><%- subtitle %></div>
    </div>
</header>
```


