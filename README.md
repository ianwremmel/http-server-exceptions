# @ianwremmel/http-server-exceptions

[![license](https://img.shields.io/github/license/ianwremmel/http-server-exceptions.svg)](https://github.com/ianwremmel/http-server-exceptions/blob/master/LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

[![Greenkeeper badge](https://badges.greenkeeper.io/ianwremmel/http-server-exceptions.svg?token=b69615dc91154605c9158b200b6477769189ed9a1dabbb53815b37d950bcdbd9&ts=1509213245851)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/ianwremmel/http-server-exceptions/status.svg)](https://david-dm.org/ianwremmel/http-server-exceptions)
[![devDependencies Status](https://david-dm.org/ianwremmel/http-server-exceptions/dev-status.svg)](https://david-dm.org/ianwremmel/http-server-exceptions?type=dev)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![CircleCI](https://circleci.com/gh/ianwremmel/http-server-exceptions.svg?style=svg)](https://circleci.com/gh/ianwremmel/http-server-exceptions)
[![Coverage Status](https://coveralls.io/repos/github/ianwremmel/http-server-exceptions/badge.svg?branch=master)](https://coveralls.io/github/ianwremmel/http-server-exceptions?branch=master)

> Server-side exceptions and express middleware

## Install

```js
npm install @ianwremmel/http-server-exceptions
```

## Usage

### Setup the Middleware

```js
const middleware = require('@ianwremmel/http-server-exceptions');
app.use(middleware());
```

### Throw an Error

```js
const {BadGateway} = require('@ianwremmel/http-server-exceptions');
app.use(`/always-fails`, (req, res, next) => {
  next(new BadGatway('remote server could not be reached', req));
});
```

## Maintainers

[Ian Remmel](https://github.com/ianwremmel)

## Contribute

See [CONTRIBUTE](CONTRIBUTE.md)

## License

&copy; [MIT](LICENSE)
