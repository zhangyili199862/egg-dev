"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);

  router.get("/admin/manager/delete/:id", controller.admin.manager.delete);
  router.get("/admin/manager/create", controller.admin.manager.create);
  router.post("/admin/manager/save", controller.admin.manager.save);
  router.get("/admin/manager", controller.admin.manager.index);
};
