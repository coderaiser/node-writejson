'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const test = require('tape');
const {promisify} = require('es6-promisify');
const tryToCatch = require('try-to-catch');

const writejson = require('..');
const _writejson = promisify(writejson);

const tmp = os.tmpdir();
const NAME = path.join(tmp, String(Math.random()));
const json = {
    hello: 'world',
    bye: 'sword'
};

test('writejson: should write json data to file', (t) => {
    writejson(NAME, json, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            t.deepEqual(json, JSON.parse(data), 'data should be equal');
            
            fs.unlink(NAME, (error) => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: should write json data to file with options', (t) => {
    const result = {
        hello: 'world'
    };
    
    const options = {
        replacer: ['hello'],
        space: 2,
        eof: false
    };
    
    const resultStr = JSON.stringify(json, options.replacer, options.space);
    
    writejson(NAME, json, options, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            
            t.equal(resultStr, data, 'data should be equal');
            t.deepEqual(JSON.parse(data), result, 'objects should be equal');
            
            fs.unlink(NAME, (error) => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: should write json data to file with default options', (t) => {
    const resultStr = JSON.stringify(json, null, 4) + '\n';
    
    writejson(NAME, json, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(NAME, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            
            t.equal(resultStr, data, 'data should be equal');
            t.deepEqual(JSON.parse(data), json, 'objects should be equal');
            
            fs.unlink(NAME, (error) => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: write error', (t) => {
    writejson('/hello.json', json, (error) => {
        t.ok(error, 'should return error: ' + error.message);
        t.end();
    });
});

test('writejson: write options', async (t) => {
    const json = {
        hello: 'world',
    };
    
    const options = {
        mode: 0o600
    };
    
    await tryToCatch(_writejson, NAME, json, options);
    
    const {mode} = fs.statSync(NAME);
    const expected = Number(mode).toString(8).slice(3);
    
    fs.unlinkSync(NAME);
    
    t.equal(expected, '600', 'should equal');
    t.end();
});

test('writejson.sync.try: write error', (t) => {
    const error = writejson.sync.try('/hello.json', json);
    
    t.ok(error, 'should return error: ' + error.message);
    t.end();
});

test('writejson: no args', (t) => {
    t.throws(writejson, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson: no json', (t) => {
    const fn = () => writejson('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson: options not object', (t) => {
    const fn = () => writejson('hello', {}, 'options', () => {});
    
    t.throws(fn, /options should be object!/, 'options check');
    t.end();
});

test('writejson: no callback', (t) => {
    const fn = () => writejson('hello', [1,2,3]);
    
    t.throws(fn, /callback should be function!/, 'callback check');
    t.end();
});

test('writejson.sync: should write json data to file synchonously', (t) => {
    writejson.sync(NAME, json);
    const data = fs.readFileSync(NAME, 'utf8');
    t.ok(data, 'data should be read');
    t.deepEqual(json, JSON.parse(data), 'data should be equal');
    fs.unlinkSync(NAME);
    t.end();
});

test('writejson.sync: no args', (t) => {
    t.throws(writejson.sync, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson.sync: no json', (t) => {
    const fn = () => writejson.sync('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson.sync.try: no args', (t) => {
    t.throws(writejson.sync.try, /name should be string!/, 'NAME check');
    t.end();
});

test('writejson.sync.try: no json', (t) => {
    const fn = () => writejson.sync.try('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});
