import { Injectable } from "@nestjs/common";
import { searchSql } from "@/utils/utils";
import { uiBuilderMapping } from "@/dao/uiBuilderMapping";
import { log } from "../../../conf/log";

const moment = require("moment");

@Injectable()
export class EditService {
  /**
   * 获取页面数据
   * @param body
   * @returns
   */
  async systemFind(req) {
    try {
      const { user = {}, query = {} } = req;
      const { id = "" } = query;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { code: 401, info: { msg: `fail: 页面id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findInfo, [id]);
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
      log.info(error, `获取页面实例数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 获取页面数据,供预览使用,不校验用户权限
   * @param query
   * @returns
   */
  async previewPage(query) {
    try {
      const { id = "" } = query;
      if (!id) {
        return { code: 401, info: { msg: `fail: 页面id不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findInfo, [id]);
      if (results[0]) {
        return { code: 200, results, info: { msg: `success` } };
      } else {
        return { code: 404, results, info: { msg: `success` } };
      }
    } catch (error) {
      log.info(error, `获取页面实例数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 新增页面
   * @param body
   * @returns
   */
  async systemSave(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { DesignerPage = {}, theme = {}, projectId, pageName = "新建页面" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectId) {
        return { info: { msg: `fail: 项目id不能为空` } };
      }
      if (!Object.keys(theme).length) {
        theme.width = 1920;
        theme.height = 1080;
        theme.middleWidth = 80;
        theme.rightWidth = 20;
        theme.middleTopHeight = 15;
        theme.middleCenterHeight = 70;
        theme.middleBottomHeight = 15;
      }
      const createTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.saveInfo, [
        JSON.stringify(DesignerPage),
        createTime,
        createTime,
        JSON.stringify(theme),
        userId,
        projectId,
        pageName,
      ]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, "保存图形数据失败");
      return { results: error, info: { msg: "fail" } };
    }
  }

  /**
   * 更新页面
   * @param body
   * @returns
   */
  async systemUpdate(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { DesignerPage, theme = {}, pageName = "未命名", id } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateInfo, [
        JSON.stringify(DesignerPage),
        updateTime,
        JSON.stringify(theme),
        pageName,
        id,
        userId,
      ]);
      return { results, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `更新失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 修改页面名称
   * @param body
   * @returns
   */
  async updatePageName(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", pageName = "" } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      if (!pageName) {
        return { info: { msg: `fail: 页面名称不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.updatePageName, [pageName, id, userId]);
      return { results, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, `修改页面名称失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 获取元件集合列表
   * @param query
   */
  async getCombination(query) {
    try {
      const { userId = "", simple = false } = query;
      const results = await searchSql(uiBuilderMapping.getCombination, [userId]);
      if (simple) {
        const temp = results.map((item) => {
          item.componentName = item.component_name;
          try {
            if (typeof item.group === "string") item.group = JSON.parse(item.group);
          } catch (error) {}
          Reflect.deleteProperty(item, "component_name");
          Reflect.deleteProperty(item, "options");
          Reflect.deleteProperty(item, "children");
          return item;
        });
        return { results: temp, info: { msg: `success` } };
      }
      const temp = results.map((item) => {
        item.componentName = item.component_name;
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        Reflect.deleteProperty(item, "component_name");
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `元件集合列表获取失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查询单元件集合
   * @param query
   */
  async searchCombination(query) {
    try {
      const { userId = "", text = "", id = "" } = query;
      let results = [];
      if (text) {
        results = await searchSql(uiBuilderMapping.searchCombination, [userId, text]);
      } else if (id) {
        results = await searchSql(uiBuilderMapping.searchCombinationById, [id]);
      }
      const temp = results.map((item) => {
        item.componentName = item.component_name;
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        Reflect.deleteProperty(item, "component_name");
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查询元件集合失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查找多元件集合
   * @param query
   */
  async findCombination(query) {
    try {
      const { ids = [] } = query;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: id不能为空` } };
      }
      const results = [];
      for (const id of ids) {
        const temp = await searchSql(uiBuilderMapping.findCombination, [id]);
        results.push(...temp);
      }
      const temp = results.map((item) => {
        item.componentName = item.component_name;
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        Reflect.deleteProperty(item, "component_name");
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查找多元件集合失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 保存元件集合
   * @param body
   */
  async saveCombination(body) {
    try {
      const { userId = "", data = [] } = body;
      if (!data.length) {
        return { info: { msg: `fail: 元件集合数据缺失` } };
      }
      for (const item of data) {
        const { componentName, text, type } = item;
        let { group, options, children, router, attrBind } = item;
        typeof group !== "string" && (group = JSON.stringify(group));
        typeof options !== "string" && (options = JSON.stringify(options));
        typeof children !== "string" && (children = JSON.stringify(children));
        typeof router !== "string" && (router = JSON.stringify(router));
        typeof attrBind !== "string" && (attrBind = JSON.stringify(attrBind));
        const results = await searchSql(uiBuilderMapping.searchCombination, [userId, text]);
        const time = moment().format("YYYY-MM-DD HH:mm:ss");
        if (results[0]) {
          await searchSql(uiBuilderMapping.updateCombination, [
            userId,
            componentName,
            time,
            text,
            type,
            group,
            options,
            children,
            router,
            attrBind,
            results[0].id,
          ]);
        } else {
          await searchSql(uiBuilderMapping.saveCombination, [
            userId,
            componentName,
            time,
            time,
            text,
            type,
            group,
            options,
            children,
            router,
            attrBind,
          ]);
        }
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `元件集合保存失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 修改元件集合名称
   * @param req
   * @returns
   */
  async updateCombinationName(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", text = "" } = body;
      if (!id) {
        return { info: { msg: `fail: 元件集合id不能为空` } };
      }
      if (!text) {
        return { info: { msg: `fail: 元件集合名称不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findCombination, [id]);
      if (!results.length) {
        return { info: { msg: "fail: 此元件集合不存在!" } };
      }
      if (String(results[0].user_id) && String(results[0].user_id) !== String(userId)) {
        return { info: { msg: "fail: 无权更改此元件集合名称!" } };
      }
      const results2 = await searchSql(uiBuilderMapping.searchCombination, [userId, text]);
      if (results2.length) {
        return { info: { msg: "fail: 此元件集合名称已存在!" } };
      }
      const user_id = String(results[0].user_id) ? userId : "";
      const results3 = await searchSql(uiBuilderMapping.updateCombinationName, [text, id, user_id]);
      return { results3, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, `修改元件集合名称失败`);
      return { results: error, info: { msg: `fail: 修改元件集合名称失败` } };
    }
  }

  /**
   * 删除元件集合
   * @param query
   */
  async deleteCombination(body) {
    try {
      const { userId, ids = [] } = body;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: 元件集合id不能为空` } };
      }
      for (const id of ids) {
        await searchSql(uiBuilderMapping.deleteCombination, [id, userId]);
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除元件集合失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 获取页面库列表
   * @param query
   */
  async getPageWarehouse(query) {
    try {
      const { userId = "", simple = false } = query;
      const results = await searchSql(uiBuilderMapping.getPageWarehouse, [userId]);
      if (simple) {
        const temp = results.map((item) => {
          try {
            if (typeof item.group === "string") item.group = JSON.parse(item.group);
          } catch (error) {}
          Reflect.deleteProperty(item, "custom_model");
          return item;
        });
        return { results: temp, info: { msg: `success` } };
      }
      const temp = results.map((item) => {
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `页面列表获取失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查询单页面
   * @param query
   */
  async searchPageWarehouse(query) {
    try {
      const { userId = "", name = "", id = "" } = query;
      let results = [];
      if (name) {
        results = await searchSql(uiBuilderMapping.searchPageWarehouse, [userId, name]);
      } else if (id) {
        results = await searchSql(uiBuilderMapping.searchPageWarehouseById, [id]);
      }
      const temp = results.map((item) => {
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查询页面失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查找多页面数据
   * @param query
   */
  async findPageWarehouse(query) {
    try {
      const { ids = [] } = query;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: id不能为空` } };
      }
      const results = [];
      for (const id of ids) {
        const temp = await searchSql(uiBuilderMapping.findPageWarehouse, [id]);
        results.push(...temp);
      }
      const temp = results.map((item) => {
        try {
          if (typeof item.group === "string") item.group = JSON.parse(item.group);
        } catch (error) {}
        return item;
      });
      return { results: temp, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查找多页面失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 保存页面
   * @param body
   */
  async savePageWarehouse(body) {
    try {
      const { userId = "", data = [] } = body;
      if (!data.length) {
        return { info: { msg: `fail: 页面数据缺失` } };
      }
      for (const item of data) {
        const { name, type } = item;
        let { custom_model, theme, group } = item;
        typeof custom_model !== "string" && (custom_model = JSON.stringify(custom_model));
        typeof theme !== "string" && (theme = JSON.stringify(theme));
        typeof group !== "string" && (group = JSON.stringify(group));
        const results = await searchSql(uiBuilderMapping.searchPageWarehouse, [userId, name]);
        const time = moment().format("YYYY-MM-DD HH:mm:ss");
        if (results[0]?.id) {
          await searchSql(uiBuilderMapping.updatePageWarehouse, [
            custom_model,
            theme,
            time,
            name,
            type,
            group,
            results[0].id,
          ]);
        } else {
          await searchSql(uiBuilderMapping.savePageWarehouse, [
            userId,
            custom_model,
            theme,
            time,
            time,
            name,
            type,
            group,
          ]);
        }
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `页面保存失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 修改页面库页面名称
   * @param req
   * @returns
   */
  async updatePageWarehouseName(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { id = "", name = "" } = body;
      if (!id) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      if (!name) {
        return { info: { msg: `fail: 页面名称不能为空` } };
      }
      const results = await searchSql(uiBuilderMapping.findPageWarehouse, [id]);
      if (!results.length) {
        return { info: { msg: "fail: 此页面不存在!" } };
      }
      if (String(results[0].user_id) && String(results[0].user_id) !== String(userId)) {
        return { info: { msg: "fail: 无权更改此页面名称!" } };
      }
      const results2 = await searchSql(uiBuilderMapping.searchPageWarehouse, [userId, name]);
      if (results2.length) {
        return { info: { msg: "fail: 此页面名称已存在!" } };
      }
      const user_id = String(results[0].user_id) ? userId : "";
      const results3 = await searchSql(uiBuilderMapping.updatePageWarehouseName, [name, id, user_id]);
      return { results3, info: { msg: "success" } };
    } catch (error) {
      console.log(error);
      log.info(error, `修改页面名称失败`);
      return { results: error, info: { msg: `fail: 修改页面名称失败` } };
    }
  }

  /**
   * 删除页面
   * @param body
   */
  async deletePageWarehouse(body) {
    try {
      const { userId, ids = [] } = body;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      for (const id of ids) {
        await searchSql(uiBuilderMapping.deletePageWarehouse, [id, userId]);
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除页面失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 载入页面
   * @param body
   * @returns
   */
  async loadPageWarehouse(req) {
    try {
      const { user = {}, body = {} } = req;
      const { userId = "" } = user;
      const { custom_model, theme = "{}", id } = body;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id) {
        return { info: { msg: `fail: 页面id不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.loadPageWarehouse, [
        custom_model,
        updateTime,
        theme,
        id,
        userId,
      ]);
      return { results, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `载入页面失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 获取项目子页面列表
   * @param req
   * @returns
   */
  async getChildPage(req) {
    try {
      const { user = {}, query = {} } = req;
      const { projectId = "" } = query;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectId) {
        return { code: 401, info: { msg: `fail: 项目id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      if (project[0]?.child_page) {
        return { code: 200, results: JSON.parse(project[0].child_page), info: { msg: "success" } };
      }
      return { code: 404, results: [], info: { msg: "success" } };
    } catch (error) {
      log.info(error, `获取项目子页面数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查找项目子页面
   * @param req
   * @returns
   */
  async findChildPage(req) {
    try {
      const { user = {}, query = {} } = req;
      const { projectId = "", id = "" } = query;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectId || !id) {
        return { code: 401, info: { msg: `fail: 项目id或子页面id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      if (project[0]?.child_page) {
        const temp = JSON.parse(project[0].child_page);
        const index = temp.findIndex((item) => item.id === id);
        if (index !== -1) {
          return { code: 200, results: temp[index], info: { msg: "success" } };
        }
      }
      return { code: 404, results: {}, info: { msg: "success" } };
    } catch (error) {
      log.info(error, `查找项目子页面数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 新增项目子页面
   * @param req
   * @returns
   */
  async addChildPage(req) {
    try {
      const { user = {}, body = {} } = req;
      const { projectId = "", id = "", name = "", innerDropzone = [], bottomDropzone = [] } = body;
      const { userId = "" } = user;
      if (!userId || !projectId) {
        return { code: 401, info: { msg: `fail: 用户id或项目id不能为空` } };
      }
      if (!id || !name) {
        return { code: 401, info: { msg: `fail: 子页面id或名称不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let tempData = [];
      if (project[0]?.child_page) {
        tempData = JSON.parse(project[0].child_page);
        tempData.push({ id, name, innerDropzone, bottomDropzone });
      } else {
        tempData = [{ id, name, innerDropzone, bottomDropzone }];
      }
      const results = await searchSql(uiBuilderMapping.updateProjectChildPage, [
        JSON.stringify(tempData),
        updateTime,
        projectId,
      ]);
      return { code: 200, results, info: { msg: "success" } };
    } catch (error) {
      log.info(error, `新增项目子页面数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 保存项目子页面
   * @param req
   * @returns
   */
  async saveChildPage(req) {
    try {
      const { user = {}, body = {} } = req;
      const { projectId = "", id = "", innerDropzone = [], bottomDropzone = [] } = body;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!id || !projectId) {
        return { code: 401, info: { msg: `fail: 项目id或子页面id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      if (project[0]?.child_page) {
        const tempData = JSON.parse(project[0].child_page);
        const index = tempData.findIndex((item) => item.id === id);
        if (index !== -1) {
          const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          tempData[index] = { ...tempData[index], innerDropzone, bottomDropzone };
          const results = await searchSql(uiBuilderMapping.updateProjectChildPage, [
            JSON.stringify(tempData),
            updateTime,
            projectId,
          ]);
          return { code: 200, results, info: { msg: "success" } };
        }
      }
      return { code: 404, results: null, info: { msg: "fail: 未查找到子页面" } };
    } catch (error) {
      log.info(error, `保存项目子页面数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 保存项目子页面
   * @param req
   * @returns
   */
  async deleteChildPage(req) {
    try {
      const { user = {}, body = {} } = req;
      const { projectId = "", id = "" } = body;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectId || !id) {
        return { code: 401, info: { msg: `fail: 项目id或子页面id不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      if (project[0]?.child_page) {
        const tempData = JSON.parse(project[0].child_page);
        const index = tempData.findIndex((item) => item.id === id);
        if (index !== -1) {
          const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          tempData.splice(index, 1);
          const results = await searchSql(uiBuilderMapping.updateProjectChildPage, [
            JSON.stringify(tempData),
            updateTime,
            projectId,
          ]);
          return { code: 200, results, info: { msg: "success" } };
        }
      }
      return { code: 404, results: null, info: { msg: "success" } };
    } catch (error) {
      log.info(error, `删除项目子页面数据失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 重命名项目子页面
   * @param req
   * @returns
   */
  async renameChildPage(req) {
    try {
      const { user = {}, body = {} } = req;
      const { projectId = "", id = "", name = "" } = body;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `fail: 用户id不能为空` } };
      }
      if (!projectId || !id || !name) {
        return { code: 401, info: { msg: `fail: 项目id或子页面id和名称不能为空` } };
      }
      const project = await searchSql(uiBuilderMapping.findProject, [projectId, userId]);
      if (project[0]?.child_page) {
        const tempData = JSON.parse(project[0].child_page);
        const index = tempData.findIndex((item) => item.id === id);
        if (index !== -1) {
          const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
          tempData[index].name = name;
          const results = await searchSql(uiBuilderMapping.updateProjectChildPage, [
            JSON.stringify(tempData),
            updateTime,
            projectId,
          ]);
          return { code: 200, results, info: { msg: "success" } };
        }
      }
      return { code: 404, results: null, info: { msg: "success" } };
    } catch (error) {
      log.info(error, `重命名项目子页面失败`);
      return { code: 500, results: error, info: { msg: `fail` } };
    }
  }
}
