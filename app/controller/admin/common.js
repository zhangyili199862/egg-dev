"use strict";
const fs = require("fs");
const path = require("path");

//异步二进制 写入流
const awaitWriteStream = require("await-stream-ready").write;
//管道读入一个虫洞
const sendToWormhole = require("stream-wormhole");
const dayjs = require('dayjs');
module.exports = (app) => {
  class Controller extends app.Controller {
    async upload() {
      const { ctx } = this;
      const stream = await ctx.getFileStream();

      //基础目录
      const uploadBasePath = "app/public/uploads";

      //生成唯一文件名
      const filename = `${Date.now()}${path
        .extname(stream.filename)
        .toLocaleLowerCase()}`;
      //生成文件夹
      const dirname = dayjs(Date.now()).format("YYYY/MM/DD");
      function mkdirSync(dirname) {
        if (fs.existsSync(dirname)) {
          return true;
        } else {
          if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
          }
        }
      }
      mkdirSync(path.join(uploadBasePath, dirname));

      //生成写入路径
      const target = path.join(uploadBasePath, dirname, filename);
      //获取写入流
      const writeStream = fs.createWriteStream(target);

      try {
        //异步写入文件流
        await awaitWriteStream(stream.pipe(writeStream));
      } catch (error) {
        //出现错误，关闭管道
        await sendToWormhole(stream);
        ctx.throw(500, error);
      }

      let url = path
        .join("/public/uploads", dirname, filename)
        .replace(/\\|\//g, "/");
      ctx.apiSuccess({ url });
    }
  }
  return Controller;
};
