/*jslint node:true */
var sax = require('sax');
var expat = {}; // = require('node-expat');
var common = require('./common');

var options;
var pureJsParser = true;
var currentElement;

function validateOptions (userOptions) {
    options = common.copyOptions(userOptions);
    common.checkOptionExist('ignoreDeclaration', options);
    common.checkOptionExist('ignoreAttributes', options);
    common.checkOptionExist('ignoreText', options);
    common.checkOptionExist('ignoreComment', options);
    common.checkOptionExist('ignoreCdata', options);
    common.checkOptionExist('compact', options);
    common.checkOptionExist('alwaysChildren', options);
    common.checkOptionExist('addParent', options);
    common.checkOptionExist('trim', options);
    common.checkOptionExist('nativeType', options);
    common.checkOptionExist('sanitize', options);
    common.checkKeyExist('declaration', options);
    common.checkKeyExist('attributes', options);
    common.checkKeyExist('text', options);
    common.checkKeyExist('comment', options);
    common.checkKeyExist('cdata', options);
    common.checkKeyExist('type', options);
    common.checkKeyExist('name', options);
    common.checkKeyExist('elements', options);
    common.checkKeyExist('parent', options);
    return options;
}

module.exports = function(xml, userOptions) {
    
    var parser = pureJsParser ? sax.parser(true, {}) : parser = new expat.Parser('UTF-8');
    var result = {};
    currentElement = result;
    
    options = validateOptions(userOptions);
    
    if (pureJsParser) {
        parser.onopentag = onStartElement;
        parser.ontext = onText;
        parser.oncomment = onComment;
        parser.onclosetag = onEndElement;
        parser.onerror = onError;
        parser.oncdata = onCdata;
        parser.onprocessinginstruction = onDeclaration;
    } else {
        parser.on('startElement', onStartElement);
        parser.on('text', onText);
        parser.on('comment', onComment);
        parser.on('endElement', onEndElement);
        parser.on('error', onError);
        //parser.on('startCdata', onStartCdata);
        //parser.on('endCdata', onEndCdata);
        //parser.on('entityDecl', onEntityDecl);
    }
    
    if (pureJsParser) {
        parser.write(xml).close();
    } else {
        if (!parser.parse(xml)) {
            throw new Error('XML parsing error: ' + parser.getError());
        }
    }
    
    if (result[options.elementsKey]) {
        var temp = result[options.elementsKey];
        delete result[options.elementsKey];
        result[options.elementsKey] = temp;
        delete result.text;
    }
    
    return result;

};

function onDeclaration (declaration) {
    if (options.ignoreDeclaration) return;
    if (currentElement[options.declarationKey]) {
        return;
    }
    currentElement[options.declarationKey] = {};
    while (declaration.body) {
        var attribute = declaration.body.match(/([\w:-]+)\s*=\s*"([^"]*)"|'([^']*)'|(\w+)\s*/);
        if (!attribute) {
            break;
        }
        if (!currentElement[options.declarationKey][options.attributesKey]) {
            currentElement[options.declarationKey][options.attributesKey] = {};
        }
        currentElement[options.declarationKey][options.attributesKey][attribute[1]] = attribute[2];
        declaration.body = declaration.body.slice(attribute[0].length); // advance the string
    }
    if (options.addParent && options.compact) {
        currentElement[options.declarationKey][options.parentKey] = currentElement;
    }
    //console.error('result[options.declarationKey]', result[options.declarationKey]);
}

function onStartElement (name, attributes) {
    var key, element;
    if (typeof name === 'object') {
        attributes = name.attributes;
        name = name.name;
    }
    if (options.trim && attributes) {
        for (key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                attributes[key] = attributes[key].trim();
            }
        }
    }
    if (options.compact) {
        element = {};
        if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) {
            element[options.attributesKey] = {};
            for (key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    element[options.attributesKey][key] = attributes[key];
                }
            }
        }
        element[options.parentKey] = currentElement;
        if (!(name in currentElement)) {
            currentElement[name] = element;
        } else {
            if (!(currentElement[name] instanceof Array)) {
                currentElement[name] = [currentElement[name]];
            }
            currentElement[name].push(element);
        }
        currentElement = element;
    } else {
        if (!currentElement[options.elementsKey]) {
            currentElement[options.elementsKey] = [];
        }
        element = {};
        element[options.typeKey] = 'element';
        element[options.nameKey] = name;
        if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) {
            element[options.attributesKey] = attributes;
        }
        element[options.parentKey] = currentElement;
        if (options.alwaysChildren) {
            element[options.elementsKey] = [];
        }
        currentElement[options.elementsKey].push(element);
        currentElement = element;
    }
}

function onText (text) {
    //console.log('currentElement:', currentElement);
    if (options.ignoreText) return;
    if (!text.trim()) {
        return;
    }
    if (options.trim) {
        text = text.trim();
    }
    if (options.nativeType) {
        text = nativeType(text);
    }
    if (options.sanitize) {
        text = sanitize(text);
    }
    addField('text', text, options);
}

function onComment (comment) {
    if (options.ignoreComment) return;
    if (options.trim) {
        comment = comment.trim();
    }
    if (options.sanitize) {
        comment = sanitize(comment);
    }
    addField('comment', comment, options);
}

function onEndElement (name) {
    var parentElement = currentElement[options.parentKey];
    if (!options.addParent) {
        delete currentElement[options.parentKey];
    }
    currentElement = parentElement;
}

function onCdata (cdata) {
    if (options.ignoreCdata) return;
    if (options.trim) {
        cdata = cdata.trim();
    }
    addField('cdata', cdata, options);
}

function onError (error) {
    console.error('error', error);
}

function sanitize (text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function nativeType (value) {
    var nValue = Number(value);
    if (!isNaN(nValue)) {
        return nValue;
    }
    var bValue = value.toLowerCase();
    if (bValue === 'true') {
        return true;
    } else if (bValue === 'false') {
        return false;
    }
    return value;
}

function addField (type, value, options) {
    if (options.compact) {
        currentElement[options[type + 'Key']] = (currentElement[options[type + 'Key']] ? currentElement[options[type + 'Key']] + '\n' : '') + value;
    } else {
        if (!currentElement[options.elementsKey]) {
            currentElement[options.elementsKey] = [];
        }
        var element = {};
        element[options.typeKey] = type;
        element[options[type + 'Key']] = value;
        if (options.addParent) {
            element[options.parentKey] = currentElement;
        }
        currentElement[options.elementsKey].push(element);
    }
}