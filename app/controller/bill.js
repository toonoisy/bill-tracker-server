'use strict';

const BaseController = require('./base');
const HttpException = require('../exception/http');
const dayjs = require('dayjs');

const PAY_TYPES = {
  EXPENSE: 1,
  INCOME: 2,
};

class BillController extends BaseController {
  async add() {
    const { ctx } = this;
    // 获取请求中携带的参数
    const { amount, type_id, date, pay_type, remark = '' } = ctx.request.body;

    // 判空 + TODO: 参数类型校验
    if (!amount || !type_id || !date || !pay_type) {
      throw new HttpException('400', 'Params error', null, 400);
    }
    try {
      const { id } = ctx.state?.user;
      // user_id 做用户对应关系
      await ctx.service.bill.add({
        amount,
        type_id,
        date,
        pay_type,
        remark,
        user_id: id,
      });
      this.onSuccess();
    } catch (error) {
      console.log(error);
      throw new HttpException();
    }
  }

  async list() {
    const { ctx } = this;
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;
    try {
      const { id } = ctx.state?.user;
      const list = await ctx.service.bill.list(id);
      const _list = list.filter(e => {
        if (type_id !== 'all') {
          return dayjs(Number(e.date)).format('YYYY-MM') === date && e.type_id === type_id;
        }
        return dayjs(Number(e.date)).format('YYYY-MM')
        === date;
      });
      const _listMap = _list.reduce((acc, cur) => {
        const date = dayjs(Number(cur.date)).format('YYYY-MM-DD');
        const exist = acc?.find(el => el.date === date);
        if (exist) {
          exist.bills.push(cur);
        } else {
          // 没有对应日期的对象则创建一个
          acc.push({
            date,
            bills: [ cur ],
          });
        }
        return acc;
      }, []).sort((a, b) => dayjs(b.date) - dayjs(a.date));

      const paginatedListMap = _listMap.slice(page - 1 * page_size, page * page_size);
      const totalPage = Math.ceil(_listMap.length / page_size);
      const monthList = list.filter(e => {
        return dayjs(Number(e.date)).format('YYYY-MM')
          === date;
      });
      const totalExpense = monthList.reduce((acc, cur) => {
        if (cur.pay_type === PAY_TYPES.EXPENSE) acc += Number(cur.amount);
        return acc;
      }, 0);
      const totalIncome = monthList.reduce((acc, cur) => {
        if (cur.pay_type === PAY_TYPES.INCOME) acc += Number(cur.amount);
        return acc;
      }, 0);

      this.onSuccess({
        list: paginatedListMap,
        totalExpense,
        totalIncome,
        totalPage,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException();
    }
  }

  async detail() {
    const { ctx } = this;
    const { id } = ctx.query;
    try {
      if (!id) {
        throw new HttpException('400', 'Params error, id cannot be empty', null, 400);
      }
      const detail = await ctx.service.bill.detail(id, ctx.state?.user?.id);
      this.onSuccess(detail);
    } catch (error) {
      console.log(error);
      throw new HttpException();
    }
  }

  async update() {
    const { ctx } = this;
    const { id, pay_type, amount, date, type_id, remark } = ctx.request.body;
    if (!id || !pay_type || !amount || !date || !type_id) {
      throw new HttpException('400', 'Params error', null, 400);
    }

    try {
      const params = { id, pay_type, amount, date, type_id, remark, user_id: ctx.state?.user.id };
      const res = await ctx.service.bill.update(params);
      if (res.affectedRows === 1) {
        this.onSuccess();
      } else {
        throw new Error('Id not found');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('500', error.message);
    }
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    if (!id) {
      throw new HttpException('400', 'Params error, id cannot be empty', null, 400);
    }

    try {
      const res = await ctx.service.bill.delete(id);
      if (res.affectedRows === 1) {
        this.onSuccess();
      } else {
        throw new Error('Id not found');
      }
    } catch (error) {
      console.log(error);
      throw new HttpException('500', error.message);
    }
  }

  async stats() {
    const { ctx } = this;
    const { date } = ctx.request.body;
    if (!date) {
      throw new HttpException('400', 'Params error', null, 400);
    }

    try {
      const { id } = ctx.state?.user;
      const source = await ctx.service.bill.list(id);
      const list = source.filter(e => {
        return dayjs(Number(e.date)).format('YYYY-MM') === date;
      }).reduce((acc, cur) => {
        const existBillType = acc.find(e => e.type_id === cur.type_id);
        if (existBillType) {
          existBillType.total_amount = (Number(existBillType.total_amount) + Number(cur.amount)).toFixed(2);
          console.log(existBillType);
        } else {
          acc.push({
            type_id: cur.type_id,
            pay_type: cur.pay_type,
            total_amount: Number(cur.amount).toFixed(2),
          });
        }
        return acc;
      }, []);
      const total_expense = list.reduce((acc, cur) => {
        if (cur.pay_type === PAY_TYPES.EXPENSE) acc += Number(cur.total_amount);
        return acc;
      }, 0);
      const total_income = list.reduce((acc, cur) => {
        if (cur.pay_type === PAY_TYPES.INCOME) acc += Number(cur.total_amount);
        return acc;
      }, 0);
      this.onSuccess({
        total_expense: total_expense.toFixed(2),
        total_income: total_income.toFixed(2),
        list,
      });
    } catch (error) {
      console.log(error);
      throw new HttpException();
    }
  }
}

module.exports = BillController;
