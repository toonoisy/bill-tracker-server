'use strict';

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const dayjs = require('dayjs');

const BaseController = require('./base');

class UploadController extends BaseController {
  async upload() {
    const { ctx } = this;
    // 获取第一个文件（若批量上传可遍历此数组）
    const file = ctx.request.files[0];
    let uploadDir = '';
    try {
      const f = fs.readFileSync(file.filepath); // 读取文件内容
      const date = dayjs(new Date()).format('YYYYMMDD');
      const dir = path.join(this.config.uploadDir, date);
      // 目录不存在则创建
      await mkdirp(dir);
      uploadDir = path.join(dir, Date.now() + path.extname(file.filename));
      // 写入文件夹
      fs.writeFileSync(uploadDir, f);
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }
    // /public/upload/...
    const data = uploadDir.replace(/app/g, '');
    this.onSuccess(data, 'Upload successed');
  }
}

module.exports = UploadController;
