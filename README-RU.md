# gulp-ejs-monster

![npm](https://img.shields.io/badge/node-6.3.1-yellow.svg)
![es2015](https://img.shields.io/badge/ECMAScript-2015_(ES6)-blue.svg)
![license](https://img.shields.io/badge/License-MIT-orange.svg)
[![Build Status](https://travis-ci.org/dutchenkoOleg/gulp-ejs-monster.svg?branch=v3)](https://travis-ci.org/dutchenkoOleg/gulp-ejs-monster)


:us: [English](./README.md)

> _Gulp плагин для [ejs](http://ejs.co/). Проект вдохновлен [ejs-locals](https://github.com/RandomEtc/ejs-locals)_

[![js happiness style](https://cdn.rawgit.com/JedWatson/happiness/master/badge.svg)](https://github.com/JedWatson/happiness)


---

## Параметры

#### `layouts` 

_тип данных_ `string`
|
_по умолчанию_ `process.cwd()`

Относительный путь от текущей рабочей директории к директории с лейаутами.

#### `widgets` 

_тип данных_ `string`
|
_по умолчанию_ `process.cwd()`

Относительный путь от текущей рабочей директории к директории с виджетами.

#### `requires` 

_тип данных_ `string`
|
_по умолчанию_ `process.cwd()`

Относительный путь от текущей рабочей директории к директории с js/json файлами, которые Вы сможете подключать как исполняемые файлы, используя експорт CommonJS Модулей.

#### `includes` 

_тип данных_ `string`
|
_по умолчанию_ `process.cwd()`

Относительный путь от текущей рабочей директории к директории c любыми текстовыми файлами, с которых Вы сможете подключать тектовый контент как есть.

#### `extname` 

_тип данных_ `string`
|
_по умолчанию_ `'.html'`

Расширение итоговых файлов рендера.  
Разрешается не указывать . (точку) в начале значения, пример `'php' => '.php'`

#### `delimiter` 

_тип данных_ `string` 
|
_по умолчанию_ `'%'`
|
_допустимые значения_ `['%', '&', '$', '?']`

Символ для использования с угловыми скобками для открытия / закрытия.  
Если указаннное свойство не соответствует допустимому - будет утановлено значение по умолчанию! 

#### `localsName`

_тип данных_ `string` 
|
_по умолчанию_ `'locals'`

Имя, которое будет использоваться для объекта, хранящего локальные переменные. Вы можете заменить это значение на свое и в дальнейшем использовать его внутри шаблонизатора.   
Соответствено значение должно иметь корректное имя JavaScript переменной!

#### `locals`

_тип данных_ `Object` 
|
_по умолчанию_ `{}`

Передача собственных значений в объект, хранящий локальные переменные, которые будут доступны Вам внутри шаблоназотора в объекте `locals` (или под тем именем которое Вы могли указать в свойстве `localsName`)

Важно знать, что плагин уже имеет определенный набор свойств и методов, которые будут добавлены к этому объекту. Поэтому чтобы не было конфликтов и перезаписей - ознакомтесь с [locals API](#locals-api).

#### `compileDebug`

_тип данных_ `boolean` 
|
_по умолчанию_ `false`

При отключении - инструменты отладки не компилируются, что позволяет немного ускорить процесс рендера.  
Указанное значение будет приведено к булевому.

Важно знать, что при ошибке - плагин не сможет дать пояснения о произошедшем сбое, если значение равно `false`. Поэтому, в случае ошибки - плагин сделает рендер текущей страницы заново c включенным параметром, для того что бы выяснить что пошло не так и вывести максимальный отчет о найденных ошибках. 

Если вы используете вотч задачи для рендера - после исправления ошибки параметр снова будет иметь прежнее значение.

> В очень специфических ситуациях ре-рендер может не корректно выявить ошибки, из-за  
> повторного прохода, при котором, к примеру уже могут быть переопределены какие-то значение и тд.  
> Если это происходит - запустите сразу задачу с включенным параметром `compileDebug` 

#### `showHistory`

_тип данных_ `boolean` 
|
_по умолчанию_ `false`

Выводит историю рендера после завершения работы с каждой страницей.

#### `escape`

_тип данных_ `function` 
|
_по умолчанию_ `undefined`

Собственная функция экранирования, используемая с конструкцией `<%=`



---

## locals API

### Свойства

#### locals.body

_тип данных_ `string` 

Контент текущей страницы, для вставки внутри лейаутов.  
Соотвественно свойтство доступно только внутри лейатов! 

###### Пример использования

```markup
<!-- view index.ejs -->
<% locals.setLayout('base.ejs') %>

<h1>Index view</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
```

```markup
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

_тип данных_ `Object` 

Список собранных блоков, которые создаются при помощи метода [`locals.block()`](#localsblock-blockname-markup--mtd---block)

###### Пример использования

```markup
<!-- view index.ejs -->
<% locals.setLayout('base.ejs') %>
<% locals.block('title', 'Index view') %>
<% locals.block('header', '<h1>Index view header</h1>') %>
```

```markup
<!-- view news.ejs -->
<% locals.setLayout('base.ejs') %>
<% locals.block('title', 'Last News') %>
<% locals.block('header', '<h1>News view header</h1>') %>
```

```markup
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

_тип данных_ `Object` 

Входящие параметры для текущего виджета. Соотвественно свойтство доступно только внутри виджетов! 
 
###### Пример использования

```markup
<!-- view index.ejs -->
<%- locals.widget('test.ejs') %>
<%- locals.widget('test.ejs', {title: 'Custom title'}) %>
```

```markup
<!-- widget test.ejs -->
<% let title = locals.entry.title || 'Default title'; %>
<h1><%- title) %></h1>
```

###### Пример с используванием деструктуризации es6

```markup
<!-- widget test.ejs -->
<% let {title = 'Default title'} = locals.entry; %>
<h1><%- title) %></h1>
```


#### locals.viewName

_тип данных_ `string` 

Имя текущей страницы рендера (без разширения).  
Независимо от текущего виджета, инкулуда лейаута и тд.


#### locals.viewPath

_тип данных_ `string` 

Абсолютный путь к текущей странице рендера в Вашей файловой системе.
Независимо от текущего виджета, инкулуда лейаута и тд.


#### locals.fileChanged

_тип данных_ `boolean` 

Флаг, изменился ли файл после последнего обращения к нему.   
Свойство доступно внутри виджетов и для подключаемых файлов. На основных страницах рендера и их лейаутах, свойство также доступно, но для них оно всегда будет равно `true`.

### Методы

#### locals.setLayout (filePath)

Устанавливает путь к лейауту для текущей страницы.

###### Параметры

Name | Type | Description
--- | --- | ---
`filePath` | `string` | Путь к файлу (с расширением) относительно директории указанной в параметре [layouts](#layouts)

#### locals.widget (filePath _[, entry] [, cacheRenderResult]_) → `string`

Подключение виджета разметки.

###### Параметры

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [widgets](#widgets)
`entry` | `Object` | &lt;optional> | `{}` | Входящие данные, которые передаются внутрь виджета
`cacheRenderResult` | `boolean` | &lt;optional> | `false` | Кешировать результат рендера разметки.

###### Возращает

- тип: `string`
- описание:	рендер ejs разметки

Внутри виджета Вы можете принять входящие параметры из [`locals.entry`](#localsentry). 

_Кеширование результата рендера_ позволит запоминать полученную строку в виде уже ***готовой статической разметки*** и вставлять ее при последующих вызовах на странице без прохода компиляции. Чтобы это выполнить при последующих применениях виджета нужно также указавать `cacheRenderResult`. Иначе рендер будет выполнен снова для текущего вызова.

При изменении файла самого виджета (смены даты модификации) - кеш будет сброшен.

Этот подход также можно использовать для нескольких страниц в общей задаче рендера.  
К примеру - первая страница, index.view, рендерить блок кода, a news.ejs, которая идет после, уже возьмет закешированный результат.

###### Пример использования

```markup
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

Подключение модулей из установленных `node_modules`

###### Параметры

Name | Type | Description
--- | --- | ---
`moduleName` | `string` | Имя модуля

###### Возращает

- тип: `*`
- описание: подключеный модуль

###### Пример использования

```js
<%
    let lodash = locals.requireNodeModule('lodash');
    lodash.cloneDeep(options);
    lodash.isPlainObject(data);
%>
```

#### locals.require (filePath) → `*`

Подключение собственных исполняемых js/json файлов с поддержкой CommonJS для экспорта.

###### Параметры

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [requires](#requires)

###### Возращает

- тип: `*`
- описание: подключеный файл

Внутри таких файлов объект `locals` не доступен. Вы можете передать его внутрь файла, к примеру, если вы экспортируете некий метод:

Вариант 1. Привязать контекст для метода

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

Вариант 2. Использовать _каррирование (карринг)_

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

#### locals.include (filePath) → `Object`

Включает текстовый контент файла в Вашу разметку как есть.

###### Параметры

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [includes](#includes)

###### Возращает

- тип: `Object`
- описание:	Объект имеет набор свойств
	- `fileChanged` - флаг, изменен ли файл, если кеширование выключенно - всегда равен `true`
	- `mtime` - Дата последней модификации файла, если кеширование выключенно - всегда равен `1`
	- `content` - Строка с контентом файла
	- `toString()` - собственный метод приведения в строку, который возвращает `this.content`, таким образом если выполнить метод в контексте вставки в разметку - результатом будет сразу контент файла.

###### Пример использования

```markup
<!-- include css file -->
<style><%- locals.include('critical.css') %></style>
```

###### Пример создания компонента с конвертацией md в html

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
        if (mdFile.fileChanged) {
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
  
    locals.com.md2html = locals.require('components/md2html.js')(locals);
    // set other components inside render
    // ...
}

module.exports = extendLocals;
```

```md
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

```markup
<!-- view index.ejs -->
<% locals.setLayout('base.ejs'); -%>
<% locals.require('extend-locals.js')(locals); -%>
<div class="container">
    <article class="wysiwyg">
        <%- locals.com.md2html('about-us.md'); %>
    </article>
</div>
```

#### locals.block (blockName, markup _[, mtd]_)  → `Block`

Указание блока разметки, который будет доступен в [списке блоков](#localsblocks).

###### Параметры

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`blockName` | `string` |  |  | Имя блока, по которому можно будет обратится в [списке блоков](#localsblocks)
`markup` | `string` |  |  | Значение блока
`mtd` | `string` | &lt;optional> | `'replace'` | Метод указания значения для блока.

###### Возращает

- тип: `string`
- описание:	рендер ejs разметки

При указании значения для блока - формируется массив, которые при выводе склеивается в строку. Методы указания значения для блока:

- `'replace'` - заменить предыдущее значение, если оно было. Если нет то просто назначит новое значение.
- `'append'` - добавить в конец массива новое значение.
- `'prepend'` - добавить в начало массива новове значение.

###### Пример использования добавления

```js
<% locals.block(headers, '<h2>Ipsum</h2>') %>
...
<% locals.block(headers, '<h3>Dolor</h3>', 'append') %>
...
<% locals.block(headers, '<h1>Lorem</h1>', 'prepend') %>

// => ['<h1>Lorem</h1>', '<h2>Ipsum</h2>', '<h3>Dolor</h3>'].join('\n');
```

---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
