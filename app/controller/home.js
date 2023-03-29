'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('upload-demo.html', {
      title: 'BillTracker | Pic Upload',
    });
  }
}

module.exports = HomeController;
