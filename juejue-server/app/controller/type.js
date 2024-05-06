'use strict';

const Controller = require('egg').Controller;

class TypeController extends Controller {
  async list() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    try {
      const list = await ctx.service.type.list();
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: list,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: error,
      };
    }
  }
}

module.exports = TypeController;
