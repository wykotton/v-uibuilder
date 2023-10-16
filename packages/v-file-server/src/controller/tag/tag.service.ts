import { Injectable } from "@nestjs/common";
import { searchSql } from "@/utils/utils";
import { uiBuilderMapping } from "@/dao/uiBuilderMapping";
import { log } from "../../../conf/log";
import _ from 'lodash';
const moment = require('moment');
const mysql = require("mysql");

@Injectable()
export class FilesTagService {
  
  /**
   * 添加标签
   * @param data
   */
  async saveFilesTag(data) {
    try {
      const { body, req: { user: { userId = '', username = '' } } } = data;
      if (!body.title) return { results: '标签名不能为空', info: { msg: `fail` } }; 
      const isexist = await searchSql(uiBuilderMapping.findFilesTag, [body.title.trim()]);
      if(isexist && isexist.length) return { results: '已存在同名标签', info: { msg: `fail` } }; 
      const params = {
        title: body.title,
        type: body.type,
        desc: body.desc,
        create_user: username,
        update_user: username,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      const results = await searchSql(uiBuilderMapping.saveFilesTag, Object.values(params));
      return { results, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查询元件集合失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查询单元件集合
   * @param data
   */
  async getFilesTag(data) {
    try {
      const { query, req: { user: { userId = '', username = '' } } } = data;
      const { page = 1, size = 10, title="" } = query;

      let idStr = mysql.raw(``);
      idStr = mysql.raw(`WHERE title LIKE '%${String(title)}%'`);
      const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getFilesTag, [
        idStr,
        (Number(page) - 1) * Number(size),
        Number(size),
        idStr
      ]);
      return {
        results,
        page,
        size,
        total,
        info: { msg: `success` },
      };
    } catch (error) {
      console.log(error);
      log.info(error, `查询失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  /**
   * 删除文件
   * @param data
   */
   async deleteFilesTag(data) {
    try {
      const { body, req: { user: { userId = '', username = '' } } } = data;
      const { ids = [] } = body;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: 文件id不能为空` } };
      }
      let idStr = mysql.raw(``);
      if (username !== "root") idStr = mysql.raw(`AND create_user="${username}"`);
      for (const id of ids) {
        await searchSql(uiBuilderMapping.deleteFilesTag, [id, idStr]);
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除文件失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  /**
   * 更新文件
   * @param data
   */
   async updateFilesTag(data) {
    try {
      const { id, body, req: { user: { userId = '', username = '' } } } = data;
      const { originalname } = body;

      let idStr = mysql.raw(``);
      if (username !== "root") idStr = mysql.raw(`AND uploader="${username}"`);
      await searchSql(uiBuilderMapping.updateFilesTag, [originalname, moment().format('YYYY-MM-DD HH:mm:ss'), id, idStr]);
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除文件失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  
}
