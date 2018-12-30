'use strict';

const request = require('supertest');

const app = require('../fixtures/app');

describe('Exception', () => {
  describe('middleware', () => {
    describe('when the app has a views engine', () => {
      it("uses the view for the error's status code", () =>
        request(app)
          .get('/bad-request')
          .set('x-request-id', 1)
          .set('accept', 'text/html')
          .expect(400, 'Really terrible 400 page\n'));

      describe('when no view can be found for the error', () => {
        it('falls back to the internal text serializer', () =>
          request(app)
            .get('/gateway-error')
            .set('x-request-id', 2)
            .set('accept', 'text/html')
            .expect(502, 'BadGateway: No!\nGET /gateway-error\nREQUEST ID: 2'));

        it('falls back to the internal json serializer', () =>
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
      });

      describe('when the view contains an error', () => {
        it('renders the render error, not the original error', () =>
          request(app)
            .get('/error-render-error')
            .set('x-request-id', 4)
            .set('accept', 'text/html')
            .expect(500, /render error/));
      });

      describe("when there's a 404 handler before the error middleware", () => {
        it('renders the 404 template', () =>
          request(app)
            .get('/not-found')
            .set('accept', 'text/html')
            .expect(404, 'This is the 404 template\n'));
      });

      // Yes, this test implementation is identical to the 404 handler test, but
      // the tests run fast enough that adding the second it() statement
      // drastically reduces the odds of someday changing the implementation of
      // the 404 test and breaking the templating behavior
      it('passes the error object to the template', () =>
        request(app)
          .get('/not-found')
          .set('accept', 'text/html')
          .expect(404, 'This is the 404 template\n'));
    });
  });
});
