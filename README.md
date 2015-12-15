# writejson [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build 

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

[NPMIMGURL]:                https://img.shields.io/npm/v/writejson.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/coderaiser/writejson/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/gemnasium/coderaiser/writejson.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]:                   https://npmjs.org/package/writejson "npm"
[BuildStatusURL]:           https://travis-ci.org/coderaiser/writejson  "Build Status"
[DependencyStatusURL]:      https://gemnasium.com/coderaiser/writejson "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"

