"use strict";
module.exports = (app) => {
  class Controller extends app.Controller {
    //列表

    async index() {
      const { ctx, app } = this;
      let data = await ctx.page("Manager");
      await ctx.renderTemplate({
        title: "管理员列表",
        tempType: "table",
        table: {
          // 按鈕
          buttons: {
            add: "/admin/manager/create",
          },
          //表頭
          columns: [
            {
              title: "管理员",
              key: "username",
              fixed: "left",
            },
            {
              title: "创建时间",
              key: "created_time",
              fixed: "center",
              width: 180,
            },
            {
              title: "操作",
              width: 200,
              fixed: "center",
              action: {
                edit: function (id) {
                  return `/admin/manager/edit/${id}`;
                },
                delete: function (id) {
                  return `/admin/manager/delete/${id}`;
                },
              },
            },
          ],
        },
        data,
      });
      // await ctx.render('admin/manager/index.html',{
      //     data
      // })
    }
    //创建管理员表单
    async create() {
      const { ctx } = this;

      await ctx.renderTemplate({
        // 页面标题
        title: "创建管理员",
        // 模板类型 form表单，table表格分页
        tempType: "form",
        // 表单配置
        form: {
          // 提交地址
          action: "/admin/manager/create",
          // 字段配置
          fields: [
            {
              label: "用户名",
              type: "text",
              name: "username",
              placeholder: "用户名",
            },
            {
              label: "密码",
              type: "text",
              name: "password",
              placeholder: "密码",
            },
          ],
        },
        // 新增成功跳转路径
        successUrl: "/admin/manager",
      });
    }
    //创建管理员逻辑
    async save() {
      const { ctx, app } = this;

      ctx.validate({
        username: {
          type: "string",
          required: true,
          desc: "管理员账户",
        },
        password: {
          type: "string",
          required: true,
          desc: "密码",
        },
      });
      let { username, password } = ctx.request.body;

      if (
        await app.model.Manager.findOne({
          where: {
            username,
          },
        })
      ) {
        return ctx.apiFail("该管理员已存在");
      }
      let manager = await app.model.Manager.create({
        username,
        password,
      });

      ctx.apiSuccess(manager);
    }

    async delete() {
      const { ctx, app } = this;
      const id = ctx.params.id;
      await app.model.Manager.destroy({
        where: {
          id,
        },
      });
      ctx.toast("删除成功", "success");
      ctx.redirect("/admin/manager");
    }
  }
  return Controller;
};
