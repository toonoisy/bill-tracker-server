'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list() {
    const { app } = this;
    const res = await app.mysql.select('type', {
      columns: [ 'id', 'pay_type', 'name', 'en_name', 'user_id' ],
    });
    return res;
  }
}

module.exports = TypeService;
