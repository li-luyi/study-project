'use strict';

const Controller = require('egg').Controller;

// 默认头像
const defaultAvatar = 'https://nimg.ws.126.net/?url=http%3A%2F%2Fdingyue.ws.126.net%2F2023%2F0117%2F5c237053j00romohz0023d200u000vbg0099009n.jpg&thumbnail=660x2147483647&quality=80&type=jpg';

class UserController extends Controller {
  // 注册
  async register() {
    const { ctx } = this;
    // 获取注册需要的参数
    const { username, password } = ctx.request.body;

    // 判断注册信息为空抛错
    if (!username || !password) {
      ctx.body = {
        code: 500,
        meg: '账号密码不能为空！',
        data: null,
      };
      return;
    }

    // 验证数据库内是否已经存有该账户名
    const userInfo = await ctx.service.user.getUserByName(username);
    // 判断是否已经存在用户
    if (userInfo && userInfo.id) {
      ctx.body = {
        code: 500,
        meg: '账户名已被注册，请重新输入',
        data: null,
      };
      return;
    }

    // 数据存入数据库
    const result = await ctx.service.user.register({
      username,
      password,
      signature: '世界和平',
      avatar: defaultAvatar,
    });

    if (result) {
      ctx.body = {
        code: 200,
        meg: '注册成功',
        data: null,
      };
    } else {
      ctx.body = {
        code: 500,
        meg: '注册失败',
        data: null,
      };
    }
  }

  // 登录
  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    // 根据用户名，在数据库找相对应的id操作
    const userInfo = await ctx.service.user.getUserByName(username);
    // 没有找到用户抛错
    if (!userInfo || !userInfo.id) {
      ctx.body = {
        code: 500,
        meg: '账号不存在',
        data: null,
      };
      return;
    }
    // 找到用户，并且判断输入密码与数据库中的用户密码
    if (userInfo && password !== userInfo.password) {
      ctx.body = {
        code: 500,
        msg: '账号密码错误',
        data: null,
      };
      return;
    }

    // 生成token
    // jwt.sign 方法接受两个参数，第一个对象，对象是需要加密的内容，第二个要加密字符串
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // token有效期24小时
    }, app.config.jwt.secret);

    ctx.body = {
      code: 200,
      msg: '登录成功',
      data: {
        token,
      },
    };
  }

  // 测试
  async test() {
    const { ctx, app } = this;
    // 通过token解析拿到user_id
    const token = ctx.request.header.authorization;
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      msg: '获取成功',
      data: {
        ...decode,
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    // 解析token获取用户信息
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    // 通过用户名查询数据库里的用户信息
    const userInfo = await ctx.service.user.getUserByName(decode.username);
    // 返回用户信息
    ctx.body = {
      code: 200,
      msg: '请求成功',
      data: {
        id: userInfo.id,
        username: userInfo.username,
        signature: userInfo.signature,
        avatar: userInfo.avatar || defaultAvatar,
      },
    };
  }

  // 编辑用户信息
  async editUserInfo() {
    const { ctx, app } = this;
    // 通过post接口获取用户修改的signaturen,avatar
    const { signature = '', avatar = '' } = ctx.request.body;

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature,
        avatar,
      });

      ctx.body = {
        code: 200,
        msg: '编辑成功',
        data: {
          id: decode.id,
          signature,
          username: userInfo.username,
          avatar,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '编辑失败',
        data: null,
      };
    }
  }

  // 修改密码
  async modifyPass() {
    const { ctx, app } = this;
    // 通过post接口获取用户修改的signaturen,avatar
    const { old_pass, new_pass, again_pass } = ctx.request.body;
    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const userInfo = await ctx.service.user.getUserByName(decode.username);
      if (!old_pass || !new_pass || !again_pass) {
        ctx.body = {
          code: 500,
          msg: '参数错误',
          data: null,
        };
        return;
      }
      if (new_pass !== again_pass) {
        ctx.body = {
          code: 500,
          msg: '新密码输入不一致',
          data: null,
        };
        return;
      }
      if (old_pass !== userInfo.password) {
        ctx.body = {
          code: 500,
          msg: '原密码不正确',
          data: null,
        };
        return;
      }
      if (old_pass !== userInfo.password) {
        ctx.body = {
          code: 500,
          msg: '原密码不正确',
          data: null,
        };
        return;
      }
      await ctx.service.user.editUserInfo({ ...userInfo, password: new_pass });
      ctx.body = {
        code: 200,
        msg: '修改成功',
        data: null,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: '修改失败',
        data: null,
      };
    }
  }
}

module.exports = UserController;
