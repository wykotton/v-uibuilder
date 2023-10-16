import { treeDataOptions } from "@/types/website";
import { contentTypeEnum, openModeEnum } from "@/enums/websiteEnum";
import { createHash } from "@/utils/uuid";

/**
 * 获取选中菜单信息
 * @param treeData
 * @param key
 */
export function getTreeInfo(treeData: treeDataOptions[], key: string) {
  const getInfo = (tree: treeDataOptions[], key: string): treeDataOptions | boolean => {
    for (const item of tree) {
      if (item.key === key) {
        return item;
      } else {
        const results: treeDataOptions | boolean = getInfo(item.children, key);
        if (results) return results;
      }
    }
    return false;
  };
  const results = getInfo(treeData, key);
  if (results) {
    return results;
  } else {
    return {};
  }
}

/**
 * 渲染iframe
 */
export function iframeRender(root: HTMLElement, cache: boolean, info: treeDataOptions) {
  if (info?.openMode === openModeEnum.NEW) {
    const src = handleUrl(info);
    window.open(src);
    return;
  }
  if (cache) {
    Array.from(root.children).forEach((item: any) => {
      item.style.display = "none";
    });
    const iframe = root.querySelector(`[key='${info.key}']`) as HTMLIFrameElement;
    if (iframe) {
      if (iframe.src !== info.src) {
        iframe.src = handleUrl(info);
      }
      iframe.style.display = "block";
    } else {
      const element = createIframe(info);
      element.src = handleUrl(info);
      root.appendChild(element);
    }
  } else {
    const element = createIframe(info);
    element.src = handleUrl(info);
    root.innerHTML = "";
    root.appendChild(element);
  }
}

/**
 * 创建iframe节点
 * @param info
 * @returns
 */
function createIframe(info: treeDataOptions) {
  const element = document.createElement("iframe");
  element.style.width = "100%";
  element.style.height = "100%";
  element.src = info.src;
  element.setAttribute("key", info.key);
  return element;
}

/**
 * 处理URL
 * @param info
 * @returns
 */
export function handleUrl(info: treeDataOptions) {
  let url = "";
  switch (info.contentType) {
    case contentTypeEnum.PAGE:
      url = `/#/uibuilder/publish?id=${info.pageId}`;
      break;
    case contentTypeEnum.EXTERNAL:
      url = info.src;
      break;
  }
  return url;
}

/**
 * 获取treeNode层级和路径
 * @param treeData
 * @param key
 */
export function getTreeLevel(treeData: treeDataOptions[], key: string) {
  const getLevel = (tree: treeDataOptions, key: string, level: number, path: string[]) => {
    level++;
    for (const item of tree.children) {
      path.push(item.key);
      if (item.key === key) {
        return { level, path };
      } else {
        const results: { level: number; path: string[] } = getLevel(item, key, level, path);
        if (results.level) return results;
      }
    }
    return { level: 0, path: [] };
  };
  let level = 1;
  let path: string[] = [];
  for (const item of treeData) {
    level = 1;
    path = [item.key];
    if (item.key === key) {
      break;
    } else {
      const result = getLevel(item, key, level, path);
      level = result.level;
      path = result.path;
    }
    if (level > 0) break;
  }
  return { level, path };
}

/**
 * 添加菜单
 * @param key
 * @param treeData
 * @returns
 */
export function addMenu(key: string, treeData: treeDataOptions[]) {
  const defaultValue = {
    key: createHash(8),
    title: "新建菜单",
    showIcon: false,
    icon: "",
    isNull: false,
    contentType: "",
    projectId: "",
    pageId: "",
    src: "",
    openMode: "current",
    children: [],
  };
  if (!key) {
    treeData.push(defaultValue);
    return;
  }
  const add = (key: string, treeData: treeDataOptions[]) => {
    for (const item of treeData) {
      if (item.key === key) {
        item.isNull = true;
        item.children.push(defaultValue);
        return true;
      } else {
        const results = add(key, item.children);
        if (results) return true;
      }
    }
    return false;
  };
  add(key, treeData);
}

/**
 * 删除菜单
 * @param key
 * @param treeData
 */
export function deleteMenu(key: string, treeData: treeDataOptions[]) {
  const handleDelete = (key: string, treeData: treeDataOptions[]) => {
    for (const index in treeData) {
      if (treeData[index].key === key) {
        treeData.splice(Number(index), 1);
        return true;
      } else {
        const results = handleDelete(key, treeData[index].children);
        if (results) return true;
      }
    }
    return false;
  };
  handleDelete(key, treeData);
}
