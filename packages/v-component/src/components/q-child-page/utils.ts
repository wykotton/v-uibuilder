import { getPageInfo, getProjectInfo, getRouteVariable } from "../../util/utils";
import { message } from "ant-design-vue";
import { ISchema } from "../../types/runtime/IModelSchema";
import { isString, cloneDeep } from "lodash-es";
import { IQDepotOptions } from "../q-depot/IQDepot";
import { IReceive, IRouterInfo, IAttributeInfo } from "@zzjz/v-uibuilder-types"; 
import { handleAttributeBind } from "../../util/attr-bind";
import DesignerPage from "../../types/runtime/DesignerPage";
import $ from "jquery";

interface IChildPageOptions {
  options: ISchema;
  slotName: string;
  children: IChildPageOptions[];
}
export const childPageClassName = "child-page-children";
/**
 * 单独适配的插件元件
 */
const pluginsList = ["q-router-config", "q-attribute-bind"];

/**
 * 获取项目id
 * @param domain
 * @returns
 */
export async function getProjectId(domain: string) {
  let projectId = "";
  const pageId = getRouteVariable("id") || "";
  if (!pageId) return { pageId, projectId };
  const request = await getPageInfo(Number(pageId), domain);
  if (request?.data?.data) {
    const {
      results,
      info: { msg = "" },
    } = request.data.data;
    if (msg !== "success") return { pageId, projectId };
    if (results[0]?.project_id) {
      projectId = results[0].project_id;
    }
  }
  return { pageId, projectId };
}

/**
 * 获取项目数据
 * @param projectId
 * @param domain
 * @returns
 */
export async function getProjectData(projectId: string, domain: string) {
  let childPageList = "";
  if (!projectId) {
    message.destroy();
    message.error("子页面容器元件: 未找到项目id, 无法获取项目子页面数据!");
    return childPageList;
  }
  const request = await getProjectInfo(Number(projectId), domain);
  if (request?.data?.data) {
    const {
      results,
      info: { msg = "" },
    } = request.data.data;
    if (msg === "success" && results[0]?.child_page) {
      childPageList = results[0].child_page;
    }
  }
  return childPageList;
}

/**
 * 获取元件列表
 * @returns
 */
