'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.throw(500,"错误了");
    ctx.apiSuccess("演示数据222")
  }
}

module.exports = HomeController;
