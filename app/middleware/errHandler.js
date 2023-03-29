const HttpException = require('../exception/http');

module.exports = () => {
  return async function errHandler(ctx, next) {
    try {
      await next();
    } catch (error) {
      if (error instanceof HttpException) {
        const { code, msg, data, httpCode } = error;
        ctx.status = httpCode;
        ctx.body = { code, msg, data };
      } else {
        ctx.status = 500;
        ctx.body = {
          code: '500',
          msg: error.message || 'Server error',
          data: null,
        };
      }
    }
  };
};
