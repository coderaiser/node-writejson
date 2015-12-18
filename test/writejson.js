'use strict';

let os          = require('os');
let path        = require('path');
let fs          = require('fs');
let test        = require('tape');
let writejson   = require('..');

const tmp = os.tmpdir();
const NAME = path.join(tmp, String(Math.random()));
const json = {
    hello: 'world',
    bye: 'sword'
};

test('writejson: should write json data to file', t => {
    writejson(NAME, json, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            t.deepEqual(json, JSON.parse(data), 'data should be equal');
            
            fs.unlink(NAME, error => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: should write json data to file with options', t => {
    let result = {
        hello: 'world'
    };
    
    let options = {
        replacer: ['hello'],
        space: 2,
        eof: false
    };
    
    let resultStr = JSON.stringify(json, options.replacer, options.space);
    
    writejson(NAME, json, options, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            
            t.equal(resultStr, data, 'data should be equal');
            t.deepEqual(JSON.parse(data), result, 'objects should be equal');
            
            fs.unlink(NAME, error => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: should write json data to file with default options', t => {
    let resultStr = JSON.stringify(json, null, 4);
    resultStr += '\n';
    
    writejson(NAME, json, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            
            t.equal(resultStr, data, 'data should be equal');
            t.deepEqual(JSON.parse(data), json, 'objects should be equal');
            
            fs.unlink(NAME, error => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: write error', t => {
    writejson('/hello.json', json, error => {
        t.ok(error, 'should return error: ' + error.message);
        t.end();
    });
});

test('writejson.sync.try: write error', t => {
    let error = writejson.sync.try('/hello.json', json);
    
    t.ok(error, 'should return error: ' + error.message);
    t.end();
});

test('writejson: no args', t => {
    t.throws(writejson, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson: no json', t => {
    let fn = () => writejson('hello');

    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson: options not object', t => {
    let fn = () => writejson('hello', {}, 'options', () => {});

    t.throws(fn, /options should be object!/, 'options check');
    t.end();
});

test('writejson: no callback', t => {
    let fn = () => writejson('hello', [1,2,3]);
    
    t.throws(fn, /callback should be function!/, 'callback check');
    t.end();
});

test('writejson.sync: should write json data to file synchonously', t => {
    writejson.sync(NAME, json);
    let data = fs.readFileSync(NAME, 'utf8');
    t.ok(data, 'data should be read');
    t.deepEqual(json, JSON.parse(data), 'data should be equal');
    fs.unlinkSync(NAME);
    t.end();
});

test('writejson.sync: no args', t => {
    t.throws(writejson.sync, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson.sync: no json', t => {
    let fn = () => writejson.sync('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson.sync.try: no args', t => {
    t.throws(writejson.sync.try, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson.sync.try: no json', t => {
    let fn = () => writejson.sync.try('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});
