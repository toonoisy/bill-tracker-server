'use strict';

const HttpException = require('../exception/http');

module.exports = secret => {
  return async function jwtAuth(ctx, next) {
    const token = ctx.request.headers.authorization;
    if (token) {
      try {
        const decode = ctx.app.jwt.verify(token, secret);
        if (decode) {
          // 设置全局变量
          ctx.state.user = {
            id: decode.id,
            username: decode.username,
            token,
          };
        }
      } catch (error) {
        throw new HttpException('401', 'Invalid token, please login again', null, 401);
      }
      await next();
    } else {
      throw new HttpException('401', 'Token not found, please login first', null, 401);
    }
  };
};
