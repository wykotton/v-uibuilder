import { Injectable } from "@nestjs/common";
import { searchSql } from "@/utils/utils";
import { uiBuilderMapping } from "@/dao/uiBuilderMapping";
import { log } from "../../../conf/log";

const mysql = require("mysql");
const moment = require("moment");

@Injectable()
export class ManagementService {
  /**
   * 数据列表
   * @param query
   * @returns
   */
  async pageInfo(query) {
    try {
      const { page = 0, limit = 0, id = null } = query;
      const timeCode = `YYYY-MM-DD HH:mm:ss`;
      let idStr = mysql.raw(``);
      if (id && !Number.isNaN(Number(null))) {
        idStr = mysql.raw(`WHERE id=${id}`);
      }

      const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.pageInfo, [
        idStr,
        (Number(page) - 1) * Number(limit),
        Number(limit),
        idStr,
      ]);
      results.forEach((element) => {
        const theme = JSON.parse(element.theme) || {};
        element.update_time = moment(element.update_time).format(timeCode);
        element.create_time = moment(element.create_time).format(timeCode);
        element.screenImage = theme.screenImage || `../../ui-builder/images/empty.png`;
      });
      return {
        data: results,
        code: 0,
        count: total,
        info: { msg: `success` },
      };
    } catch (error) {
      log.info(error, `页面数据`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 删除页面
   * @param req
   * @returns
   */
  async deleteInfo(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.deleteInfo, [id, userId]);
      return { results, info: { msg: `success` } };
    } catch (error) {
      log.info(error, `页面删除失败`);
      return { results: error, info: { msg: `fail: 页面删除失败` } };
    }
  }

