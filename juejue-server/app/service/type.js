'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  // 类型列表
  async list(id = 0) {
    console.log(id, 'id');
    const { app } = this;
    const QUERY_STR = 'id, name, type, user_id';
    const sql = `select ${QUERY_STR} from type where user_id = 0 or user_id = ${id}`;
    try {
      const result = await app.mysql.query(sql);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = TypeService;
