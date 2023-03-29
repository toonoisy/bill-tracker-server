'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  onSuccess(data = null, msg = 'Success') {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      code: '200',
      msg,
      data,
    };
  }
}

module.exports = BaseController;
