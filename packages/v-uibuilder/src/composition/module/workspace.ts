import { cloneDeep } from "lodash-es";

/**
 * 数据分页
 * @param data 数据列表
 * @param pageIndex 页数
 * @param limit 长度
 * @returns
 */
export function dataPaging(data: any[], pageIndex: number, limit: number) {
  const start = (pageIndex - 1) * limit;
  const end = start + limit;
  const results = data.slice(start, end);
  return results;
}

/**
 * 数据查询
 * @param data 数据列表
 * @param pageIndex 页数
 * @param limit 长度
 * @returns
 */
export function dataSearch(data: any[], text: string, type: string) {
  let searchKey = "";
  switch (type) {
    case "project":
      searchKey = "project_name";
      break;
    case "component":
      searchKey = "text";
      break;
    case "page":
      searchKey = "name";
      break;
    case "website":
      searchKey = "website_name";
      break;
  }
  if (!searchKey) return [];
  const results: any = [];
  cloneDeep(data).forEach((item) => {
    if (item[searchKey]?.indexOf(text) > -1) {
      let replaceReg = new RegExp(text, "g"); // 匹配关键字正则
      let replaceString = '<span style="color: red">' + text + "</span>"; // 高亮替换v-html值
      let temp = { ...item };
      temp["highlights"] = temp[searchKey].replace(replaceReg, replaceString);
      results.push(temp);
    }
  });
  return results;
}

/**
 * 获取元件库和页面库的list
 * @param id 仓库DOM节点id
 */
export function getWarehouse(id: string) {
  const g = (callback: (data: any) => any) => {
    const dom = document.getElementById(id);
    const str = dom?.getAttribute("list");
    if (str && str !== "") {
      try {
        const list = JSON.parse(str);
        if (Array.isArray(list)) {
          list.forEach((item) => {
            for (let i in item) {
              if (typeof item[i] === "string" && /^[{[]/gi.test(item[i])) {
                try {
                  item[i] = JSON.parse(item[i]);
                } catch {}
              }
            }
          });
        }
        list.length && callback(list);
      } catch (e) {}
    }
  };
  return new Promise((resolve: (data: any[]) => any, reject) => {
    const t = setInterval(() => {
      g((data) => {
        resolve(data);
        clearInterval(t);
      });
    }, 200);
    g((data) => {
      resolve(data);
      clearInterval(t);
    });
    setTimeout(() => {
      reject();
      clearInterval(t);
    }, 3000);
  });
}

/**
 * 格式化页面库和元件库的用户数据和公共数据
 * @param rawList
 */
export function parseComponents(rawList: any[]) {
  const result: {
    user: any[];
    public: any[];
  } = {
    user: [],
    public: [],
  };
  rawList.forEach((raw) => {
    if (raw.user_id) {
      result.user.push(raw);
    } else {
      result.public.push(raw);
    }
  });
  return result;
}
