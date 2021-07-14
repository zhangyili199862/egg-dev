"use strict";

module.exports = (app) => {
  class Controller extends app.Controller {
    async index() {
      const { ctx, app } = this;
      let tabs = [
        { name: "全部", url: "/admin/live", active: false },
        { name: "直播中", url: "?status=1", status: 1, active: false },
        { name: "未开播", url: "?status=0", status: 2, active: false },
        { name: "已结束", url: "?status=3", status: 3, active: false },
      ];

      tabs = tabs.map((item) => {
        if (
          (!ctx.query.status &&
            ctx.query.status != 0 &&
            item.url === "/admin/live") ||
          item.status == ctx.query.status
        ) {
          item.active = true;
        }
        return item;
      });
      let where =
        !ctx.query.status && ctx.query.status != 0
          ? {}
          : { status: ctx.query.status };
      let data = await ctx.page("Live", where, {
        include: [
          {
            model: app.model.User,
            attributes: ["id", "username"],
          },
        ],
      });

      data = JSON.parse(JSON.stringify(data));
      await ctx.renderTemplate({
        title: "直播列表",
        tempType: "table",
        table: {
          tabs,
          // 表头
          columns: [
            {
              title: "直播间",
              fixed: "left",
              render(item) {
                let image =
                  item.cover || "/public/assets/img/profiles/avatar-01.jpg";
                return `
                              <h2 class="table-avatar">
                                  <a class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle bg-light" src="${image}"></a>
                                  <a>${item.title}
                                  <span>创建人：${item.user.username}</span>
                                  </a>
                              </h2>`;
              },
            },
            {
              title: "观看人数",
              key: "look_count",
              fixed: "center",
            },
            {
              title: "金币数",
              key: "coin",
              fixed: "center",
            },
            {
              title: "创建时间",
              key: "created_time",
              width: 180,
              fixed: "center",
            },

            {
              title: "操作",
              width: 200,
              fixed: "center",
              render(item) {
                return `
                  <div class="actions btn-group btn-group-sm">
                      <a class="btn btn-sm bg-primary text-white"
                      @click="openInfo('/admin/live/look/${item.id}','观看记录')">
                      观看记录</a> 
                      <a class="btn btn-sm bg-purple text-white">
                      礼物记录</a> 
                      <a class="btn btn-sm bg-success text-white">
                      弹幕记录</a> 
                      <a class="btn btn-sm bg-warning text-white">
                      关闭直播</a> 
                      <a class="btn btn-sm bg-danger text-white" href="/admin/live/delete/${item.id}">
                      删除</a></div>
                  `;
              },
            },
          ],
        },
        data,
      });
    }
  }
  return Controller;
};
