import { IEventSpecificationEvent, IMessage, ISchema, IWatchSetting } from "@zzjz/v-uibuilder-types";
import axios from "axios";
import $ from "jquery";
import JSONfn from "json-fn";
import { JSONPath } from "jsonpath-plus";
import { assign, cloneDeep, isElement, isFunction, isObject, isArray } from "lodash-es";
import { MODELCHANGETYPE } from "../runtime/const";

/**
 * 获取元素树
 * @param target
 * @param param1
 * @returns
 */
export function getElementTree(target = document, { isEle = false } = {}) {
  if (!target || target.nodeName === "#text") return [];
  return [...target.querySelectorAll("[data-component]")].map((c: any) => {
    let { data } = c.dataset;
    const { parentId } = c.dataset;
    const { x, y } = c.parentElement.dataset;
    const $el = c.componentInstance ? c.componentInstance.$el : null;
    data = JSON.parse(data);
    data.id = c.id;
    data.proxyInfo = c.data;
    data.parentId = parentId;
    data.style = c.parentElement.style.cssText;
    data.parentClass = c.parentElement.classList.value;
    data.x = x;
    data.y = y;
    data.children = $el ? getElementTree($el, { isEle }) : [];
    if (isEle) {
      data.$el = $el;
      data.componentInstance = c.componentInstance;
      data.shadowRoot = c.shadowRoot;
      data.srcElement = c;
      data.parentElement = c.parentElement;
    }
    return data;
  });
}

/**
 * 获取目|标元素树
 * @param target
 * @returns
 */
export function getTargetElement(target = "") {
  if (!target) return null;

  const allElement = getElementTree(document, { isEle: true });

  const findTarget = (arr = [], targetId: string) => {
    let len = 0;
    let isBreak = true;
    let targetNode = null;
    while (arr[len] && isBreak) {
      const { id, children = [] } = arr[len];
      if (targetId === id) {
        targetNode = arr[len];
        isBreak = false;
        return targetNode;
      } else if (children && children.length) {
        const target = findTarget(children, targetId) as object;
        if (target) {
          return target;
        }
      }
      len++;
    }
    return targetNode;
  };

  return findTarget(allElement as never[], target);
}

/**
 * 处理属性路径
 * @param path
 * @param key
 */
function handleTargetPath(path: string, key: string) {
  let targetPath = "";
  if (!isNaN(Number(key))) {
    targetPath = path ? `${path}[${key}]` : `[${key}]`;
  } else {
    targetPath = path ? `${path}.${String(key)}` : String(key);
  }
  return targetPath;
}

/**
 * 深度监听
 * @param obj 代理对象
 * @param rootKey
 * @param rootObj
 * @param update
 * @param path
 * @returns
 */

export function deepWatchModelProxy(obj: ISchema, rootKey?: string, rootObj?: any, update?: any, path?: string) {
  return new Proxy(obj, {
    get(target, key, receiver): any {
      const res = Reflect.get(target, key, receiver) as ISchema;

      if (isObject(res) && !isFunction(res)) {
        const targetPath = handleTargetPath(path || "", String(key));
        // 如果当前获取的属性值是一个对象，则继续将为此对象创建 Proxy 代理
        return deepWatchModelProxy(res, rootKey ?? (key as string), rootObj ?? obj, update, targetPath) as ISchema;
      }

      return res as ISchema;
    },
    /**
     * @param {Object, Array} target 设置值的对象
     * @param {String} key 属性
     * @param {any} value 值
     * @param {Object} receiver this
     */
    set: function (target: any, key, value: { [key: string]: {} }, receiver) {
      const targetPath = handleTargetPath(path || "", String(key));
      const targetKey = (rootKey ?? key) as string;
      const targetObj = rootObj ?? obj;
      const onWatchFn = (targetObj.onWatchSetting as IWatchSetting) || {};
      const oldValue: any = {};
      Object.keys(onWatchFn).forEach((watchKey: string) => {
        if (watchKey && targetPath.indexOf(watchKey) !== -1) {
          const value = JSONPath({ path: watchKey, json: targetObj })[0] ?? null;
          oldValue[watchKey] = cloneDeep(value);
        }
      });
      const check = Reflect.set(target, key, value, receiver);
      Object.keys(onWatchFn).forEach((watchKey: string) => {
        if (watchKey && targetPath.indexOf(watchKey) !== -1) {
          const newValue = JSONPath({ path: watchKey, json: targetObj })[0] ?? null;
          const propertyDeepWatch = onWatchFn[watchKey] ?? [];
          propertyDeepWatch.forEach((callBack: Function) => {
            isFunction(callBack) && callBack(newValue, oldValue[watchKey], targetObj);
          });
        }
      });
      // 触发更新回调
      try {
        update?.callback?.forEach((callBack: Function) => {
          isFunction(callBack) && callBack(targetObj, targetKey, targetPath, receiver, key);
        });
      } catch (error) {}
      return check;
    },
    deleteProperty(target, key) {
      return Reflect.deleteProperty(target, key);
    },
  });
}

