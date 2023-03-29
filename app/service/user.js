'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  async getUserByName(username) {
    const { app } = this;
    const res = await app.mysql.get('user', { username });
    return res;
  }

  async register(params) {
    const { app } = this;
    const res = await app.mysql.insert('user', params);
    return res;
  }

  async editUserInfo(params) {
    const { app } = this;
    const res = await app.mysql.update('user', {
      ...params,
    }, {
      id: params.id,
    });
    return res;
  }
}

module.exports = UserService;
