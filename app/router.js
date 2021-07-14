"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  //首页

  router.get("/admin/manager/delete/:id", controller.admin.manager.delete);
  router.get("/admin/manager/edit/:id", controller.admin.manager.edit);
  router.get("/admin/manager", controller.admin.manager.index);
  router.get("/admin/manager/create", controller.admin.manager.create);
  router.post("/admin/manager", controller.admin.manager.save);
  router.post("/admin/manager/:id", controller.admin.manager.update);
  //登录
  router.get("/admin", controller.admin.home.index);
  router.get("/admin/login", controller.admin.home.login);
  router.get("/admin/logout", controller.admin.home.logout);
  router.post("/admin/loginevent", controller.admin.home.loginevent);
  //用户
  router.get("/admin/user", controller.admin.user.index);
  router.get("/admin/user/create", controller.admin.user.create);
  router.get("/admin/user/edit/:id", controller.admin.user.edit);
  router.get("/admin/user/delete/:id", controller.admin.user.delete);
  router.post("/admin/user", controller.admin.user.save);
  router.post("/admin/user/:id", controller.admin.user.update);
  //礼物
  router.get("/admin/gift", controller.admin.gift.index);
  router.get("/admin/gift/create", controller.admin.gift.create);
  router.get("/admin/gift/edit/:id", controller.admin.gift.edit);
  router.get("/admin/gift/delete/:id", controller.admin.gift.delete);
  router.post("/admin/gift", controller.admin.gift.save);
  router.post("/admin/gift/:id", controller.admin.gift.update);

  //订单
  router.get("/admin/order", controller.admin.order.index);
  router.get("/admin/order/delete/:id", controller.admin.order.delete);
  //直播间
  router.get("/admin/live", controller.admin.live.index);
  //上传文件
  router.post("/admin/upload", controller.admin.common.upload);
};
