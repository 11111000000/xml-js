![Alt text](/logo.svg?raw=true "Logo")
![Alt text](http://nashwaan.github.io/xml-js/logo.svg)
<img src="http://nashwaan.github.io/xml-js/logo.svg">

[![Build Status](https://ci.appveyor.com/api/projects/status/0ky9f115m0f0r0gf?svg=true)](https://ci.appveyor.com/project/nashwaan/xml-js)
[![Build Status](https://travis-ci.org/nashwaan/xml-js.svg?branch=master)](https://travis-ci.org/nashwaan/xml-js)
[![Build Status](https://img.shields.io/circleci/project/nashwaan/xml-js.svg)](https://circleci.com/gh/nashwaan/xml-js)

[![bitHound Overall Score](https://www.bithound.io/github/nashwaan/xml-js/badges/score.svg)](https://www.bithound.io/github/nashwaan/xml-js)
[![Coverage Status](https://coveralls.io/repos/github/nashwaan/xml-js/badge.svg?branch=master)](https://coveralls.io/github/nashwaan/xml-js?branch=master)
[![Code Climate](https://codeclimate.com/github/nashwaan/xml-js/badges/gpa.svg)](https://codeclimate.com/github/nashwaan/xml-js)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/f6ed5dd79a5b4041bfd2732963c4d09b)](https://www.codacy.com/app/ysf953/xml-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=nashwaan/xml-js&amp;utm_campaign=Badge_Grade)
[![Package Quality](http://npm.packagequality.com/shield/xml-js.svg)](http://packagequality.com/#?package=xml-js)

[![Dependency Status](https://david-dm.org/nashwaan/xml-js.svg)](https://david-dm.org/nashwaan/xml-js)
[![npm](http://img.shields.io/npm/v/xml-js.svg)](https://www.npmjs.com/package/xml-js)
[![License](https://img.shields.io/npm/l/xml-js.svg)](LICENSE)

Convert XML text to Javascript object (and vice versa) or to JSON text (and vice versa):

![Alt text](/synopsis.png?raw=true "Synopsis Diagram")

## Installation

```bash
npm install --save xml-js
```

## Code Example

Quick start:

```js
var convert = require('xml-js');
var xml = 
'<?xml version="1.0" encoding="utf-8"?>' + '\n' +
'<note importance="high" logged="true">' + '\n' +
'    <title>Happy</title>' + '\n' +
'    <todo>Work</todo>' + '\n' +
'    <todo>Play</todo>' + '\n' +
'</note>';
var result = convert.xml2json(xml, {compact: true});
console.log(result);
```

Output object as compact version. `options = {compact: true}`
```json
{
    "_declaration": {
        "_attributes": {
            "version": "1.0",
            "encoding": "utf-8"
        }
    },
    "note": {
        "_attributes": {
            "importance": "high",
            "logged": "true"
        },
        "title": {
            "_text": "Happy"
        },
        "todo": [
            {
                "_text": "Work"
            },
            {
                "_text": "Play"
            }
        ]
    }
}
```

Output object as detailed version. `options = {compact: false}`
```json
{
    "declaration": {
        "attributes": {
            "version": "1.0",
            "encoding": "utf-8"
        }
    },
    "elements": [
        {
            "type": "element",
            "name": "note",
            "attributes": {
                "importance": "high",
                "logged": "true"
            },
            "elements": [
                {
                    "type": "element",
                    "name": "title",
                    "attributes": {},
                    "elements": [
                        {
                            "type": "text",
                            "text": "Happy"
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "todo",
                    "attributes": {},
                    "elements": [
                        {
                            "type": "text",
                            "text": "Work"
                        }
                    ]
                },
                {
                    "type": "element",
                    "name": "todo",
                    "attributes": {},
                    "elements": [
                        {
                            "type": "text",
                            "text": "Play"
                        }
                    ]
                }
            ]
        }
    ]
}
```

## Motivation

There are many XML to JavaScript/JSON converters out there, but could not satisfy the following requirements:

 * Full XML Compliant
 * Portable (if required: only JS)
 * Fast (if required; will compile on VC++)
 * Support streaming
 * Support command line

## API Reference

### Convert JS object / JSON to XML

```js
var convert = require('xml-js');
var json = require('fs').readFileSync('test.json');
var options = {ignoreText: true, spaces: 4};
var result = convert.json2xml(json, options);
console.log(result);
```

| Option                | Default | Description
|-----------------------|---------|-------------|
| `ignoreDeclaration`   | false   | Whether to ignore writing declaration directives of xml. For example, `<?xml?>` will be ignored. |
| `ignoreAttributes`    | false   | Whether to ignore writing texts of the elements. For example, `x="1"` in `<a x="1"></a>` will be ignored |
| `ignoreText`          | false   | Whether to ignore writing texts of the elements. For example, `hi` text in `<a>hi</a>` will be ignored. |
| `ignoreComment`       | false   | Whether to ignore writing comments of the elements. That is, no `<!--  -->` will be generated. |
| `ignoreCdata`         | false   | Whether to ignore writing CData of the elements. That is, no `<![CDATA[  ]]>` will be generated. |
| `spaces`              | `0`     | Number of spaces to be used for indenting xml output. |
| `fromCompact`         | false   | whether the source object is in compact form. |
| `fullTagEmptyElement` | false   | Whether to produce element without sub-elements as full tag pairs `<a></a>` rather than self closing tag `</a>`. |

### Convert XML to JS object / JSON

```js
var convert = require('xml-js');
var xml = require('fs').readFileSync('test.xml');
var options = {ignoreText: true, emptyChildren: true};
var result = convert.xml2js(xml, options); // or convert.xml2json(xml, options)
console.log(result);
```

| Option              | Default | Description
|---------------------|---------|-------------|
| `ignoreDeclaration` | false   | Whether to ignore writing declaration property. That is, no `declaration` property will be generated. |
| `ignoreAttributes`  | false   | Whether to ignore writing attributes of elements.That is, no `attributes` property will be generated. |
| `ignoreText`        | false   | Whether to ignore writing texts of the elements. That is, no `text` property will be generated. |
| `ignoreComment`     | false   | Whether to ignore writing comments of the elements. That is, no `comment` will be generated. |
| `ignoreCdata`       | false   | Whether to ignore writing CData of the elements. That is, no `cdata` property will be generated. |
| `compact`           | false   | Whether to produce detailed object or compact object. |
| `emptyChildren`     | false   | Whether to always generate `elements` property even when there are no actual sub elements. |
| `addParent`         | false   | Whether to add `parent` property in each element object that points to parent object. |
| `trim`              | false   | Whether to trim white space characters that may exist before and after the text. |
| `nativeType`        | false   | whether to attempt converting text of numerals or of boolean values to native type. For example, `"123"` will be `123` and `"true"` will be `true` |
| `sanitize`          | false   | Whether to replace `&` `<` `>` `"` `'` with `&amp;` `&lt;` `&gt;` `&quot;` `&#039;` respectively in the resultant text. |
| `declarationKey`    | `"declaration"` or `"declaration"` | Name of the property key which will be used for the declaration. For example, if `declarationKey: '$declaration'` then output of `<?xml?>` will be `{"$declaration":{}}` *(in compact form)* |
| `attributesKey`     | `"attributes"` or `"_attributes"` | Name of the property key which will be used for the attributes. For example, if `attributesKey: '$attributes'` then output of `<a x="hello"/>` will be `{"a":{$attributes:{"x":"hello"}}}` *(in compact form)* |
| `textKey`           | `"text"` or `"_text"` | Name of the property key which will be used for the text. For example, if `textKey: '$text'` then output of `<a>hi</a>` will be `{"a":{"$text":"Hi"}}` *(in compact form)* |
| `commentKey`        | `"comment"` or `"_comment"` | Name of the property key which will be used for the comment. For example, if `commentKey: '$comment'` then output of `<!--note-->` will be `{"$comment":"note"}` *(in compact form)* |
| `cdataKey`          | `"cdat"` or `"_cdata"` | Name of the property key which will be used for the cdata. For example, if `cdataKey: '$cdata'` then output of `<![CDATA[1 is < 2]]>` will be `{"$cdata":"1 is < 2"}` *(in compact form)* |
| `parentKey`         | `"parent"` or `"_parent"` | Name of the property key which will be used for the parent. For example, if `parentKey: '$parent'` then output of `<a></b></a>` will be `{"a":{"b":{$parent:_points_to_a}}}` *(in compact form)* |
| `typeKey`           | `"type"` | Name of the property key which will be used for the type. For example, if `typeKey: '$type'` then output of `<a></a>` will be `{"elements":[{"$type":"element","name":"a","attributes":{}}]}` *(in non-compact form)* |
| `nameKey`           | `"name"` | Name of the property key which will be used for the name. For example, if `nameKey: '$name'` then output of `<a></a>` will be `{"elements":[{"type":"element","$name":"a","attributes":{}}]}` *(in non-compact form)* |
| `elementsKey`       | `"elements"` | Name of the property key which will be used for the elements. For example, if `elementsKey: '$elements'` then output of `<a></a>` will be `{"$elements":[{"type":"element","name":"a","attributes":{}}]}` *(in non-compact form)* |

## Tests

To perform tests on this project:

```
cd node_modules/xml-js/test
npm test
```

## Contributions

### Reporting

Use [this link](https://github.com/nashwaan/xml-js/issues) to report an issue or bug. Please include a sample code or Jasmine test spec where the code is failing.

### Contributing

If you want to add a feature or fix a bug, please fork the repository and make the changes in your fork. Add tests to ensure your code is working properly, then submit a pull request.

## License

[MIT](https://github.com/nashwaan/xml-js/blob/master/LICENSE)