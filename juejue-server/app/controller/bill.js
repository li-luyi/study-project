'use strict';

const moment = require('moment');

const Controller = require('egg').Controller;

class BillController extends Controller {
  // 新增账单
  async add() {
    const { ctx, app } = this;
    // 获取请求中携带的参数
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 判断为空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      // 将user_id加入到每个账单里，方便后续做用户数据过滤
      const result = await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
        pay_type,
        remark,
        user_id: decode.id,
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };
      return result;
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  // 账单列表
  async list() {
    const { ctx, app } = this;
    // 获取日期date,分页数据，类型type_id
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.request.body;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      const user_id = decode.id;
      const _date = moment(date).format('YYYY-MM');
      if (!decode) return;
      // 拿到当前用户的账单列表
      const list = await ctx.service.bill.list(user_id);
      // 过滤出月份和类型所对应的账单列表
      const _list = list.filter(item => {
        // 默认all查询全部数据
        if (type_id !== 'all') {
          return moment(item.date).format('YYYY-MM') === _date && type_id === item.type_id;
        }
        return moment(item.date).format('YYYY-MM') === _date;
      });

      // 格式化数据
      const listMap = _list.reduce((curr, item) => {
        const date = moment(item.date).format('YYYY-MM-DD');
        // 如果找到当前日期的往里追加数据
        if (curr && curr.length && curr.findIndex(c => moment(c.date).format('YYYY-MM-DD') === date) > -1) {
          const index = curr.findIndex(c => moment(c.date).format('YYYY-MM-DD') === date);
          curr[index].bills.push(item);
        }
        // 如果找不到就新建一组当前日期的数据
        if (curr && curr.length && curr.findIndex(c => moment(c.date).format('YYYY-MM-DD') === date) === -1) {
          curr.push({
            date,
            bills: [item],
          });
        }
        // 如果curr为空数组，则默认添加第一个账单项
        if (!curr.length) {
          curr.push({
            date,
            bills: [item],
          });
        }
        return curr;
      }, []).sort((a, b) => moment(b.date) - moment(a.date)); // 按时间排序
      // 分页处理
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      // 计算当月总收入和总支出
      const __list = list.filter(item => moment(item.date).format('YYYY-MM') === _date);
      // 累加计算支出
      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
        }
        console.log(curr, 'curr');
        return curr;
      }, 0);

      // 累加计算收入
      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
        }
        return curr;
      }, 0);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense: totalExpense.toFixed(2),
          totalIncome: totalIncome.toFixed(2),
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },
      };

    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  // 账单详情
  async detail() {
    const { ctx, app } = this;
    const { id = '' } = ctx.query;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;
    // 判断是否传入id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null,
      };
      return;
    }

    try {
      // 从数据库里获取详情
      const detail = await ctx.service.bill.detail(id, user_id);
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  // 编辑账单
  async update() {
    const { ctx, app } = this;
    // 获取账单修改信息
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;
    // 判断为空处理
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      await ctx.service.bill.update({
        id,
        amount,
        type_id,
        type_name,
        pay_type,
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }

  // 删除账单
  async delete() {
    const { ctx, app } = this;
    const { id = '' } = ctx.request.body;
    // 判断是否传入id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null,
      };
      return;
    }
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      // 调用数据库删除
      await ctx.service.bill.delete(id, user_id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }

  // 统计图
  async data() {
    const { ctx, app } = this;
    const { date = '' } = ctx.query;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      const result = await ctx.service.bill.list(user_id);
      // 根据时间参数，筛选出当月的所有的账单数据
      const start = moment(date).startOf('month').unix() * 1000;
      const end = moment(date).endOf('month').unix() * 1000;
      const _data = result.filter(item => (Number(new Date(item.date)) > start && Number(new Date(item.date)) < end));
      // 总支出
      const total_expense = _data.reduce((arr, cur) => {
        if (cur.pay_type === 1) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 总收入
      const total_income = _data.reduce((arr, cur) => {
        if (cur.pay_type === 2) {
          arr += Number(cur.amount);
        }
        return arr;
      }, 0);

      // 获取收支构成
      let total_data = _data.reduce((arr, cur) => {
        const index = arr.findIndex(item => item.type_id === cur.type_id);
        if (index === -1) {
          arr.push({
            type_id: cur.type_id,
            type_name: cur.type_name,
            pay_type: cur.pay_type,
            number: Number(cur.amount),
          });
        }
        if (index > -1) {
          arr[index].number += Number(cur.amount);
        }
        return arr;
      }, []);

      total_data = total_data.map(item => {
        item.number = Number(Number(item.number).toFixed(2));
        return item;
      });
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          total_expense: Number(total_expense).toFixed(2),
          total_income: Number(total_income).toFixed(2),
          total_data: total_data || [],
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = BillController;
