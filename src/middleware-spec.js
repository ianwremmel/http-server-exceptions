'use strict';

const express = require('express');
const request = require('supertest');

const middleware = require('./middleware');
const {BadGateway} = require('./http-exception');

describe('Exception', () => {
  describe('middleware', () => {
    const app = express();
    app.use((req, res, next) => {
      req.logger = console;
      req.requestId = req.headers['x-request-id'];
      next();
    });

    app.get('/gateway-error', (req, res, next) =>
      next(new BadGateway('No!', req))
    );

    app.get('/unknown-error', (req, res, next) => {
      next(new Error('unknown-error'));
    });

    it('forwards Errors to the default error handler', () =>
      request(app)
        .get('/unknown-error')
        .set('x-request-id', 1)
        .set('accept', 'application/json')
        .expect(500, /unknown-error/));

    app.get('/unhandled-error', (req, res, next) => {
      next(new Error('unhandled error'));
    });

    it('forwards unhandled Errors to the default error handler', () =>
      request(app)
        .get('/unhandled-error')
        .set('x-request-id', 2)
        .set('accept', 'application/json')
        .expect(500, /unhandled error/));

    it('converts exceptions to json http responses', () =>
      request(app)
        .get('/gateway-error')
        .set('x-request-id', 3)
        .set('accept', 'application/json')
        .expect(502, {
          code: 502,
          message: 'No!',
          method: 'GET',
          path: '/gateway-error',
          requestId: '3',
          type: 'BadGateway'
        }));

    it('converts exceptions to html http responses', () =>
      request(app)
        .get('/gateway-error')
        .set('x-request-id', 4)
        .set('accept', 'text/html')
        .expect(502, 'BadGateway: No!\nGET /gateway-error\nREQUEST ID: 4'));

    app.get('/missing-req', (req, res, next) => {
      next(new BadGateway('No!'));
    });

    it('adds the req property if it was not included in the constructor', () =>
      request(app)
        .get('/missing-req')
        .set('x-request-id', 5)
        .set('accept', 'text/html')
        .expect(502, 'BadGateway: No!\nGET /missing-req\nREQUEST ID: 5'));

    app.use(middleware());

    describe('when there is no request id header', () => {
      const app2 = express();
      app2.get('/gateway-error', (req, res, next) =>
        next(new BadGateway('No!', req))
      );
      app2.use(middleware());

      it('renders the other pertinent information as html', () =>
        request(app2)
          .get('/gateway-error')
          .set('accept', 'text/html')
          .expect(502, 'BadGateway: No!\nGET /gateway-error'));

      it('renders the other pertinent information as text', () =>
        request(app2)
          .get('/gateway-error')
          .set('accept', 'application/json')
          .expect(502, {
            code: 502,
            message: 'No!',
            method: 'GET',
            path: '/gateway-error',
            type: 'BadGateway'
          }));
    });
  });
});
