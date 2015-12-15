# Writejson

Write stringified object to file.

## Install

```
npm i writejson --save
```
## How to use?

```js
var writejson = require('writejson');

writejson('data.json', {hello: 'world'}, function(error) {
    if (error)
        console.error(error.message);
});

try {
    writejson.sync('data.json', {hello: 'world'});
} catch(error) {
    console.log(error.message);
}

writejson.sync.try('data.json', {hello: 'world'});
```

## License

MIT