export const mergeModel = (model: any, changeModel: any) => {
  if (!model || !changeModel) return {} as ISchema;
  return Object.defineProperties(model, Object.getOwnPropertyDescriptors(changeModel));
};

/**
 * 深层合并对象
 * @param param
 * @returns
 */
export function deepAssign(...param: any) {
  const result = Object.assign({}, ...param);
  const tempResult: any[] = [];
  for (const item of param) {
    for (const [key, value] of Object.entries(item)) {
      const isNaN = Number.isNaN(Number(key));
      if (isNaN) {
        if (typeof value === "object") {
          result[key] = deepAssign(result[key], value);
        }
      } else {
        if (typeof value === "object") {
          tempResult[Number(key)] = deepAssign(result[key], value);
        } else {
          tempResult[Number(key)] = result[key];
        }
      }
    }
  }
  if (tempResult.length) {
    return tempResult;
  } else {
    return result;
  }
}

/**
 * 自动创建optionsView
 * @param model
 */
export function createOptionsView(model: ISchema) {
  const createModel = {
    description: "组件model",
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "组件id",
        disabled: true,
      },
      contextType: {
        type: "boolean",
        description: "运行时状态",
      },
    },
  };
  return deepAssign(cloneDeep(model.iovSchema.optionsView.model) || {}, cloneDeep(createModel));
}

/**
 * 创建_onMessageMeta描述
 * @param model
 * @returns
 */
// @ts-ignore
function createMessageMeta(model: ISchema) {
  if (model?._onMessageMeta) {
    const _onMessageMeta: any = {
      type: "object",
      description: "消息响应",
      properties: {},
    };
    const description: any = {};
    try {
      model?._iovSchema?.eventSpecification?.inputMessage.forEach((item: IEventSpecificationEvent) => {
        description[item.eventType] = item.text;
      });
      model?._iovSchema?.eventSpecification?.outputMessage.forEach((item: IEventSpecificationEvent) => {
        description[item.eventType] = item.text;
      });
    } catch (error) {}
    Object.keys(model._onMessageMeta).forEach((item: string) => {
      const messageMeta = {
        type: "array",
        description: description[item] || "",
        items: {
          type: "string",
          description: "函数片段",
          format: "code",
        },
      };
      _onMessageMeta.properties[item] = messageMeta;
    });
    return _onMessageMeta;
  }
  return null;
}

/**
 * 创建元件model变更事件
 * @param model
 * @returns
 */
export function createModelChangeEvent(model: ISchema) {
  const outputMessage = [
    {
      text: "元件model属性变更",
      eventType: MODELCHANGETYPE,
      messageSchema: "",
      messageDemo: "",
    },
  ];
  try {
    const tempMessage = cloneDeep(model.iovSchema.eventSpecification.outputMessage);
    if (isArray(tempMessage)) {
      return outputMessage.concat(tempMessage);
    }
  } catch (error) {}
  return outputMessage;
}

/**
 * 判断字符串boolean
 * @param value 字符串boolean值
 */
