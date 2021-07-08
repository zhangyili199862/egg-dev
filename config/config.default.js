/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1624503257180_9377";

  // add your middleware config here
  config.middleware = ["errorHandler", "adminAuth"];

  config.adminAuth ={
    ignore:[
      '/api',
      '/admin/login',
      '/admin/loginevent'
    ]
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.security = {
    // 关闭 csrf
    csrf: {
      headerName: "x-csrf-token",
      ignore: (ctx) => {
        return ctx.request.url.startsWith("/api");
      },
    },
    // 跨域白名单
    // domainWhiteList: ['http://localhost:3000'],
  };
  // 允许跨域的方法
  config.cors = {
    origin: "*",
    allowMethods: "GET, PUT, POST, DELETE, PATCH",
  };

  //数据库配置
  config.sequelize = {
    dialect: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: "root",
    port: 3306,
    database: "egg-live",
    // 中国时区
    timezone: "+08:00",
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      createdAt: "created_time",
      updatedAt: "updated_time",
      // deletedAt: 'deleted_time',
      // 所有驼峰命名格式化
      underscored: true,
    },
  };
  config.view = {
    mapping: {
      ".html": "nunjucks",
    },
  };
  config.valparams = {
    locale: "zh-cn",
    throwError: true,
  };
  config.crypto = {
    secret: "qhdgw@45ncashdaksh2!#@3nxjdas*_672",
  };
  config.session = {
    // 在有些场景下，我们希望用户如果长时间都在访问我们的站点，则延长他们的 Session 有效期，不让用户退出登录态
    renew: true,
    // key 代表了存储 Session 的 Cookie 键值对的 key 是什么
    key: "EGG_SESS",
    // 最长保存时间（毫秒）
    maxAge: 24 * 3600 * 1000 * 30, // 30 天
    // 设置键值对是否可以被 js 访问，默认为 true，不允许被 js 访问。
    httpOnly: true,
    // 加密
    encrypt: true,
  };
  return {
    ...config,
    ...userConfig,
  };
};
