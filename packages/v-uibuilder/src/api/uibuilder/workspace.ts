import { defHttp } from "@/utils/http/axios";
import { systemFind } from "@/api/uibuilder/edit";
import { message } from "ant-design-vue";
import { PageInfo } from "@/types/workspace";
import { downloadByData } from "@/utils/file/download";

enum Api {
  LIST_PROJECT = "/ui-builder/get-project",
  IMPORT_PROJECT = "/ui-builder/import-project",
  UPDATE_PAGE_NAME = "/ui-builder/update-page-name",
  ADD_PROJECT = "/ui-builder/save-project",
  DELETE_PROJECT = "/ui-builder/delete-project",
  UPDATE_PROJECT = "/ui-builder/update-project",
  UPDATE_PROJECT_NAME = "/ui-builder/update-project-name",
  FIND_PROJECT = "/ui-builder/find-project",
  RENAME_PAGE_WAREHOUSE = "/ui-builder/update-page-warehouse-name",
  RENAME_COMBINATION = "/ui-builder/update-combination-name",
  RENAME_WEBSITE = "/ui-builder/update-website-name",
}

/**
 * 项目列表数据
 * @param param0
 * @returns
 */
export const workspaceProjectsApi = ({
  page,
  pageSize,
  projectName,
  getAll,
}: {
  page?: number;
  pageSize?: number;
  projectName?: string;
  getAll?: boolean;
}) => {
  return defHttp.get({
    url: Api.LIST_PROJECT,
    params: {
      page,
      limit: pageSize,
      projectName,
      getAll,
    },
  });
};

/**
 * 新增项目
 * @param name
 * @returns
 */
export const workspaceAddProjectApi = (name: string) => {
  return defHttp.post({
    url: Api.ADD_PROJECT,
    params: {
      projectName: name,
    },
  });
};

/**
 * 删除项目
 * @param id
 * @returns
 */
export const workspaceDeleteProjectApi = (id: string) => {
  return defHttp.post({
    url: Api.DELETE_PROJECT,
    params: {
      id: id,
    },
  });
};

/**
 * 更新项目
 * @param id
 * @param data
 * @returns
 */
export const workspaceModifyProjectApi = (id: number, data: object) => {
  return defHttp.post({
    url: Api.UPDATE_PROJECT,
    params: {
      data,
      id,
    },
  });
};

/**
 * 项目重命名
 * @param id
 * @param name
 * @returns
 */
export const workspaceRenameProjectApi = (id: number, name: string) => {
  return defHttp.post({
    url: Api.UPDATE_PROJECT_NAME,
    params: {
      projectName: name,
      id,
    },
  });
};

/**
 * 获取单个项目详细数据
 * @param id
 * @returns
 */
export const workspaceGetProjectApi = (id: number) => {
  return defHttp.get({
    url: Api.FIND_PROJECT,
    params: {
      id,
    },
  });
};

/**
 * 页面重命名
 * @param id
 * @param name
 * @returns
 */
export const workspaceModifyPageApi = (id: number, name: string) => {
  return defHttp.post({
    url: Api.UPDATE_PAGE_NAME,
    params: {
      pageName: name,
      id: id,
    },
  });
};

/**
 * 导出项目
 * @param id
 */
export const exportProject = async (id: number) => {
  try {
    const res = await workspaceGetProjectApi(id);
    if (res?.data?.info?.msg === "success") {
      if (res.data.results?.[0]?.pageList?.length > 0) {
        const pArr = res.data.results[0].pageList.map(
          (page: PageInfo) =>
            new Promise((resolve, reject) => {
              systemFind({ id: page.id }).then((res) => {
                if (res.data.info.msg === "success") {
                  resolve(res.data.results?.[0]);
                } else {
                  reject();
                }
              });
            })
        );
        Promise.all(pArr)
          .then((list) => {
            const outData = res.data.results?.[0];
            outData.pageList = list;
            //导出并下载
            downloadByData(
              JSON.stringify(outData),
              `project-${res.data.results?.[0].project_name}`,
              "application/json"
            );
          })
          .catch(() => {
            message.error("导出失败");
          });
      } else {
        message.error("无法导出空项目");
      }
    } else {
      console.log(res?.data?.info?.msg);
      message.error("导出失败");
    }
  } catch (e) {
    console.log(e);
    message.error("导出失败");
  }
};

/**
 * 导入项目
 * @param project
 * @returns
 */
export const workspaceImportProjectApi = (project: any[]) => {
  return defHttp.post({
    url: Api.IMPORT_PROJECT,
    params: {
      project,
    },
  });
};

/**
 * 自定义原件重命名
 * @param id
 * @param name
 * @returns
 */
export const workspaceRenameComponentApi = (id: number, name: string) => {
  return defHttp.post({
    url: Api.RENAME_COMBINATION,
    params: {
      id,
      text: name,
    },
  });
};

/**
 * 页面库页面重命名
 * @param id
 * @param name
 * @returns
 */
export const workspaceRenamePageApi = (id: number, name: string) => {
  return defHttp.post({
    url: Api.RENAME_PAGE_WAREHOUSE,
    params: {
      id,
      name,
    },
  });
};

/**
 * 站点重命名
 * @param id
 * @param name
 * @returns
 */
export const workspaceRenameWebsiteApi = (id: number, name: string) => {
  return defHttp.post({
    url: Api.RENAME_WEBSITE,
    params: {
      id,
      websiteName: name,
    },
  });
};
