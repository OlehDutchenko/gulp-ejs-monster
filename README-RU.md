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
_по умолчанию_ `'process.cwd()`

Относительный путь от текущей рабочей директории к директории с лейаутами.  
Будет выполнен "ресолв" указанного пути, что позволит уменьшить путь обращения при работе с шаблонизатором.

#### `widgets` 

_тип данных_ `string`
|
_по умолчанию_ `'process.cwd()`

Относительный путь от текущей рабочей директории к директории с виджетами.  
Будет выполнен "ресолв" указанного пути, что позволит уменьшить путь обращения при работе с шаблонизатором.

#### `requires` 

_тип данных_ `string`
|
_по умолчанию_ `'process.cwd()`

Относительный путь от текущей рабочей директории к директории с js/json файлами, которые вы сможете подключать как исполняемые файлы, используя експорт CommonJS Модулей.  
Будет выполнен "ресолв" указанного пути, что позволит уменьшить путь обращения при работе с шаблонизатором.

#### `includes` 

_тип данных_ `string`
|
_по умолчанию_ `'process.cwd()`

Относительный путь от текущей рабочей директории к директории c любыми текстовыми файлами.   
Будет выполнен "ресолв" указанного пути, что позволит уменьшить путь обращения при работе с шаблонизатором.

#### `extname` 

_тип данных_ `string`
|
_по умолчанию_ `'.html'`

Расширение итоговых файлов рендера.  
Разрешается не указывать точку (.) в начале значения, пример `'php' => '.php'`

#### `delimiter` 

_тип данных_ `string` 
|
_по умолчанию_ `'%'`
|
_допустимые значения_ `['%', '&', '$', '?']`

Символ для использования с угловыми скобками для открытия / закрытия.  
Если указаннное свойство не соответствует допустимому - будет утановлено значение по умолчанию 

#### `localsName`

_тип данных_ `string` 
|
_по умолчанию_ `'locals'`

Имя, которое будет использоваться для объекта, хранящего локальные переменные.  
Соответствено значение должено иметь корректное имя JavaScript переменной

#### `compileDebug`

_тип данных_ `boolean` 
|
_по умолчанию_ `false`

При отключении - инструменты отладки не компилируются, что позволяет ускорить процесс рендера. Указанное значение будет приведено к булевому.

Важно знать, что при ошибке - плагин не сможет дать пояснения о произошедшем сбое, если значение равно `false`. Поэтому, в случае ошибки - плагин принудительно включить этот параметр и сделает рендер текущей страницы заново, для того что бы выяснить что пошло не так и вывести максимальный отчет о найденных ошибках. 

#### `escape`

_тип данных_ `function` 
|
_по умолчанию_ `undefined`

Собственная функция экранирования, используемая с конструкцией `<%=`



---

## locals API

Объект, хранящий локальные переменные.  
Далее вы можете ознакомится с locals API.


### Свойства

#### locals.body

_тип данных_ `string` 

Контент текущей страницы, для вставки внутри лейаутов.

Пример использования:

```markup
<!-- ejs view -->
<% locals.setLayout('base.ejs') %>

<h1>Index view</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
```

```markup
<!-- ejs layout base.ejs -->
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

Пример использования:

```markup
<!-- ejs view -->
<% locals.setLayout('base.ejs') %>
<% locals.block('title', 'Index view') %>
<% locals.block('header', '<h1>Current view header</h1>') %>
```

```markup
<!-- ejs layout base.ejs -->
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

### Методы

#### locals.setLayout (filePath)

Устанавливает путь к лайауту для текущей страницы.

###### Параметры:

