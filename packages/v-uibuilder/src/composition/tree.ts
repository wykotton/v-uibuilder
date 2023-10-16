import { message } from "ant-design-vue";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { useAppStoreWithOut } from "@/store/modules/app";
import { changeMoveableTarget, changeSetter } from "./setting";
import $ from "jquery";
import { CanvasIdEnum } from "@/enums/appEnum";
import { BreadcrumbInfo } from "@/types/store";
import { cloneDeep } from "lodash-es";
import { checkComponentRoot } from "./page";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 获取tree
 */
export function getTrees() {
  const innerDropzone = document.querySelector(`#${CanvasIdEnum.INNER}`);
  const innerDropzoneTree = getTreeData(innerDropzone as HTMLElement);
  const bottomDropzone = document.querySelector(`#${CanvasIdEnum.BOTTOM}`);
  const bottomcontentTree = getTreeData(bottomDropzone as HTMLElement);
  return [...innerDropzoneTree, ...bottomcontentTree];
}

/**
 * 获取组件树
 * @param element 树节点
 */
export function getTreeData(element: HTMLElement) {
  const treeData: any = [];
  const children = element?.children ? Array.from(element.children) : [];
  if (children.length) {
    children.forEach((element: any) => {
      if (element.classList.contains("draggable2") && element?.componentModel?.model) {
        const model = element.componentModel.model;
        const tempData = {
          key: model.id,
          title: model.componentAliasName || model.iovSchema.text,
          children: getTreeData(element),
        };
        treeData.push(tempData);
      }
    });
  }
  return treeData;
}

/**
 * 图层面板组件树展开折叠
 */
export function onExpand(keys: Array<string>) {
  useSettingStore.setExpandedKeys(keys);
  useSettingStore.setAutoExpandParent(false);
}

/**
 * 图层面板组件树checkbox选择
 */
export function onCheckBox(keys: any) {
  $.makeArray($(".draggable2")).forEach((cur) => {
    const isHidden = keys.checked.includes(cur.id);
    if (!isHidden) {
      $(cur).hide();
    } else {
      $(cur).show();
    }
  });
}

/**
 * 图层面板组件树选中
 */
export function onSelect(keys: any, info: any) {
  // 被隐藏组件禁止选中
  const eventKey = info.node.eventKey; // 被点击的key
  const checkedKeys = useSettingStore.checkedKeys.checked || useSettingStore.checkedKeys;
  if (!checkedKeys.includes(eventKey)) {
    message.destroy();
    message.warning("所选组件已被隐藏, 无法选中！");
    return;
  } else {
    let display = true;
    const elementParents = [...$.makeArray($(`#${eventKey}`).parents(".draggable2"))];
    if ($(`#${eventKey}`).css("display") === "none" || $(`#${eventKey}`).css("visibility") === "hidden") {
      display = false;
    }
    elementParents.forEach((item) => {
      if ($(item).css("display") === "none" || $(item).css("visibility") === "hidden") {
        display = false;
      }
    });
    if (!display) {
      message.destroy();
      message.warning("所选组件父级容器已被隐藏, 无法选中！");
      return;
    }
  }

  if (!keys.length) {
    changeMoveableTarget(eventKey);
    return;
  }
  // 如果点击的元件是辅助画布的，就切换到辅助画布tab，防止moveable辅助框异常
  const root = checkComponentRoot(eventKey);
  if (root === CanvasIdEnum.BOTTOM) {
    useAppStore.setBottomContentTab("1");
  }
  // 处理选择tree时是否是多选状态
  let selectedKeys = [];
  if (useAppStore.isCtrlKey) {
    selectedKeys = keys;
  } else {
    selectedKeys = [eventKey];
  }
  useSettingStore.setSelectedKeys(selectedKeys);
  // 更新组件选中数据
  useAppStore.pageModel?.clearSelected();
  useAppStore.pageModel?.addSelected(selectedKeys);
  if (selectedKeys.length === 1) {
    const model = useAppStore.pageModel?.currentComponent;
    if (model) {
      // 更新设置器和moveable实例
      changeSetter(model, ["all"]);
    } else {
      message.error("无法查找到组件实例数据！");
    }
  } else {
    // 更新moveable实例
    useSettingStore.moveableExample.setElementGuidelines();
  }
}

/**
 * 更新图层面板checkedKeys和expandedKeys
 * @param isExpanded
 * @param isChecked
 */
