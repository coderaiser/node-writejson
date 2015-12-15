'use strict';

var fs          = require('fs'),
    tryCatch    = require('try-catch');

module.exports = function(name, json, callback) {
    check(name, json);
    checkCB(callback);
    
    var str,
        error = tryCatch(function() {
            str = JSON.stringify(json);
        });
    
    if (error)
        callback(error);
    else
        fs.writeFile(name, str, callback);
};

module.exports.sync = sync;

function sync(name, data) {
    check(name, data);
    fs.writeFileSync(name, JSON.stringify(data));
}

module.exports.sync.try = function(name, data) {
    check(name, data);
    
    var error = tryCatch(function() {
        sync(name, data);
    });
    
    return error;
};

function check(name, json) {
    if (typeof name !== 'string')
        throw Error('name should be string!');
    
    if (typeof json !== 'object')
        throw Error('json should be object!');
}

function checkCB(callback) {
    if (typeof callback !== 'function')
        throw Error('callback should be function!');
}