Name | Type | Description
--- | --- | ---
`filePath` | `string` | Путь к файлу (с расширением) относительно директории указанной в параметре [layouts](#layouts)

#### locals.widget (filePath _[, entry] [, noCache]_) → `string`

Подключение виджета разметки.

###### Параметры:

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [widgets](#widgets)
`entry` | `Object` | &lt;optional> | `{}` | Входящие данные, которые передаются внутрь виджета
`noCache` | `boolean` | &lt;optional> | `false` | Не кешировать виджет

###### Возращает:

- тип: `string`
- описание:	рендер ejs разметки



#### locals.require (filePath _[, noCache]_) → `*`

Подключение собственных исполняемых js/json файлов с поддержкой CommonJS для экспорта.

###### Параметры:

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [requires](#requires)
`noCache` | `boolean` | &lt;optional> | `false` | Не кешировать файл

###### Возращает:

- тип: `*`
- описание: подключеный файл

Внутри таких файлов объект `locals` не доступен. Вы можете передать его внутрь файла, к примеру, если вы экспортируете некий метод:

Вариант 1. Привязать контекст для метода

```js
// ejs view

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
// ejs view

<%
    let component = locals.require('component.js')(locals);
    component('Hello');
%>
```

```js
// component.js

// Function wrapper
functtion componentWrapper (locals) {
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

#### locals.requireNodeModule (moduleName) → `*`

Подключение модулей из установленных `node_modules`

###### Параметры:

Name | Type | Description
--- | --- | ---
`moduleName` | `string` | Имя модуля

###### Возращает:

- тип: `*`
- описание: подключеный модуль

Пример использования:

```js
<%
    let lodash = locals.requireNodeModule('lodash');
    lodash.cloneDeep(options);
    lodash.isPlainObject(data);
%>
```

#### locals.include (filePath _[, noCache]_) → `Object`

Включает текстовый контент файла в Вашу разметку как есть.

###### Параметры:

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [includes](#includes)
`noCache` | `boolean` | &lt;optional> | `false` | Не кешировать файл

###### Возращает:

- тип: `Object`
- описание:	Объект имеет набор свойств
	- `fileChanged` - флаг, изменен ли файл, если кеширование выключенно - всегда равен `true`
	- `mtime` - Дата последней модификации файла, если кеширование выключенно - всегда равен `1`
	- `content` - Строка с контентом файла
	- `toString()` - собственный метод приведения в строку, который возвращает `this.content`, таким образом если выполнить метод в контексте вставки в разметку - результатом будет сразу контент файла.

Пример использования

```markup
<!-- include css file -->
<style><%- locals.include('critical.css') %></style>
```

```markup
<!-- include markdown file and transform to html -->
<%
    let marked = locals.requireNodeModule('marked');
    let mdFile = locals.include('article.md');
    let htmlMarkup = marked(mdFile.content, {/* marked options */});
%>
<%- htmlMarkup %>
```


```

#### locals.requireNodeModule (moduleName) → `*`

Подключение модулей из установленных `node_modules`

###### Параметры:

Name | Type | Description
--- | --- | ---
`moduleName` | `string` | Имя модуля

###### Возращает:

- тип: `*`
- описание: подключеный модуль

#### locals.include (filePath _[, noCache]_) → `Object`

Включает текстовый контент файла в Вашу разметку как есть.

###### Параметры:

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`filePath` | `string` |  |  | Путь к файлу (с расширением) относительно директории указанной в параметре [includes](#includes)
`noCache` | `boolean` | &lt;optional> | `false` | Не кешировать файл

###### Возращает:

- тип: `Object`
- описание:	Объект имеет набор свойств
	- `fileChanged` - флаг, изменен ли файл, если кеширование выключенно - всегда равен `true`
	- `mtime` - Дата последней модификации файла, если кеширование выключенно - всегда равен `1`
	- `content` - Строка с контентом файла
	- `toString()` - собственный метод приведения в строку, который возвращает `this.content`, таким образом если выполнить метод в контексте вставки в разметку - результатом будет сразу контент файла.

Пример использования

```markup
<!-- include css file -->
<style><%- locals.include('critical.css') %></style>
```

```markup
<!-- include markdown file and transform to html -->
<%
    let marked = locals.requireNodeModule('marked');
    let mdFile = locals.include('article.md');
    let htmlMarkup = marked(mdFile.content, {/* marked options */});
%>
<%- htmlMarkup %>
```

#### locals.block (blockName, markup _[, mtd]_)  → `Block`

Указание блока разметки, который будет доступен в [списке блоков](#localsblocks).

###### Параметры:

Name | Type | Attributes | Default | Description
--- | --- | --- | --- | ---
`blockName` | `string` |  |  | Имя блока, по которому можно будет обратится в [списке блоков](#localsblocks)
`markup` | `string` |  |  | Значение блока
`mtd` | `string` | &lt;optional> | `'replace'` | Метод указания значения для блока.

###### Возращает:

- тип: `string`
- описание:	рендер ejs разметки

При указании значения для блока - формируется массив, которые при выводе склеивается в строку. Методы указания значения для блока:

- `'replace'` - заменить предыдущее значение, если оно было. Если нет то просто назначит новое значение.
- `'append'` - добавить в конец массива новое значение.
- `'prepend'` - добавить в начало массива новове значение.

---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
