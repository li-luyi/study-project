const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html', {
      title: '我是李里里',
    });
  }

  // 获取用户信息
  async user() {
    // /user/:id参数接收方式
    // const { ctx } = this;
    // const { id } = ctx.params;
    // ctx.body = id;

    // 连接数据库
    const { ctx } = this;
    const result = await ctx.service.home.user();
    ctx.body = result;
  }
  // post请求
  async add() {
    const { ctx } = this;
    const { title } = ctx.request.body;
    // 这里默认是json传递方式
    ctx.body = {
      title,
    };
  }

  // 新增用户
  async addUser() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    try {
      await ctx.service.home.addUser(name);
      ctx.body = {
        code: 200,
        msg: '新增成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '新增失败',
        data: null,
      };
    }
  }

  // 编辑用户信息
  async editUser() {
    const { ctx } = this;
    const { id, name } = ctx.request.body;
    try {
      await ctx.service.home.editUser(id, name);
      ctx.body = {
        code: 200,
        msg: '编辑成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '编辑失败',
        data: null,
      };
    }
  }

  // 删除用户
  async deleteUser() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    try {
      await ctx.service.home.deleteUser(id);
      ctx.body = {
        code: 200,
        msg: '删除成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '删除失败',
        data: null,
      };
    }
  }
}

module.exports = HomeController;
