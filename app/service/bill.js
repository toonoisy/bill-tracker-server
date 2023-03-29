'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    const res = await app.mysql.insert('bill', params);
    return res;
  }

  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id, pay_type, amount, date, type_id, remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    const res = await app.mysql.query(sql);
    return res;
  }

  async detail(id, user_id) {
    const { app } = this;
    const res = await app.mysql.get('bill', { id, user_id });
    return res;
  }

  async update(params) {
    const { app } = this;
    // 插件会主动按主键 id 更新数据
    const res = await app.mysql.update('bill', { ...params });
    return res;
  }

  async delete(id) {
    const { app } = this;
    const res = await app.mysql.delete('bill', { id });
    return res;
  }
}

module.exports = BillService;
