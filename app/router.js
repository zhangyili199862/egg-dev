"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;

  router.get("/admin/manager/delete/:id", controller.admin.manager.delete);
  router.get("/admin/manager/edit/:id", controller.admin.manager.edit);
  router.get("/admin/manager", controller.admin.manager.index);
  router.get("/admin/manager/create", controller.admin.manager.create);
  router.post("/admin/manager", controller.admin.manager.save);
  router.post("/admin/manager/:id", controller.admin.manager.update);
  //登录
  router.get("/admin/login", controller.admin.home.login);
  router.post("/admin/loginevent", controller.admin.home.loginevent);
  router.get("/admin/logout", controller.admin.home.logout);
};