export function getComponents() {
  // 获取元件仓库数据
  const allComponent = Array.from(document.querySelectorAll("[depot]")).map((c: any) => {
    if (!c) return [];
    try {
      const list = c.getAttribute("list");
      if (list) {
        if (isString(list)) {
          return JSON.parse(list);
        } else {
          return list;
        }
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  });
  const components = [];
  components.push(...allComponent.flat());
  return components;
}

/**
 * 检查子页面元件
 * @param component
 */
export async function checkPageComponent(component: IChildPageOptions, componentsList: IQDepotOptions[]) {
  const checkComponent = async (info: IChildPageOptions) => {
    if (isString(info.options)) info.options = JSON.parse(info.options);
    if (isString(info.children)) info.children = JSON.parse(info.children);
    let {
      options: {
        iovSchema: { group = [] },
      },
    } = info;
    const {
      options: {
        iovSchema: { componentName = "" },
      },
      children = [],
    } = info;
    if (componentName) {
      isString(group) && (group = JSON.parse(group));
      if (!customElements.get(componentName)) {
        // const componentIndex = componentsList.findIndex(
        //   (item: IQDepotOptions) =>
        //     item.componentName === componentName && isEqual(item.group, group) && item.text === text
        // );
        const componentIndex = componentsList.findIndex((item: IQDepotOptions) => item.componentName === componentName);
        if (componentIndex !== -1) {
          const component = cloneDeep(componentsList[componentIndex]);
          await DesignerPage.defineCustomWebcomponent(component);
        }
      }
    }
    for await (const item of children) {
      await checkComponent(item);
    }
  };
  await checkComponent(component);
}

/*
 * 单组件/多组件蒙层
 */
export function addComponentMask(element: HTMLElement | HTMLElement[]) {
  const maskElement = createMask();
  if (Array.isArray(element)) {
    element.forEach((item: HTMLElement) => {
      addMask(item, maskElement);
    });
  } else {
    addMask(element, maskElement);
  }
}

/*
 * 创建蒙层
 */
function createMask() {
  const mask = document.createElement("div");
  mask.slot = "q-component-mask";
  mask.style.cssText =
    "width: 100%;height: 100%;position: absolute;left: 0;top: 0;display: block;z-index: 9999;border: 4px solid red";
  mask.innerHTML = `
    <div style="width: 100%;height: 100%;background-color: rgba(188,190,196,0.5);display: flex;align-items: center;justify-content: center;">
			<span style="width: 24px;height: 24px;min-width: 24px;min-height: 24px;">
				<svg aria-hidden="true" style="width: 1em;height: 1em;vertical-align: -0.15em;fill: currentColor;overflow: hidden;font-size: 24px;">
					<use xlink:href="#icon-cuowu" style="color: red"></use>
        </svg>
			</span>
		</div>
    `;
  return mask;
}

/*
 * 添加蒙层
 */
function addMask(element: HTMLElement, maskElement: HTMLElement) {
  const maskSlot = element.shadowRoot?.querySelector("slot[name='q-component-mask']");
  maskSlot
    ? void 0
    : (() => {
        const slotElement = document.createElement("slot");
        slotElement.name = "q-component-mask";
        element.shadowRoot?.appendChild(slotElement);
      })();
  const maskEle = Array.from(element.children).filter(
    (children) => children.slot === "q-component-mask"
  )[0] as HTMLElement;
  maskEle ? (maskEle.style.display = "block") : element.appendChild(maskElement.cloneNode(true));
}

/**
 * 创建子页面
 * @param inner
 * @param bottom
 * @param innerDropzone
 * @param bottomDropzone
 * @returns
 */
export function createChildPage(inner: any[], bottom: any[], component: any) {
  const componentsList: IQDepotOptions[] = getComponents();
  return new Promise<Record<string, any>>(async (resolve) => {
    let mappingId = {};
    for await (const item of inner) {
      await checkPageComponent(item, componentsList);
      const mapping = childPageRender(item, component.id, component, "inner", component._contextType);
      mappingId = { ...mappingId, ...mapping };
    }
    for await (const item of bottom) {
      await checkPageComponent(item, componentsList);
      const mapping = childPageRender(item, component.id, component, "bottom", component._contextType);
      mappingId = { ...mappingId, ...mapping };
    }
    resolve(mappingId);
  });
}

/**
 * 子页面渲染
 * @param component
 * @param insetElement
 */
function childPageRender(
  component: IChildPageOptions,
  containerId: string,
  insetElement: HTMLElement,
  slot: string,
  contextType: boolean
) {
  const mappingId = {};
  const createComponent = (info: IChildPageOptions, containerId: string, parentElement: HTMLElement, slot?: string) => {
    let { options, children = [] } = info;
    const { slotName } = info;
    if (isString(options)) options = JSON.parse(options);
    if (isString(children)) children = JSON.parse(children);
    const {
      iovSchema: { componentName = "" },
    } = options;
    const element = document.createElement(componentName) as any;
    if (!element) return;
    // 兼容DI Angular组件创建后不初始化的问题
    if (element && !element.componentModel && element.connectedCallback) {
      element.connectedCallback?.();
      element.componentModel?.model?.lifeCycle?.updated?.(element, options, "initBaseModel");
      Reflect.deleteProperty(options, "iovSchema");
    }
    element.classList.add(childPageClassName);
    element.setAttribute("data-element-type", element.tagName);
    // 存储元件新旧id映射关系
    const newId = `${options.id}_${containerId}`;
    mappingId[options.id] = newId;
    options.id = newId;
    options._contextType = contextType;
    slotName ? (element.slot = slotName) : void 0;
    slot ? (element.slot = slot) : void 0;
    try {
      element.componentModel.updateModelEntity(JSON.stringify(options));
    } catch (error) {
      addComponentMask(element);
    }
    parentElement.appendChild(element);
    children.forEach((item: IChildPageOptions) => {
      createComponent(item, containerId, element);
    });
  };
  createComponent(component, containerId, insetElement, slot);
  return mappingId;
}

/**
 * 更新插件元件选中源
 * 这是对插件元件的单独适配
 */
export function changePluginSource(id: string) {
  if (!id) return;
  pluginsList.forEach((tagName: string) => {
    const pluginsElement = document.querySelectorAll(tagName);
    Array.from(pluginsElement).forEach((element: any) => {
      if (!element) return;
      element.src = id;
    });
  });
}

/**
 * 子页面路由配置和属性绑定更新,使用newId替换oldId
 */
export function changeRouterAndAttrBind(root: any) {
  Array.from(root.querySelectorAll("q-router-config")).forEach((component: any) => {
    if (component.value) {
      const newValue = {};
      const copyValue = cloneDeep(component.value);
      Object.keys(copyValue).forEach((key: string) => {
        copyValue[key].forEach((item: IRouterInfo) => {
          root.mappingId[item.src] ? (item.src = root.mappingId[item.src]) : void 0;
          item.receive.forEach((receive: IReceive) => {
            root.mappingId[receive.target]
              ? ((receive.target = root.mappingId[receive.target]), (receive.page = root.pageId))
              : void 0;
          });
        });
        root.mappingId[key] ? (newValue[root.mappingId[key]] = copyValue[key]) : (newValue[key] = copyValue[key]);
      });
      setTimeout(() => {
        component.value = newValue;
      }, 100);
    }
  });
  Array.from(root.querySelectorAll("q-attribute-bind")).forEach((component: any) => {
    if (component.value) {
      const newValue = {};
      const copyValue = cloneDeep(component.value);
      Object.keys(copyValue).forEach((key: string) => {
        copyValue[key].forEach((item: IAttributeInfo) => {
          root.mappingId[item.target] ? (item.target = root.mappingId[item.target]) : void 0;
          root.mappingId[item.bound.target] ? (item.bound.target = root.mappingId[item.bound.target]) : void 0;
        });
        root.mappingId[key] ? (newValue[root.mappingId[key]] = copyValue[key]) : (newValue[key] = copyValue[key]);
      });
      setTimeout(() => {
        component.value = newValue;
        attrBindStart(component);
      }, 100);
    }
  });
}

/**
 * 属性绑定启动
 * @param component
 */
function attrBindStart(component: any) {
  try {
    if (!component.value) return;
    Object.keys(component.value).forEach((key: string) => {
      component.value[key]?.forEach((config: IAttributeInfo) => {
        handleAttributeBind(config);
      });
    });
  } catch (error) {}
}

/**
 * 子页面数据更新
 */
export function changeValue(root: any) {
  try {
    const data = JSON.parse(root.value);
    Object.keys(data).forEach((key: string) => {
      if (!root.mappingId[key]) return;
      const component = root.querySelector(`#${root.mappingId[key]}`) as any;
      if (component?.componentModel) {
        component.componentModel.updateModelEntity(JSON.stringify(data[key]));
      }
    });
  } catch (error) {}
}

/**
 * 检查子页面容器嵌套情况
 * 防止子页面嵌套形成闭环后造成递归地狱
 */
export function checkRepeat(root: any) {
  let repeat = false;
  const parents = $(root).parents("q-child-page");
  for (const element of Array.from(parents)) {
    if (element?.childPageId === root.childPageId) {
      repeat = true;
      break;
    }
  }
  return repeat;
}
