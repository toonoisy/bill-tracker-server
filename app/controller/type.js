'use strict';

const BaseController = require('./base');
const HttpException = require('../exception/http');

class TypeController extends BaseController {
  async list() {
    const { ctx } = this;
    try {
      const list = await ctx.service.type.list();
      this.onSuccess(list);
    } catch (error) {
      console.log(error);
      throw new HttpException();
    }
  }
}

module.exports = TypeController;
