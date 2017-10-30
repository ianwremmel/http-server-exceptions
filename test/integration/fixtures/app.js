'use strict';

/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

const express = require('express');

const middleware = require('../../..');

const {
  BadGateway, BadRequest, NotFound, PaymentRequired
} = middleware;

const app = module.exports = express();
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'];
  next();
});

app.use('/gateway-error', (req, res, next) => {
  next(new BadGateway('No!', req));
});

app.use('/bad-request', (req, res, next) => {
  next(new BadRequest(req));
});

app.use('/error-render-error', (req, res, next) => {
  next(new PaymentRequired(req));
});

app.use((req, res, next) => {
  next(new NotFound());
});
app.use(middleware());
