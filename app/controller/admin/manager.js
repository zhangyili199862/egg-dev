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
          action: "/admin/manager",
          // 字段配置
          fields: [
            {
              label: "用户名",
              type: "text",
              name: "username",
              placeholder: "用户名",
              default:"默认值"
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

    //编辑表单页
    async edit() {
      const { ctx, app } = this;
      const id = ctx.params.id;

      let data = await app.model.Manager.findOne({
        where: {
          id,
        },
      });
      if (!data) {
        return await ctx.pageFail("该记录不存在");
      }

      data = JSON.parse(JSON.stringify(data));
      delete data.password;

      await ctx.renderTemplate({
        id,
        title: "修改管理员",
        tempType: "form",
        form: {
          // 提交地址
          action: "/admin/manager/" + id,
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
          // 默认值
          data,
        },
        //修改成功后跳转路径
        successUrl:"/admin/manager"
      });
    }
    async update() {
      const { ctx, app } = this;
      ctx.validate({
        id: {
          type: "int",
          required: true,
        },
        username: {
          type: "string",
          required: true,
          desc: "管理员名称",
        },
        password: {
          type: "string",
          required: false,
          desc: "密码",
        },
      });

      let id = ctx.params.id;
      let { username, password } = ctx.request.body;

      let manager = await app.model.Manager.findOne({
        where: {
          id,
        },
      });
      if (!manager) {
        return ctx.apiFail("该记录不存在");
      }

      const Op = app.Sequelize.Op;

      if (
        await app.model.Manager.findOne({
          where: {
            id: {
              [Op.ne]: id,
            },
            username,
          },
        })
      ) {
        return ctx.apiFail("管理员名称已存在");
      }
      manager.username = username;
      if(password){
        manager.password = password;
      }

      ctx.apiSuccess(await manager.save());
    }
  }
  return Controller;
};
