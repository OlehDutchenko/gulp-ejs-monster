# gulp-ejs-monster

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-ejs-monster.svg?branch=master)](https://travis-ci.org/dutchenkoOleg/gulp-ejs-monster)
 
 
:us: English
|
:ru: [Русский язык](https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/README-RU.md)

> _Gulp plugin for [ejs](http://ejs.co/) with steroids. The project is inspired by [ejs-locals](https://github.com/RandomEtc/ejs-locals)_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)

---

## Table of contents

1. [Thanks](#thanks)
1. [Why this plugin was created?](#why-this-plugin-was-created)
1. [Example of using the plugin](#example-of-using-the-plugin)
1. [gulpEjsMonster()](#gulpejsmonster)
	- [Plugin properties](#plugin-properties)
	- [Plugin methods](#plugin-methods)
	- [Plugin options](#plugin-options)
	- [Rendering error reports](#rendering-error-reports)
1. [locals API](#locals-api)
	- [Properties](#properties)
	- [Methods](#methods)
1. [Project Info](#project-info)

---

## Thanks

First of all, we want to express our gratitude to the people who led us to use the template engine [`ejs`](https://www.npmjs.com/package/ejs) and create on its basis `gulp-ejs-monster`:

- [Matthew Eernisse (mde)](https://github.com/mde) - for creating and supporting [`ejs`](https://github.com/mde/ejs)(http://ejs.co), and the community of `ejs`, which helps him in this
- [Tom Carden (RandomEtc)](https://github.com/RandomEtc) - for creating a project [`ejs-locals`](https://github.com/RandomEtc/ejs-locals), from which we took the idea of realization `gulp-ejs-monster`
- [Ryan Zimmerman (RyanZim)](https://github.com/RyanZim) - [`EJS-Lint`](https://github.com/RyanZim/EJS-Lint)
- [Ariya Hidayat (ariya)](https://github.com/ariya) -   [`jquery/esprima`](https://github.com/jquery/esprima)
- [Corey Hart (codenothing)](https://github.com/codenothing) -   [`jsonlint`](https://github.com/codenothing/jsonlint)

## Why this plugin was created?

[`ejs`](https://www.npmjs.com/package/ejs)(http://ejs.co) - is a universal template engine that allows you to create any markup of any complexity. The better your knowledge of JavaScript - the more opportunities you have with `ejs`.

There are already many other plugins for `ejs`. But we also decided to create own, as an add-on to the `ejs` + pumping it with a small set of "steroids" ))).

Also, the main focus of the plugin `gulp-ejs-monster` - was made on optimization and rendering speed.

By default, `ejs` uses the JavaScript construction [`with (expression)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) to add scope - this gives its advantages for working with the template engine, but has its own price - the speed of searching for variables increases - which affects the rendering speed of the pages. This is especially noticeable on large projects.

Therefore `gulp-ejs-monster` forcibly turns off the native `ejs` parameters in order to work in strict mode. That gives a significant gain to the rendering speed.

List of constant values from `gulp-ejs-monster` for `ejs`:

```json
{
    "strict": true,
    "_with": false,
    "debug": false,
    "rmWhitespace": false,
    "client": false
}
```

This approach also has its price - now only one global object is available for you, without any "proxy" properties (which the `with` design used to imitate).


> If this approach to working with template engine `ejs` does not suit you, you can not read further and do not create pulls, since we do not intend to change it)))

## Example of using the plugin

### Installation

```bash
npm i --save-dev gulp-ejs-monster
# or yarn cli
yarn add --dev gulp-ejs-monster
```

### Gulp task

```js
const gulp = require('gulp');
const gulpEjsMonster = require('gulp-ejs-monster');

gulp.task('ejs', function() {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(gulpEjsMonster({/* plugin options */}))
        .pipe(gulp.dest('./dist/'));
});
```

### EJS markup

Example of a project structure

```js
ejs/
    layouts/
        base.ejs
    widgets/
        news-list.ejs
    includes/
        critical.css
    requires/
        news-list.json
    index.ejs
    news.ejs    
```

#### Layouts

###### layouts/base.ejs

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title><%- locals.blocks.title %></title>
        <style><%- locals.include('includes/critical.css') %></style>
    </head>
    <body>
        <%- locals.blocks.header %>
        <%- locals.body %>
    </body>
</html>
```

#### Render views

###### index.ejs

```html
<% locals.setLayout('layouts/base.ejs') -%>
<% locals.block('title', 'Index view') -%>

<h1>Index view</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
<hr>
```

###### news.ejs

```html
<% locals.setLayout('layouts/base.ejs') -%>
<% locals.block('title', 'Last News') -%>
<% let newsList = locals.require('requires/news-list.json') -%>

<h1>Last News</h1>
<%- locals.widget('widgets/news-list.ejs', {list: newsList}) %>
<hr>
```

#### Executables files

###### requires/news-list.json

```json
[
    {
        "title": "News title 1",
        "description": "Lorem ipsum dolor sit ....",
        "href": "news-page.html"
    }, {
        "title": "News title 2",
        "description": "Lorem ipsum dolor sit ....",
        "href": "news-page.html"
    }, {
        "title": "News title 3",
        "description": "Lorem ipsum dolor sit ....",
        "href": "news-page.html"
    }
]
```

#### Text files

###### includes/critical.css

```css
html{font-family:sans-serif}
body{margin:0}
h1{color:red}
```

#### Widgets

###### widgets/news-list.ejs

```html
<%
    let {
        list = []
    } = locals.entry;
    
    if (!list.length) {
        return  'No news yet :((';
    }
-%>
<ul class="news-list">
    <% list.forEach(item => { -%>
        <li class="news-list__item">
            <div class="news-item">
                <div class="news-item__title"><%- item.title %></div>
                <div class="news-item__description">
                    <p><%- item.description %></p>
                    <p><a href="<%- item.href %>">Read more</a></p>
                </div>
            </div>
        </li>
    <% }); -%>
</ul>
```

---

## gulpEjsMonster

### Plugin properties

#### `gulpEjsMonster.pluginName`

Plugin name.

### Plugin methods

#### `gulpEjsMonster.preventCrash()`

The method which, on error, calls the `end` event to prevent the current process `gulp` from falling out of the task.

###### Example of use

```js
const gulp = require('gulp');
const gulpEjsMonster = require('gulp-ejs-monster');

gulp.task('ejs', function() {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(gulpEjsMonster({/* plugin options */}).on('error', gulpEjsMonster.preventCrash))
        .pipe(gulp.dest('./dist/'));
});
```

### Plugin options

A little bit of advice - in order to speed up the processing and preparation of the plugin's parameters - use the created object with saving to a variable, which you can then specify when you call.  
In this case, by storing references to an external object, the parameters will not be re-prepared. And also it is possible to save the received data (in the object `locals`) from the previous page of the render to the next.

###### Example of use

```js
const gulp = require('gulp');
const gulpEjsMonster = require('gulp-ejs-monster');

const options = {/* plugin options */}; // save as variable

gulp.task('ejs', function() {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(gulpEjsMonster(options).on('error', gulpEjsMonster.preventCrash))
        .pipe(gulp.dest('./dist/'));
});
```

Then you can see a list of all available options.

#### `layouts` 

_data type_ `string`
|
_default_ `process.cwd()`

The relative path from the current working directory to the directory with layouts.

#### `widgets` 

_data type_ `string`
|
_default_ `process.cwd()`

The relative path from the current working directory to the directory with widgets.

#### `requires` 

_data type_ `string`
|
_default_ `process.cwd()`

Relative path from the current working directory to the directory with js/json files, which you can connect as executable files, using the CommonJS export modules.

#### `includes` 

_data type_ `string`
|
_default_ `process.cwd()`

The relative path from the current working directory to the directory c with any text files from which you can connect the content as it is.

#### `extname` 

_data type_ `string`
|
_default_ `'.html'`

Extend the resulting render files.  
It is allowed not to specify. (dot) at the beginning of the value, example `'php' => '.php'`

#### `delimiter` 

_data type_ `string` 
|
_default_ `'%'`
|
_допустимые значения_ `['%', '&', '$', '?']`

Symbol for use with angle brackets for opening / closing.  
If the specified property does not match the valid value, the value default will be set!

#### `localsName`

_data type_ `string` 
|
_default_ `'locals'`

The name that will be used for the object that holds the local variables. You can replace this value with your own and later use it inside the template.  
The corresponding value must have a valid JavaScript variable name!

#### `locals`

_data type_ `Object` 
|
_default_ `{}`

Sending your own values to an object that stores local variables that will be available to you inside the template in the `locals` object (or under the name you could specify in the `localsName` property)

It is important to know that the plug-in already has a certain set of properties and methods that will be added to this object. So that there are no conflicts and overwriting - check out the [locals API](#locals-api).

#### `compileDebug`

_data type_ `boolean` 
|
_default_ `false`

When disabled, debugging tools are not compiled, which allows you to speed up the render process a little.
The specified value will be converted to Boolean.

It is important to know that if an error occurs, the plugin will not be able to give an explanation of the failure if the value is `false`. Therefore, in case of an error, the plug-in will render the current page render again with the parameter enabled, in order to find out what went wrong and to output the maximum report on the errors found.

If you use the watch task for the render - after correcting the error, the parameter will again have the same value.

> In very specific situations, the re-renderer may not correctly detect errors,  
> because of a repeated pass, in which, for example, some value can be overridden, and so on.  
> If this happens - run the task immediately with the enabled parameter `compileDebug`

#### `showHistory`

_data type_ `boolean` 
|
_default_ `false`

Displays the render history after completing work with each page.

#### `showHistoryOnCrash`

_data type_ `boolean` 
|
_default_ `false`

Displays the render history on error.

#### `escape`

_data type_ `function` 
|
_default_ `undefined`

###### Options

Name | Type | Description
--- | --- | ---
`markup` | `string` | Markup inside the structure

Your own escaping function used with the `<% =` construct, which must return a string.

#### `afterRender`

_data type_ `function` 
|
_default_ `undefined`

The method that will be called after the page renderer with its layouts.

###### Options

Name | Type | Description
--- | --- | ---
`markup` | `string` | Final page markup
`file` | `Object` | Current renderer file
`sources` | `Array.<string>` | The paths of all the connected files during the rendering of the current file, including the path to the current page (the first one in the list)

Using the `afterRender` method, you can change the markup, for example, format with [`js-beautify`](https://github.com/beautify-web/js-beautify) and return a new result using `return` or use the method to set watches on dependent files for each page separately.

###### Example of formatting markup

```js
const gulp = require('gulp');
const gulpEjsMonster = require('gulp-ejs-monster');
const jsBeautify = require('js-beautify').html;

const options = {
    afterRender (markup) {
        return jsBeautify.html(markup, /* jsBeautify options */);
    }
};

gulp.task('ejs', function() {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(gulpEjsMonster(options).on('error', gulpEjsMonster.preventCrash))
        .pipe(gulp.dest('./dist/'));
});
```

###### Example of setting watches on dependent files

```js
const gulp = require('gulp');
const gulpEjsMonster = require('gulp-ejs-monster');
const gulpWatchAndTouch = require('gulp-watch-and-touch');

const ejsFileWatcher = gulpWatchAndTouch(gulp);
const watchTask = true;

const options = {
    afterRender (markup, file, sources) {
        if (watchTask) {
            let filePath = sources.shift(); // remove path of current view
            let newImports = ejsFileWatcher(filePath, filePath, sources);
            if (newImports) {
                console.log(`${file.stem} has new imports`);
            }
        }
    }
};

gulp.task('ejs', function() {
    return gulp.src('./src/ejs/*.ejs')
        .pipe(gulpEjsMonster(options).on('error', gulpEjsMonster.preventCrash))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('ejs-watch', function() {
    gulp.watch('./src/ejs/*.ejs', gulp.series('ejs')); // gulp#4.x
});

```

### Rendering error reports

We also emphasized the output of the maximum error reports that can occur when rendering pages so you can understand what went wrong.

If you fail, you will receive a report group:

#### render history

The rendering history of the current page, with the help of which you can track the sequence of plug-in actions

> _**Note!** since 3.1.0_  
> The history is displayed only when the [showHistoryOnCrash](#showHistoryOnCrash) parameter is turned on 

```bash
Render history:
Start
render view - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\index.ejs
    > set layout - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\_layouts\base.ejs
    > render widget - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\_widgets\demo.ejs
      caching new file content
      √ file changed
      ! render file content
    > render widget - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\_widgets\demo.ejs
      getting file content from cache
      ! file not changed
      ! render file content
    > require node module "lodash"
      caching new file content
    > require file - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\_requires\data.js
      √ file changed
      caching new file content
    > require file - C:\Wezom\NodeModules\gulp-ejs-monster\examples\src\_requires\component.js
        → CRASH...
```

#### ejs report

The native `ejs` report on the error found

> The availability of the following reports will depend on the error itself and the file in which it occurred

#### fs report

If the file you are looking for was not found.

#### ejs-lint report

If the error is in the `* .ejs` file - it will lint file by [`EJS-Lint`](https://github.com/RyanZim/EJS-Lint), to detect possible errors.

#### esprima report

If the error is in the `* .js` file - it will test file by [`esprima`](https://github.com/jquery/esprima), to detect possible errors.

#### json-lint report

If the error is in the `* .json` file - it will lint file by [`json-lint`](https://github.com/codenothing/jsonlint), to detect possible errors.


---

## locals API

`locals` - is a single global object that contains local values, which will be available inside `ejs`.

### Properties

#### locals.body

_data type_ `string` 

Content of the current page, for insertion inside the layouts.    
Accordingly, the property is available only within the layouts!

###### Example of use

```html
<!-- view index.ejs -->
<% locals.setLayout('base.ejs') %>

<h1>Index view</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
```

```html
<!-- layout base.ejs -->
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
    </head>
    <body>
        <%- locals.body %>
    </body>
</html>

```

#### locals.blocks

_data type_ `Object` 

List of assembled blocks that are created using the method [`locals.block()`](#localsblock-blockname-markup--mtd---block)

###### Example of use

```html
<!-- view index.ejs -->
<% locals.setLayout('base.ejs') %>
<% locals.block('title', 'Index view') %>
<% locals.block('header', '<h1>Index view header</h1>') %>
```

```html
<!-- view news.ejs -->
<% locals.setLayout('base.ejs') %>
<% locals.block('title', 'Last News') %>
<% locals.block('header', '<h1>News view header</h1>') %>
```

```html
<!-- layout base.ejs -->
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title><%- locals.blocks.title %></title>
    </head>
    <body>
        <%- locals.blocks.header %>
        <%- locals.body %>
    </body>
</html>

```

#### locals.entry

_data type_ `Object` 

Incoming properties for the current widget.  
Accordingly, the property is available only inside the widgets!
 
###### Example of use

```html
<!-- view index.ejs -->
<%- locals.widget('test.ejs') %>
<%- locals.widget('test.ejs', {title: 'Custom title'}) %>
```

```html
<!-- widget test.ejs -->
<% let title = locals.entry.title || 'Default title'; %>
<h1><%- title) %></h1>
```

###### Example with the use of es6 destructuring

```html
<!-- widget test.ejs -->
<% let {title = 'Default title'} = locals.entry; %>
<h1><%- title) %></h1>
```


#### locals.viewName

_data type_ `string` 

The name of the current rendering page (without the extension).  
Regardless of the current widget, the include, layout and so on.


#### locals.viewPath

_data type_ `string` 

Absolute path to the current render page in your file system.  
Regardless of the current widget, the include, layout and so on.


#### locals.fileChanged

_data type_ `boolean` 

Flag, whether the file changed after the last access to it.  
The property is available inside the widgets. On the main render pages and their layouts, the property is also available, but for them it will always be `true`.

### Methods

#### locals.setLayout (filePath)

Sets the path to the layout for the current page.

###### Options

Name | Type | Description
--- | --- | ---
`filePath` | `string` | The path to the file (with the extension) relative to the directory specified in the parameter[layouts](#layouts)

#### locals.widget (filePath _[, relativeFolderPath] [, entry] [, cacheRenderResult]_) → `string`

Connecting the markup widget.

###### Options

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | The path to the file (with the extension) relative to the directory specified in the parameter [widgets](#widgets)
`relativeFolderPath` | `string` | &lt;optional> |  | The relative path from which to connect the specified file, ignoring the [widgets](#widgets), If the parameter is not equal to a string, then it is perceived as `entry`
`entry` | `Object` | &lt;optional> | `{}` | Incoming data that is passed to the widget, If the parameter `relativeFolderPath` is not equal to a string and the third parameter is equal to the logical value, then it is perceived as `cacheRenderResult`
`cacheRenderResult` | `boolean` | &lt;optional> | `false` | Cache the result of the renderer.

###### Returns

- _data type_: `string`
- _description_: rendering ejs markup

Inside the widget, you can accept incoming data from the [`locals.entry`](#localsentry). 

_Caching the result of the renderer_ will allow you to store the received string as ***ready static markup*** and insert it on subsequent calls on the page without compilation. To do this in the next widgets, you must also specify `cacheRenderResult`. Otherwise, the render will be performed again for the current call.

If you change the file of the widget itself (change the modification date), the cache will be reset.

This approach can also be used for several pages in the overall rendering task.  
For example - the first page, `index.ejs`, render the block of code, a `news.ejs`, which goes after, will already take the cached result.

###### Example of use

```html
<!-- cache at first render -->
<%- locals.widget('big-rendering-markup.ejs', {/*data*/}, true) %>

<!-- get cached render result from first render -->
<%- locals.widget('big-rendering-markup.ejs', {/*data*/}, true) %>

<!-- new render result -->
<%- locals.widget('big-rendering-markup.ejs', {/*data*/}) %>

<!-- get cached render result from first render -->
<%- locals.widget('big-rendering-markup.ejs', {/*data*/}, true) %>
```

#### locals.requireNodeModule (moduleName) → `*`

Connecting modules from installed `node_modules`

###### Options

Name | Type | Description
--- | --- | ---
`moduleName` | `string` | Module name

###### Returns

- _data type_: `*`
- _description_: Connected module

###### Example of use

```js
<%
    let lodash = locals.requireNodeModule('lodash');
    lodash.cloneDeep(options);
    lodash.isPlainObject(data);
%>
```

#### locals.require (filePath _[, relativeFolderPath]_) → `*`

Connect your own executable js/json files with CommonJS support for export.

###### Options

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | The path to the file (with the extension) relative to the directory specified in the parameter [requires](#requires)
`relativeFolderPath` | `string` | &lt;optional> |  | The relative path from which to connect the specified file, ignoring the [requires](#requires)

###### Returns

- _data type_: `*`
- _description_: Connected file

Inside such files, the `locals` object is not available. You can transfer it to the file, for example, if you export a method:

Variant 1. Bind the context for the method

```js
<%
    let component = locals.require('component.js').bind(locals);
    component('Hello');
%>
```

```js
// component.js

function component (message) {
	console.log(this);
	console.log(message);
	
	// require another components and files
	let anotherComponent = this.require('another-component.js').bind(this);
	let data = this.require('config.json');
	
	// ...
}

module.exports = component;
```

Variant 2. Use _currying_

```js
<%
    let component = locals.require('component.js')(locals);
    component('Hello');
%>
```

```js
// component.js

// Function wrapper
function componentWrapper (locals) {
	// component
	function component (message) {
		console.log(locals);
		console.log(message);
		
		// require another components and files
		let anotherComponent = locals.require('another-component.js')(locals);
		let data = this.require('config.json');
		
		// ...
	}
	
	return component;
}

module.exports = componentWrapper;
```

#### locals.include (filePath _[, relativeFolderPath]_) → `Object`

Includes the text content of the file in your markup as is.

###### Options

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | The path to the file (with the extension) relative to the directory specified in the parameter [includes](#includes)
`relativeFolderPath` | `string` | &lt;optional> |  | The relative path from which to connect the specified file, ignoring the [includes](#includes)

###### Returns

- _data type_: `Object`
- _description_: The object has a set of properties
	- `changed` - flag, if the file is changed.
	- `mtime` - The date of the last modification of the file
	- `content` - the content of the file
	- `toString()` - own method of casting to a string that returns `this.content`, so if you execute the method in the context of the insertion in the markup - the result will immediately be the content of the file.

###### Example of use

```html
<!-- include css file -->
<style><%- locals.include('critical.css') %></style>
```

###### Example of creating a component with conversion md to html

```js
// requires/components/md2html.js

function createMd2HtmlComponent (locals) {
    const marked = locals.requireNodeModule('marked');
    const lodash = locals.requireNodeModule('lodash');
    const defaultOptions = {
        render: false,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: true
    };

    /**
     * Convert md 2 html
     * @param {string} filePath
     * @param {Object} [options={}]
     * @returns {string} converted html markup
     */
    function md2html (filePath, options = {}) {
        let mdFile = locals.include(filePath);
        if (mdFile.changed) {
            let markedOptions = lodash.merge({}, defaultOptions, options);
            // rewrite cached file content until it not changed
            mdFile.content =  marked(mdFile.content, markedOptions);
        }
        return mdFile;
    }
    
    return md2html;
}

module.exports = createMd2HtmlComponent;
```

```js
// requires/extend-locals.js

function extendLocals (locals) {
    if (!locals.hasOwnProperty('com')) {
        locals.com = {};
    }
  
    locals.com.md2html = locals.com.md2html || locals.require('components/md2html.js')(locals);

    // set other components inside render
    // ...
}

module.exports = extendLocals;
```

```markdown
# icludes/about-us.md

[Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

```

```html
<!-- view index.ejs -->
<% locals.setLayout('base.ejs'); -%>
<% locals.require('extend-locals.js')(locals); -%>
<div class="container">
    <article class="wysiwyg">
        <%- locals.com.md2html('about-us.md') %>
    </article>
</div>
```

#### locals.block (blockName, markup _[, mtd]_)  → `Block`

Specify the markup block that will be available in the [block list](#localsblocks).

###### Options

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`blockName` | `string` |  |  | The name of the block that can be accessed in the [block list](#localsblocks)
`markup` | `string` |  |  | Value of the block
`mtd` | `string` | &lt;optional> | `'replace'` | Method for specifying a value for a block.

###### Returns

- _data type_: `string`
- _description_: Value of the block

When specifying a value for a block, an array is formed, which, when printed, is joined to a string.  
Methods for specifying a value for a block:

- `'replace'` - replace the previous value if it was. If not then just assign a new value.
- `'append'` - add a new value to the end of the array.
- `'prepend'` - add a new value to the beginning of the array.

###### Example of using addition methods

```js
<% locals.block(headers, '<h2>Ipsum</h2>') %>
...
<% locals.block(headers, '<h3>Dolor</h3>', 'append') %>
...
<% locals.block(headers, '<h1>Lorem</h1>', 'prepend') %>

...

<%- locals.blocks.header %> // => ['<h1>Lorem</h1>', '<h2>Ipsum</h2>', '<h3>Dolor</h3>'].join('\n');
```

---

## Project Info

* [Change log](https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/CHANGELOG.md)
* [Contributing Guidelines](https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/CONTRIBUTING.md)
* [Contributor Covenant Code of Conduct](https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/CODE_OF_CONDUCT.md)
* [License MIT](https://github.com/dutchenkoOleg/gulp-ejs-monster/blob/master/LICENSE)
