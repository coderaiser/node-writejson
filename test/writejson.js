'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs');
const test = require('supertape');
const tryToCatch = require('try-to-catch');
const tryCatch = require('try-catch');

const writejson = require('..');

const {readFile, unlink} = fs.promises;
const tmp = os.tmpdir();
const NAME = path.join(tmp, String(Math.random()));
const json = {
    hello: 'world',
    bye: 'sword',
};

test('writejson: should write json data to file', async (t) => {
    await writejson(NAME, json);
    
    const data = await readFile(NAME, 'utf8');
    await unlink(NAME);
    
    t.deepEqual(json, JSON.parse(data), 'data should be equal');
    t.end();
});

test('writejson: should write json data to file with options', async (t) => {
    const result = {
        hello: 'world',
    };
    
    const options = {
        replacer: ['hello'],
        space: 2,
        eof: false,
    };
    
    const resultStr = JSON.stringify(json, options.replacer, options.space);
    
    await writejson(NAME, json, options);
    const data = await readFile(NAME, 'utf8');
    await unlink(NAME);
    
    t.equal(resultStr, data, 'data should be equal');
    t.deepEqual(JSON.parse(data), result, 'objects should be equal');
    t.end();
});

test('writejson: should write json data to file with default options', async (t) => {
    const resultStr = JSON.stringify(json, null, 4) + '\n';
    
    await writejson(NAME, json);
    const data = await readFile(NAME, 'utf8');
    await unlink(NAME);
    
    t.equal(resultStr, data, 'data should be equal');
    t.deepEqual(JSON.parse(data), json, 'objects should be equal');
    t.end();
});

test('writejson: write error', async (t) => {
    const [error] = await tryToCatch(writejson, '/hello.json', json);
    
    t.ok(error, 'should return error: ' + error.message);
    t.end();
});

test('writejson: write options', async (t) => {
    const json = {
        hello: 'world',
    };
    
    const options = {
        mode: 0o600,
    };
    
    await tryToCatch(writejson, NAME, json, options);
    
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

test('writejson: no args', async (t) => {
    const [e] = await tryToCatch(writejson);
    
    t.equal(e.message, 'name should be string!');
    t.end();
});

test('writejson: no json', async (t) => {
    const [e] = await tryToCatch(writejson, 'hello');
    
    t.equal(e.message, 'json should be object!');
    t.end();
});

test('writejson: options not object', async (t) => {
    const [error] = await tryToCatch(writejson, 'hello', {}, 'options');
    
    t.equal(error.message, 'options should be object!');
    t.end();
});


test('writejson.sync: should write json data to file synchonously', (t) => {
    writejson.sync(NAME, json);
    const data = fs.readFileSync(NAME, 'utf8');
    fs.unlinkSync(NAME);
    
    t.ok(data, 'data should be read');
    t.deepEqual(json, JSON.parse(data), 'data should be equal');
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
    const [error] = tryCatch(writejson.sync.try, 'hello');
    
    t.ok(error, error.message);
    t.end();
});
