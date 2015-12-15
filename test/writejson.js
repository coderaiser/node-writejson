'use strict';

let os          = require('os');
let path        = require('path');
let fs          = require('fs');
let test        = require('tape');
let writejson   = require('..');

let tmp = os.tmpdir();
let name = path.join(tmp, String(Math.random()));
let json = {
    hello: 'world'
};

test('writejson: should write json data to file', t => {
    writejson(name, json, error => {
        t.notOk(error, 'no write error');
         
        fs.readFile(name, 'utf8', (error, data) => {
            t.notOk(error, 'no read error');
            t.deepEqual(json, JSON.parse(data), 'data should be equal');
            
            fs.unlink(name, error => {
                t.notOk(error, 'no remove error');
                t.end();
            });
        });
    });
});

test('writejson: no args', t => {
    t.throws(writejson, /name should be string!/, 'name check');
    t.end();
});

test('writejson: no json', t => {
    let fn = () => writejson('hello');

    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson: no callback', t => {
    let fn = () => writejson('hello', [1,2,3]);
    
    t.throws(fn, /callback should be function!/, 'callback check');
    t.end();
});

test('writejson.sync: should write json data to file synchonously', t => {
    writejson.sync(name, json);
    let data = fs.readFileSync(name, 'utf8');
    t.ok(data, 'data should be read');
    t.deepEqual(json, JSON.parse(data), 'data should be equal');
    fs.unlinkSync(name);
    t.end();
});

test('writejson.sync: no args', t => {
    t.throws(writejson.sync, /name should be string!/, 'name check');
    t.end();
});

test('writejson.sync: no json', t => {
    let fn = () => writejson.sync('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});

test('writejson.sync.try: no args', t => {
    t.throws(writejson.sync.try, /name should be string!/, 'name check');
    t.end();
});

test('writejson.sync.try: no json', t => {
    let fn = () => writejson.sync.try('hello');
    
    t.throws(fn, /json should be object!/, 'json check');
    t.end();
});
