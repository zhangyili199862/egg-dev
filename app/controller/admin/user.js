"use strict";

module.exports = (app) => {
  class Controller extends app.Controller {
    //列表

    async index() {
      const { ctx, app } = this;
      let data = await ctx.page("User");
      await ctx.renderTemplate({
        title: "用户列表",
        tempType: "table",
        table: {
          // 按鈕
          buttons: {
            add: "/admin/user/create",
          },
          //表頭
          columns: [
            {
              title: "用户",
              fixed: "left",
              render(item) {
                let avatar =
                  item.avatar || "/public/assets/img/profiles/avatar-01.jpg";
                return `
                        <h2 class="table-avatar">
                            <a class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle bg-light" src="${avatar}"></a>
                            <a>${item.username}</a>
                        </h2>`;
              },
            },
            {
              title: "金币",
              key: "coin",
              fixed: "center",
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
                  return `/admin/user/edit/${id}`;
                },
                delete: function (id) {
                  return `/admin/user/delete/${id}`;
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
    //创建用户表单
    async create() {
      const { ctx } = this;

      await ctx.renderTemplate({
        // 页面标题
        title: "创建用户",
        // 模板类型 form表单，table表格分页
        tempType: "form",
        // 表单配置
        form: {
          // 提交地址
          action: "/admin/user",
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
            {
              label: "头像",
              type: "text",
              name: "avatar",
              placeholder: "头像",
            },
            {
              label: "金币",
              type: "number",
              name: "coin",
              placeholder: "用户名",
            },
          ],
        },

        // 新增成功跳转路径
        successUrl: "/admin/user",
      });
    }
    //创建用户逻辑
    async save() {
      const { ctx, app } = this;

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
        avatar: {
          type: "string",
          required: false,
          desc: "头像",
        },
        coin: {
          type: "int",
          required: true,
          defValue: 0,
          desc: "金币",
        },
      });
      let { username, password, avatar, coin } = ctx.request.body;

      if (
        await app.model.User.findOne({
          where: {
            username,
          },
        })
      ) {
        return ctx.apiFail("该用户已存在");
      }
      let user = await app.model.User.create({
        username,
        password,
        avatar,
        coin,
      });

      ctx.apiSuccess(user);
    }
    //编辑表单页
    async edit() {
      const { ctx, app } = this;
      const id = ctx.params.id;

      let data = await app.model.User.findOne({
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
        title: "修改用户",
        tempType: "form",
        form: {
          // 提交地址
          action: "/admin/user/" + id,
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
            {
              label: "头像",
              type: "text",
              name: "avatar",
              placeholder: "头像",
            },
            {
              label: "金币",
              type: "number",
              name: "coin",
              placeholder: "用户名",
              default: 0,
            },
          ],
          // 默认值
          data,
        },
        //修改成功后跳转路径
        successUrl: "/admin/user",
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
          desc: "用户名",
        },
        password: {
          type: "string",
          required: false,
          desc: "密码",
        },
        avatar: {
          type: "string",
          required: false,
          desc: "头像",
        },
        coin: {
          type: "int",
          required: true,
          defValue: 0,
          desc: "金币",
        },
      });

      let id = ctx.params.id;
      let { username, password, avatar, coin } = ctx.request.body;

      let user = await app.model.User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        return ctx.apiFail("该记录不存在");
      }

      const Op = app.Sequelize.Op;

      if (
        await app.model.User.findOne({
          where: {
            id: {
              [Op.ne]: id,
            },
            username,
          },
        })
      ) {
        return ctx.apiFail("用户名已存在");
      }
      user.username = username;
      if (password) {
        user.password = password;
      }

      ctx.apiSuccess(await user.save());
    }
    //删除用户
    async delete() {
      const { ctx, app } = this;
      const id = ctx.params.id;
      await app.model.User.destroy({
        where: {
          id,
        },
      });
      ctx.toast("删除成功", "success");
      ctx.redirect("/admin/user");
    }
  }
  return Controller;
};
