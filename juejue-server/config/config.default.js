/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1713338569306_7909';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    // eslint-disable-next-line array-bracket-spacing
    domainWhiteList: ['*'], // 配置白名单
  };

  config.view = {
    mapping: { '.html': 'ejs' }, // 左边写成.html后缀，会自动渲染.html文件
  };

  exports.mysql = {
    // 单数据库信息配置
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'juejue-cost',
    },
    app: true,
    agent: false,
  };

  // secret加密字符串
  config.jwt = {
    secret: 'Nick',
  };

  // 文件接收形式 file/stream(流)
  config.multipart = {
    mode: 'file',
  };

  // 配置跨域cors
  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许Cookie跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
    ...userConfig,
  };
};
