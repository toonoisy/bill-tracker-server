'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtAuth(app.config.jwt.secret);

  // html
  router.get('/', controller.home.index);
  // user
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  router.post('/api/user/reset_password', _jwt, controller.user.resetPassword);
  // upload
  router.post('/api/upload', controller.upload.upload);
  // type
  router.get('/api/type/list', _jwt, controller.type.list);
  // bill
  router.get('/api/bill/list', _jwt, controller.bill.list);
  router.post('/api/bill/item', _jwt, controller.bill.add);
  router.get('/api/bill/item', _jwt, controller.bill.detail);
  router.put('/api/bill/item', _jwt, controller.bill.update);
  router.delete('/api/bill/item', _jwt, controller.bill.delete);
  router.post('/api/bill/stats', _jwt, controller.bill.stats);
};
