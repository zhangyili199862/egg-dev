"use strict";
const crypto = require('crypto');
module.exports = (app) => {
  class Controller extends app.Controller {
    async login() {
      let { ctx } = this;
      await ctx.render("admin/home/login.html");
    }
    async loginevent() {
      let { ctx, app } = this;
      //参数验证
      ctx.validate({
        username: {
          type: "string",
          required: true,
          desc: "用户名",
        },
        password: {
          type: "string",
          required: true,
          desc: "密码",
        },
      });
      let { username, password } = ctx.request.body;
      let manager = await app.model.Manager.findOne({
        where: {
          username,
        },
      });
      if (!manager) {
        ctx.throw(400, "该管理员不存在");
      }
      await this.checkPassword(password, manager.password);
      ctx.session.auth = manager;
      return ctx.apiSuccess("ok");
    }
    async checkPassword(password, hash_password) {
      // 先对需要验证的密码进行加密
      const hmac = crypto.createHash("sha256", this.app.config.crypto.secret);
      hmac.update(password);
      password = hmac.digest("hex");
      let res = password === hash_password;
      if (!res) {
        this.ctx.throw(400, "密码错误");
      }
      return true;
    }
  }
  return Controller;
};