export function booleanTransform(value: any) {
  if (value && value === "true") {
    return true;
  } else {
    return false;
  }
}

/**
 * 去掉字符串前后所有空格
 */
export function trim(str: string, isglobal: string) {
  let result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (isglobal && isglobal.toLowerCase() === "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}

/**
 * 样式转对象
 * @param style 字符串样式
 */
export function styleToObj(style: string) {
  if (!style || style == "") {
    return;
  }
  let Arr = style.split(";");
  Arr = Arr.map((item) => trim(item, "")).filter((item) => {
    return item != "" && item != "undefined";
  });
  let str = "";
  Arr.forEach((item) => {
    let test = "";
    trim(item, "")
      .split(":")
      .forEach((item2: string) => {
        if (item2.indexOf('"') !== -1) item2 = item2.replace(/"/g, "'");
        test += '"' + trim(item2, "") + '":';
      });
    str += test + ",";
  });
  str = str.replace(/:,/g, ",");
  str = str.substring(0, str.lastIndexOf(","));
  str = "{" + str + "}";
  return JSON.parse(str);
}

/**
 * 字符串样式转js样式
 * @param style 字符串样式
 */
export function cssToJs(style: string) {
  const re = /(-)(\w)/g;
  let str = "";
  if (style) {
    str = style.replace(re, function ($0, $1, $2) {
      return $2.toUpperCase();
    });
  }
  return str;
}

/**
 * 等待时间
 * @param time
 * @returns
 */
export function awaitTime(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, time);
  });
}

/**
 * 获取url参数
 * @param {*} variable
 */
