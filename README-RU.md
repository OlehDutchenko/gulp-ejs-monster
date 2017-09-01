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

Расширение итоговых файлов рендера  
Разрешается также не указывать точку (.) в начале значения, пример `'php' => '.php'`

#### `delimiter` 

_тип данных_ `string` 
|
_по умолчанию_ `'%'`
|
_допустимые значаения_ `['%', '&', '$', '?']`

Символ для использования с угловыми скобками для открытия / закрытия  
Если указаннное свойство не соответствует допустимому - будет утановлено значение по умолчанию 

#### `localsName`

_тип данных_ `string` 
|
_по умолчанию_ `'locals'`

Имя, которое будет использоваться для объекта, хранящего локальные переменные  
Соответствено значение должено иметь корректное имя JavaScript переменной

---

## Информация о проекте

* [История изменений](./CHANGELOG-RU.md)
* [Руководство по содействию проекту](./CONTRIBUTING-RU.md)
* [Кодекс поведения](./CODE_OF_CONDUCT-RU.md)
* [Лицензия MIT](./LICENSE)
