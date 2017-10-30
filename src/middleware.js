'use strict';

const {HttpServerException} = require('./http-exception');

/**
 * Middleware that renders an {@link HttpServerException} into either a JSON or
 * HTML response. If the views engine has a template registered for the
 * specified status code, that template will be used (when rendering as html)
 * otherwise, the response will simply be the result of
 * {@link HttpServerException#format()}
 * @returns {Function} - middleware
 */
module.exports = function configure() {
  return function middleware(err, req, res, next) {
    const logger = req.logger || console;
    /* istanbul ignore if - I've reproduced this in the passed, but can't seem
    to now. This is straight out of the
    [express docs](https://expressjs.com/en/guide/error-handling.html), so I'm
    choosing to believe it's adequately covered. */
    if (res.headersSent) {
      logger.info('headers already sent, not handling possible HttpServerException');
      return next(err);
    }

    if (err instanceof HttpServerException) {
      if (!err.req) {
        err.req = req;
      }
      logger.info('handling HttpServerException');

      if (req.accepts('html')) {
        logger.info('Attempting to render exception as HTML');

        if (!req.app.get('view engine')) {
          logger.info('No view engine configured, rendering exception as text');
          return renderAsText(res, err);
        }

        logger.info('Attempting to render template via views engine');
        return res.render(err.code.toString(), {error: err}, (renderError, html) => {
          if (renderError) {
            if (renderError.message.includes('Failed to lookup view')) {
              logger.info(`No template found for ${err.code}, rendering exception as text`);
              return renderAsText(res, err);
            }

            logger.info('An error occured while trying to render the error response', renderError);
            return next(renderError);
          }

          logger.info(`Found error template for ${err.code}, rendering`);
          return res
            .status(err.code)
            .send(html)
            .end();
        });
      }

      logger.info('rendering exception as JSON');
      return renderAsJSON(res, err);
    }

    logger.info('forwarding unknown exception');
    return next(err);
  };
};

/**
 * Render the error as plain text
 *
 * @param {ServerResponse} res - response object
 * @param {HttpServerException} err - error to render
 * @returns {undefined}
 */
function renderAsText(res, err) {
  let msg = `${err.name}: ${err.message}\n${err.method} ${err.path}`;
  if (err.requestId) {
    msg = `${msg}\nREQUEST ID: ${err.requestId}`;
  }
  return res
    .status(err.code)
    .send(msg)
    .end();
}
/**
 * Render the error as JSON
 *
 * @param {ServerResponse} res - response object
 * @param {HttpServerException} err - error to render
 * @returns {undefined}
 */
function renderAsJSON(res, err) {
  return res
    .status(err.code)
    .send(err.toJSON())
    .end();
}