export function getRouteVariable(variable: string) {
  let str = "";
  if (window.location.hash) {
    str = window.location.hash.split("?")[1];
  }
  if (window.location.search) {
    str = window.location.search.substring(1);
  }
  const vars = str.split("&");
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

/**
 * 获取session的UIB用户token
 */
export function getUserToken() {
  const token = sessionStorage.getItem("uibToken");
  if (token) {
    return token;
  } else {
    return false;
  }
}

/**
 * 获取session的UIB用户id
 */
export function getUserId() {
  const userInfo = sessionStorage.getItem("uibUserInfo");
  if (!userInfo) return false;
  try {
    const temp = JSON.parse(userInfo);
    if (temp?.id) {
      return temp.id;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

/**
 * 获取页面数据
 */
export async function getPageInfo(pageId: Number, domain: string) {
  if (!pageId) return null;
  const config = {
    url: domain + "/ui-builder/preview-page",
    method: "GET",
    // headers: {
    //   Authorization: "Bearer " + token,
    // },
    params: {
      id: pageId,
    },
  };
  return axios(config);
}

/**
 * 获取项目数据
 */
export async function getProjectInfo(projectId: Number, domain: string) {
  if (!projectId) return null;
  const config = {
    url: domain + "/ui-builder/preview-project",
    method: "GET",
    // headers: {
    //   Authorization: "Bearer " + token,
    // },
    params: {
      id: projectId,
      _t: +new Date(),
    },
  };
  return axios(config);
}

/**
 * 表单子组件向父组件发消息
 */
export function sendFormMsg(el: HTMLElement) {
  const parentNode = el.parentElement;
  if (parentNode && parentNode.dataset.elementType === "Q-FORM") {
    (parentNode as any).getFormData("valueChange");
  }
}

/**
 * 去除代码换行符
 * @param code
 */
export function removeLineBreaks(code: string) {
  return code.replace(/[\r\n]/g, "");
}

/**
 * 深度stringify
 * @param data
 * @returns
 */
export function stringifyDeep(data: Object) {
  return JSONfn.stringify(data);
}

/**
 * 清除lit-vue元件的vue实例
 * @param component
 */
export function unmountInstance(component: any) {
  try {
    component.componentInstance?.unmount();
    component.componentInstance = null;
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取可视画布大小
 * @returns {w: 宽度 h: 高度}
 */
export function getInnerDropzone() {
  const innerDropzone = document.getElementById("inner-dropzone") as HTMLDivElement;
  const result = { w: innerDropzone.offsetWidth || 1920, h: innerDropzone.offsetHeight || 1080 };
  let dom = document.getElementsByClassName("auto-size-inner-dropzone")[0] as HTMLDivElement;
  if (!isElement(dom)) dom = dom = document.getElementById("myApp") as HTMLDivElement;
  result.w = dom.offsetWidth + dom.scrollLeft > result.w ? result.w : dom.offsetWidth + dom.scrollLeft;
  result.h = dom.offsetHeight + dom.scrollTop > result.h ? result.h : dom.offsetHeight + dom.scrollTop;

  return result;
}
/**
 * 异步拖拽计算
 * @returns
 */
export function dyncDropComputing(
  curdom: HTMLDivElement,
  dh: number,
  p: { x: number; y: number },
  e: { w: number; h: number }
) {
  // console.log(p)
  const ch = p.y + e.h;
  const otherDom = $(curdom).siblings();
  let miniHeight = dh;
  if (otherDom.length) {
    otherDom.each(function () {
      const vh = parseInt($(this).css("top")) + parseInt($(this).css("height"));
      if (vh > miniHeight) miniHeight = vh;
    });
  }
  if (ch > miniHeight) miniHeight = ch;
  return miniHeight;
}

/**
 * 容器组件属性忽略
 * @param el
 * @param options
 * @param ignoreProps
 * @param fn
 * @return ob
 */
export function containerPropsIgnore(
  el: HTMLElement,
  ignoreProps: string[],
  fn: Function = () => {},
  options = {
    childList: true,
    attributes: true,
    subtree: true,
    characterDataOldValue: true,
    attributeOldValue: true,
  }
) {
  const callBack = (mutationsList: MutationRecord[], observer: MutationObserver) => {
    mutationsList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          mutation.addedNodes.length &&
            Array.from(mutation.addedNodes).map((addNode) => {
              const div = document.createElement("div");
              const model = (addNode as any).componentModel.model;
              // 先于组件初始化触发
              setTimeout(() => {
                div.style.cssText = (addNode as any).style.cssText;
                ignoreProps.length &&
                  ignoreProps.map((it) => {
                    div.style.removeProperty(it);
                  });
                model.initStyle = div.style.cssText;
              }, 500);
            });
          break;
        case "attributes":
          break;
      }
      if (typeof fn === "function") {
        fn(mutationsList, observer, el);
      }
    });
  };
  const ob = new MutationObserver(callBack);
  if (!el) return ob;
  ob.observe(el, options);
  return ob;
}

/**
 * 发送消息
 * @param modal 组件模型
 * @param type 事件类型
 * @param value 传递值内容
 */
export function onSendMessage(modal: ISchema, value: any, opt: { srcType?: string; dstType?: string; dst?: string }) {
  const { srcType, dstType, dst } = assign({ srcType: "", dstType: "", dst: "" }, opt);
  const message: IMessage = {
    header: {
      src: modal.id,
      dst,
      srcType,
      dstType,
    },
    body: value,
  };
  modal.componentModel.sendMessage(message);
}

export function loadScript(url: string | string[]) {
  const urlArr = url instanceof Array ? url : [url];
  urlArr.forEach((v: string) => {
    const script = document.createElement("script");
    script.src = v;
    document.head.append(script);
  });
}

/**
 * 文件选择器
 * @param url 弹出地址
 * @param 弹出窗名字
 * @param 宽度
 * @param 高度
 */
export function openFileSelector(url: string, winame = "_blank", w = 800, h = 500) {
  const t = (window.screen.availHeight - 30 - h) / 2,
    l = (window.screen.availWidth - 10 - h) / 2;

  return window.open(
    url,
    winame,
    `width=${w}, height=${h}, top=${t}, left=${l}, titlebar=no, menubar=no, scrollbars=yes, resizable=yes, status=yes, toolbar=no, location=no`
  );
}

export const isPromise = <T = any>(val: any): val is Promise<T> => {
  return isFunction(val.then) && isFunction(val.catch);
};
