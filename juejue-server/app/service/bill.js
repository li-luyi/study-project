'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  // 新增
  async add(params) {
    const { app } = this;
    try {
      const result = await app.mysql.insert('bill', params);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 列表
  async list(id) {
    const { app } = this;
    const QUERY_STR = 'id,pay_type,amount,date,type_id,type_name,remark';
    const sql = `select ${QUERY_STR} from bill where user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 详情
  async detail(id, user_id) {
    const { app } = this;
    try {
      const result = await app.mysql.get('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 编辑
  async update(params) {
    const { app } = this;
    try {
      // update方法，参数1：数据库表名，2：需要更新的内容， 3：查询参数
      const result = await app.mysql.update('bill', { ...params }, { id: params.id, user_id: params.user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 删除
  async delete(id, user_id) {
    const { app } = this;
    try {
      const result = await app.mysql.delete('bill', { id, user_id });
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = BillService;
