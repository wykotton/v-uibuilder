import { cloneDeep, isFunction, isObject, isElement, assign, isArray } from "lodash-es";
import { IEventSpecificationEvent, ISchema, IWatchSetting } from "../types/runtime/IModelSchema";
import { Component } from "../types/runtime/Component";
import { IMessage } from "../types/runtime/IMessage";
import { JSONPath } from "jsonpath-plus";
import axios from "axios";
import JSONfn from "json-fn";
import $ from "jquery";

/**
 * 元件model变更消息类型
 */
export const modelChangeType = "modelChange";

/**
 * 生成hashid
 * @param {*} hashLength
 */
export function createHash(hashLength = 12) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
}

/**
 * 生成onlyid
 * @param {*} hashLength
 * @param {*} key
 */
export function createHashId(hashLength = 12, key = "drag-") {
  let probeId = `${key}${createHash(hashLength)}`;
  while (document.querySelectorAll(`#${probeId}`).length) {
    // dom存在即重新构成
    probeId = `${key}${createHash(hashLength)}`;
  }
  return probeId;
}

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

export function deepWatchModelProxy(
  obj: ISchema,
  rootKey?: string,
  rootObj?: any,
  componentModel?: any,
  path?: string
) {
  return new Proxy(obj, {
    get(target, key, receiver): any {
      const res = Reflect.get(target, key, receiver) as ISchema;

      if (isObject(res) && !isFunction(res)) {
        const targetPath = handleTargetPath(path || "", String(key));
        // 如果当前获取的属性值是一个对象，则继续将为此对象创建 Proxy 代理
        return deepWatchModelProxy(
          res,
          rootKey ?? (key as string),
          rootObj ?? obj,
          componentModel,
          targetPath
        ) as ISchema;
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
      const oldValue = {};
      const tempOldValue = JSONPath({ path: targetPath, json: targetObj })[0] ?? null;
      Object.keys(onWatchFn).forEach((watchKey: string) => {
        if (watchKey && targetPath.indexOf(watchKey) !== -1) {
          const value = JSONPath({ path: watchKey, json: targetObj })[0] ?? null;
          oldValue[watchKey] = cloneDeep(value);
        }
      });
      const check: boolean = Reflect.set(target, key, value, receiver);
      const tempNewValue = JSONPath({ path: targetPath, json: targetObj })[0] ?? null;
      Object.keys(onWatchFn).forEach((watchKey: string) => {
        if (watchKey && targetPath.indexOf(watchKey) !== -1) {
          const value = JSONPath({ path: watchKey, json: targetObj })[0] ?? null;
          const propertyDeepWatch = onWatchFn[watchKey] ?? [];
          propertyDeepWatch.forEach((callBack: Function) => {
            isFunction(callBack) && callBack(value, oldValue[watchKey], targetObj);
          });
        }
      });
      // const propertyWatch = onWatchFn[targetKey] ?? [];
      // propertyWatch.forEach((callBack: Function) => {
      //   callBack && callBack(targetObj[targetKey], cloneDeep(targetObj[targetKey]), targetObj);
      // });
      // if (targetKey !== key) {
      //   const propertyDeepWatch = onWatchFn[targetPath] ?? [];
      //   propertyDeepWatch.forEach((callBack: Function) => {
      //     callBack && callBack(target[key], cloneDeep(target[key]), receiver);
      //   });
      // }
      // 触发更新回调
      try {
        componentModel?.update?.callback?.forEach((callBack: Function) => {
          isFunction(callBack) && callBack(targetObj, targetKey, targetPath, receiver, key);
        });
      } catch (error) {}
      // 触发model变更消息
      try {
        const message: IMessage = {
          header: {
            src: componentModel.model.id || "",
            srcType: modelChangeType,
            dst: "",
            dstType: "",
          },
          body: {
            oldValue: cloneDeep(tempOldValue),
            newValue: cloneDeep(tempNewValue),
            key,
            path: targetPath,
          },
        };
        componentModel?.sendMessage(message);
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
  // const _onMessageMeta = createMessageMeta(model);
  // if (_onMessageMeta) {
  //   createModel.properties["_onMessageMeta"] = _onMessageMeta;
  // }
  const viewModel = deepAssign(cloneDeep(model.iovSchema.optionsView.model) || {}, cloneDeep(createModel));
  return viewModel;
}

/**
 * 创建_onMessageMeta描述
 * @param model
 * @returns
 */
// @ts-ignore
function createMessageMeta(model: ISchema) {
  if (model?._onMessageMeta) {
    const _onMessageMeta = {
      type: "object",
      description: "消息响应",
      properties: {},
    };
    const description = {};
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
      eventType: modelChangeType,
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
    characterDataOldValue: false,
    attributeOldValue: false,
  }
) {
  const callBack = (mutationsList: MutationRecord[], observer: MutationObserver) => {
    mutationsList.forEach((mutation) => {
      switch (mutation.type) {
        case "childList":
          mutation.addedNodes.length &&
            Array.from(mutation.addedNodes).map((addNode) => {
              // 只监听第一层
              if ((addNode as any).parentElement.id !== el.id) return;
              // const div = document.createElement("div");
              // const model = (addNode as any).componentModel.model;
              // div.style.cssText = model.initStyle;
              // ignoreProps.length &&
              // ignoreProps.map((it) => {
              //   div.style.removeProperty(it);
              // });
              // // 先于组件初始化触发
              // setTimeout(() => {
              //   console.log((addNode as any).style.cssText);
              //   model.initStyle = div.style.cssText;
              // }, 500);
              const div = document.createElement("div");
              const model = (addNode as any)?.componentModel?.model;
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
export function onSendMessage(com: Component, value: any, opt: { srcType?: string; dstType?: string; dst?: string }) {
  if (!com.id) return
  const { srcType, dstType, dst } = assign({ srcType: "", dstType: "", dst: "" }, opt);
  const message: IMessage = {
    header: {
      src: com.id,
      dst,
      srcType,
      dstType,
    },
    body: value,
  };
  com["componentModel"].sendMessage(message);
}

export function loadScript(url: string | string[]) {
  const urlArr = url instanceof Array ? url : [url];
  urlArr.map((v: string) => {
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

interface openOptionType {
  selected?: Function;
  closed?: Function;
}
interface openType extends openOptionType {
  url?: string;
  winame?: string;
  w?: number;
  h?: number;
}
// selected=picselector
export function openFileSelector(wid: string, open: openType, option?: openOptionType) {
  const defaultOpen = {
    url: `${location.origin}/v-component/q-file-selector/temp.html?wid=${wid}`,
    winame: "_blank",
    w: 800,
    h: 500,
  };
  let openArg;
  if (open.selected) {
    option = open;
    openArg = defaultOpen;
  } else {
    openArg = Object.assign({}, defaultOpen, open);
  }

  // if (winame === "modal") {
  //   $.get(url).then((res:any) => {
  //     const modal = window.open("", winame, `width=${w}, height=${h}, top=${t}, left=${l}, titlebar=no, menubar=no, scrollbars=yes, resizable=yes, status=yes, toolbar=no, location=no`)
  //     const script = document.createElement("script")
  //     script.setAttribute("type", "module")
  //     script.innerHTML = `import "${location.origin}/v-component/src/components/q-file-selector/q-file-selector.ts";`
  //     modal?.document.head.append(script)
  //     // loadScript([`${location.origin}/v-component/src/components/q-file-selector/q-file-selector.ts`])
  //     modal?.document.write(`<q-file-selector></q-file-selector>`)
  //     const dom = modal?.document.body as HTMLElement
  //     dom.innerHTML = res
  //   })

  // } else {}
  if (window["q-file-selector"] && window["q-file-selector"][wid]?.win) window["q-file-selector"][wid].win.close();
  if (
    !window["q-file-selector"] ||
    !window["q-file-selector"][wid]?.win ||
    window["q-file-selector"][wid].win?.closed
  ) {
    window["q-file-selector"] = {};
    window["q-file-selector"][wid] = option;
    const t = (window.screen.availHeight - 30 - openArg.h) / 2,
      l = (window.screen.availWidth - 10 - openArg.h) / 2;
    window["q-file-selector"][wid].win = window.open(
      openArg.url,
      openArg.winame,
      `width=${openArg.w}, height=${openArg.h}, top=${t}, left=${l}, titlebar=no, menubar=no, scrollbars=yes, resizable=yes, status=yes, toolbar=no, location=no`
    );
    return window["q-file-selector"][wid].win;
  }
  // else window["q-file-selector"][wid].win.focus()
}

/**
 * 鼠标移入
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
 * 鼠标移出
 */
export function blurSelectCom() {
  try {
    Array.from(document.querySelectorAll(".focusBind")).forEach((element) => {
      element?.classList.remove("focusBind");
    });
  } catch (error) {}
}