export function changeCheckedAndExpanded(isExpanded: boolean, isChecked: boolean) {
  const checkedKeys: string[] = [];
  const expandedKeys: string[] = [];
  const components = Array.from(document.querySelectorAll(".draggable2"));
  if (components.length) {
    components.forEach((element: any) => {
      if (element.style.display !== "none") {
        checkedKeys.push(element.id);
      }
      expandedKeys.push(element.id);
    });
  }
  if (isChecked) {
    useSettingStore.setCheckedKeys(checkedKeys);
  }
  if (isExpanded) {
    useSettingStore.setExpandedKeys(expandedKeys);
  }
}

/**
 * 组件树鼠标移入
 * @param key 组件id
 */
export function focusSelectCom(key: string) {
  try {
    const dom = document.querySelector("#" + key);
    if (dom) {
      dom.classList.add("focusBind");
    }
  } catch (error) {}
}

/**
 * 组件树鼠标移出
 * @param key 组件id
 */
export function blurSelectCom(key: string) {
  try {
    const dom = document.querySelector("#" + key);
    if (dom) {
      dom.classList.remove("focusBind");
    }
  } catch (error) {}
}

/**
 * 重置图层面板tree数据
 */
export function useResetTree() {
  useSettingStore.setTreeData(getTrees());
  useSettingStore.setSelectedKeys([]);
  changeCheckedAndExpanded(true, true);
}

/**
 * 获取画布所选元件的面包屑
 */
export function getBreadcrumb() {
  if (useAppStore.pageModel?.selectedComponents.length === 1) {
    const id = useAppStore.pageModel?.currentComponent?.id;
    const component = document.querySelector(`#${id}`) as HTMLElement;
    if (component) {
      const elements = Array.from($(component).parents(".draggable2"));
      elements.unshift(component);
      const level = 3;
      const breadcrumb = <BreadcrumbInfo[]>[];
      const aliasBreadcrumb = <BreadcrumbInfo[]>[];
      let index = 0;
      for (const element of elements) {
        if (index === level) break;
        const model = (element as any)?.componentModel?.model;
        const id = model?.id;
        const text = model?.iovSchema?.text;
        const aliasName = model?.componentAliasName;
        const componentName = model?.iovSchema?.componentName;
        if (id) {
          breadcrumb.push({
            id,
            name: componentName,
          });
          aliasBreadcrumb.push({
            id,
            name: aliasName || text,
          });
          index++;
        }
      }
      useSettingStore.setNameBreadcrumb(breadcrumb.reverse());
      useSettingStore.setAliasNameBreadcrumb(aliasBreadcrumb.reverse());
      return;
    }
  }
  useSettingStore.setNameBreadcrumb([]);
  useSettingStore.setAliasNameBreadcrumb([]);
}

/**
 * 点击组件面包屑
 * 选中点击组件
 * @param e
 */
export function breadcrumbClick(e: any) {
  const target = e?.target;
  if (!target) return;
  const id = target.getAttribute("componentId");
  const model = useAppStore.pageModel?.currentComponent;
  if (id && model?.id !== id) {
    const selectedKeys = [id];
    useSettingStore.setSelectedKeys(selectedKeys);
    // 更新组件选中数据
    useAppStore.pageModel?.clearSelected();
    useAppStore.pageModel?.addSelected(selectedKeys);
    if (model) {
      // 更新设置器和moveable实例
      changeSetter(model, ["all"]);
    } else {
      message.error("无法查找到组件实例数据！");
    }
  }
}

/**
 * 设置图层面板选中组件需要展开的expandedKeys
 */
export function setNeedToExpandKeys() {
  if (useAppStore.pageModel?.selectedComponents.length === 1) {
    const id = useAppStore.pageModel?.currentComponent?.id;
    const component = document.querySelector(`#${id}`) as HTMLElement;
    if (component) {
      const elements = Array.from($(component).parents(".draggable2"));
      const expandedKeys = cloneDeep(useSettingStore.expandedKeys);
      elements.forEach((element) => {
        const id = element.id;
        if (!expandedKeys.includes(id)) {
          expandedKeys.push(id);
        }
      });
      useSettingStore.setExpandedKeys(expandedKeys);
      // 适配checkedKeys
      changeCheckedAndExpanded(false, true);
    }
  }
}
