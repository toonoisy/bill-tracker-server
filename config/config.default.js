/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  // 通过 app.config.xxx 可获取属性
  const config = exports = {};

  exports.mysql = {
    // 单数据库信息配置
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '',
      database: 'bill-tracker',
    },
    app: true, // 是否加载到 app 上，默认开启
    agent: false, // 是否加载到 agent 上，默认关闭
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1678756932686_9198';

  // add your middleware config here
  config.middleware = [ 'errHandler' ];

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ],
  };

  config.jwt = {
    secret: 'cornerstone',
  };

  config.multipart = {
    // 通过 ctx.request.files 可获取前端上传的文件
    mode: 'file',
  };

  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.view = {
    mapping: {
      // 将 view 文件夹下的 .html 后缀的文件，识别为 .ejs
      '.html': 'ejs',
    },
  };

  // add your user config here
  // 可通过 this.config.xxx 访问
  const userConfig = {
    uploadDir: 'app/public/upload',
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
