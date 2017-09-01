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

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
