'use strict';

const BaseController = require('./base');
const HttpException = require('../exception/http');
const defultAvatar = 'https://cdn-icons-png.flaticon.com/512/3468/3468306.png';

class UserController extends BaseController {
  async register() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    // 判空
    if (!username || !password) {
      throw new HttpException();
    }
    // 判重
    const userInfo = await ctx.service.user.getUserByName(username);
    if (userInfo && userInfo.id) {
      throw new HttpException('500', 'Username is taken, try a new one', null);
    }
    // 执行注册
    const res = await ctx.service.user.register({
      username,
      password,
      ctime: Date.now(),
      avatar: defultAvatar,
    });
    if (res) {
      this.onSuccess(null, 'Successful registeration');
    } else {
      throw new HttpException();
    }
  }

  async login() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo || !userInfo.id) {
      throw new HttpException('500', 'Your username or password does not match our database');
    }
    if (userInfo && userInfo.id && password !== userInfo.password) {
      throw new HttpException('500', 'Incorrect password', null);
    }
    const token = app.jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
      // 一周有效
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60 * 7),
    }, app.config.jwt.secret);
    // console.log(ctx.state);
    this.onSuccess({ token }, 'Successful login');
  }

  async getUserInfo() {
    const { ctx } = this;
    const { username } = ctx.state?.user;
    const userInfo = await ctx.service.user.getUserByName(username);
    this.onSuccess({
      id: userInfo.id,
      username: userInfo.username,
      signature: userInfo.signature,
      avatar: userInfo.avatar || defultAvatar,
    });
  }

  async editUserInfo() {
    const { ctx } = this;
    const { signature, avatar } = ctx.request.body;
    try {
      const { username } = ctx.state?.user;
      const userInfo = await ctx.service.user.getUserByName(username);
      await ctx.service.user.editUserInfo({
        ...userInfo,
        signature: signature || userInfo.signature,
        avatar: avatar || userInfo.avatar,
      });
      this.onSuccess({
        id: userInfo.id,
        username: userInfo.username,
        signature: signature || userInfo.signature,
        avatar: avatar || userInfo.avatar,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;