  /**
   * 获取项目列表
   * @param req
   * @returns
   */
  async getProject(req) {
    try {
      const { user = {}, query = {} } = req;
      const { userId = "" } = user;
      const { projectName = "", page = 1, limit = 10, getAll = false } = query;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      let idStr = mysql.raw(``);
      if (userId && !Number.isNaN(Number(null))) {
        if (projectName) {
          idStr = mysql.raw(`WHERE user_id=${userId} AND project_name LIKE '%${String(projectName)}%'`);
        } else {
          idStr = mysql.raw(`WHERE user_id=${userId}`);
        }
      }
      if (getAll) {
        const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getAllProject, [idStr, idStr]);
        return {
          results,
          count: total,
          info: { msg: `success` },
        };
      } else {
        const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getProject, [
          idStr,
          (Number(page) - 1) * Number(limit),
          Number(limit),
          idStr,
        ]);
        return {
          results,
          page,
          limit,
          count: total,
          info: { msg: `success` },
        };
      }
    } catch (error) {
      console.log(error);
      log.info(error, "获取项目信息失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 新增项目
   * @param req
   */
  async saveProject(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { projectName = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectName) {
        return { info: { msg: `fail: 项目名称不能为空` } };
      }
      const createTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.saveProject, [projectName, createTime, createTime, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "新增项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 查询项目信息
   * @param req
   * @returns
   */
  async findProject(req) {
    try {
      const { user = {}, query = {} } = req;
      const { userId = "" } = user;
      const { id = "" } = query;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 项目id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [id, userId]);
      if (project[0]?.id) {
        const page = await searchSql(uiBuilderMapping.findProjectPage, [project[0].id]);
        // const temp = page.map((item) => {
        //   Reflect.deleteProperty(item, 'custom_model');
        //   Reflect.deleteProperty(item, 'theme');
        //   return item;
        // });
        project[0].pageList = page;
      }
      return { results: project, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "查询项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 查询单个项目的数据,供预览使用,不校验用户权限
   * @param query
   * @returns
   */
  async previewProject(query) {
    try {
      const { id = "" } = query;
      if (!id) {
        return { info: { msg: `fail: 项目id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.previewProject, [id]);
      if (project[0]?.id) {
        const page = await searchSql(uiBuilderMapping.findProjectPage, [project[0].id]);
        project[0].pageList = page;
      }
      return { results: project, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "查询项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 修改项目配置数据
   * @param body
   * @returns
   */
  async updateProject(body) {
    try {
      const { id = "", data = {} } = body;
      if (!id) {
        return { info: { msg: `fail: 项目id不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateProject, [JSON.stringify(data), updateTime, id]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "修改项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 修改项目名称
   * @param req
   * @returns
   */
  async updateProjectName(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", projectName = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id || !projectName) {
        return { info: { msg: `fail: 项目id或项目名不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateProjectName, [projectName, updateTime, id, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "修改项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 导入项目
   * @param req
   * @returns
   */
  async importProject(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { project = [] } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!project || !Array.isArray(project)) {
        return { info: { msg: `fail: 项目信息有误` } };
      }
      const createTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let importProject = 0;
      let importPage = 0;
      let errorPage = 0;
      for (const item of project) {
        const { project_name = "", pageList = [], data = "", child_page = "" } = item;
        if (!project_name || !Array.isArray(pageList) || !pageList.length) continue;
        const results = await searchSql(uiBuilderMapping.importProject, [
          project_name,
          createTime,
          createTime,
          userId,
          data,
          child_page,
        ]);
        if (results?.id) {
          importProject++;
          for (const page of pageList) {
            const { custom_model = "", theme = "", page_name = "" } = page;
            if (!custom_model || !theme || !page_name) {
              errorPage++;
              continue;
            }
            const pageResults = await searchSql(uiBuilderMapping.saveInfo, [
              custom_model,
              createTime,
              createTime,
              theme,
              userId,
              results.id,
              page_name,
            ]);
            if (pageResults) importPage++;
          }
        }
      }
      return { importProject, importPage, errorPage, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "导入项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 删除项目
   * @param req
   * @returns
   */
  async deleteProject(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 项目id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.deleteProject, [id, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "删除项目失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 获取站点列表
   * @param req
   * @returns
   */
  async getWebsite(req) {
    try {
      const { user = {}, query = {} } = req;
      const { userId = "" } = user;
      const { websiteName = "", page = 1, limit = 10, getAll = false } = query;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      let idStr = mysql.raw(``);
      if (userId && !Number.isNaN(Number(null))) {
        if (websiteName) {
          idStr = mysql.raw(`WHERE user_id=${userId} AND website_name LIKE '%${String(websiteName)}%'`);
        } else {
          idStr = mysql.raw(`WHERE user_id=${userId}`);
        }
      }
      if (getAll) {
        const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getAllWebsite, [idStr, idStr]);
        return {
          results,
          count: total,
          info: { msg: `success` },
        };
      } else {
        const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getWebsite, [
          idStr,
          (Number(page) - 1) * Number(limit),
          Number(limit),
          idStr,
        ]);
        return {
          results,
          page,
          limit,
          count: total,
          info: { msg: `success` },
        };
      }
    } catch (error) {
      console.log(error);
      log.info(error, "获取站点信息失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 查询站点信息
   * @param req
   * @returns
   */
  async findWebsite(req) {
    try {
      const { user = {}, query = {} } = req;
      const { userId = "" } = user;
      const { websiteId = "" } = query;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!websiteId) {
        return { code: 401, info: { msg: `fail: 站点id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findWebsite, [websiteId]);
      if (results[0]) {
        if (String(userId) === String(results[0].user_id)) {
          return { code: 200, results, info: { msg: `success` } };
        } else {
          return { code: 403, results, info: { msg: `success` } };
        }
      } else {
        return { code: 404, results, info: { msg: `success` } };
      }
    } catch (error) {
      log.info(error, "查询站点信息失败");
      return { code: 500, results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 查询站点信息,供预览使用,不校验用户权限
   * @param query
   * @returns
   */
  async previewWebsite(query) {
    try {
      const { websiteId = "" } = query;
      if (!websiteId) {
        return { code: 401, info: { msg: `fail: 站点id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findWebsite, [websiteId]);
      if (results[0]) {
        return { code: 200, results, info: { msg: `success` } };
      } else {
        return { code: 404, results, info: { msg: `success` } };
      }
    } catch (error) {
      log.info(error, "查询站点信息失败");
      return { code: 500, results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 新增站点
   * @param req
   */
  async saveWebsite(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { websiteName = "未命名", config = {} } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      const createTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.saveWebsite, [
        websiteName,
        JSON.stringify(config),
        createTime,
        createTime,
        userId,
      ]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "新增站点失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 修改站点
   * @param req
   * @returns
   */
  async updateWebsite(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", websiteName = "未命名", config = {} } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { code: 401, info: { msg: `fail: 站点id不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateWebsite, [
        websiteName,
        JSON.stringify(config),
        updateTime,
        id,
        userId,
      ]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      log.info(error, "修改站点失败");
      return { code: 500, results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 修改项目名称
   * @param req
   * @returns
   */
  async updateWebsiteName(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", websiteName = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id || !websiteName) {
        return { info: { msg: `fail: 站点id或站点名称不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateWebsiteName, [websiteName, updateTime, id, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "修改站点名称失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 删除站点
   * @param req
   * @returns
   */
  async deleteWebsite(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 站点id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.deleteWebsite, [id, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "删除站点失败");
      return { results: error, info: { msg: "fail" } };
    }
  }
}
