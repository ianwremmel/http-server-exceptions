'use strict';

const middleware = require('./middleware');
const exceptions = require('./http-exception');

module.exports = Object.assign(middleware, exceptions);
