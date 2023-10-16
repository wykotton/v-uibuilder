import { ISchema } from "../types/runtime/IModelSchema";
import { cloneDeep, isObject, isFunction } from "lodash-es";
import { JSONPath } from "jsonpath-plus";
import { IAttributeConfig, IAttributeInfo } from "../types/runtime/IAttributeConfig";

export enum IStoryType {
  TRIGGER = "trigger",
  RECEIVE = "receive",
}

/**
 * 进行属性绑定，重写set操作
 */
export function handleAttributeBind(config: IAttributeInfo) {
  const boundElement = document.querySelector(`#${config.bound.target}`);
  const boundModel = (boundElement as any)?.componentModel?.model;
  if (!config || !boundModel) return;
  const { currentAttr, currentKey } = getParentAttribute(boundModel, config.bound.attribute);
  // 进行set重写
  rewritePropertyDescriptor(boundModel, currentAttr, currentKey, config.bound.attribute, config.target);
  // 初次重写完成后调用一次数据绑定
  proxySetFN(config.bound.attribute, config.target, config.bound.target);
}

/**
 * 获取属性路径的父级对象和路径终点key
 * @param model
 * @param path
 * @returns
 */
export function getParentAttribute(model: ISchema, path: string) {
  const objPath = String(path).split(".");
  const lastAttr = objPath[objPath.length - 1];
  let parentPath = "";
  const leftIndex = lastAttr.indexOf("[");
  const rightIndex = lastAttr.indexOf("]");
  const currentKey = leftIndex === -1 ? lastAttr : lastAttr.substring(leftIndex, rightIndex);
  if (objPath.length === 1) {
    if (leftIndex !== -1) {
      parentPath = lastAttr.substring(0, leftIndex);
    }
  } else {
    const tempObjPath = cloneDeep(objPath);
    if (leftIndex === -1) {
      tempObjPath.splice(objPath.length - 1, 1);
      parentPath = tempObjPath.join(".");
    } else {
      tempObjPath[tempObjPath.length - 1] = lastAttr.substring(0, leftIndex);
      parentPath = tempObjPath.join(".");
    }
  }
  return { currentAttr: parentPath ? JSONPath({ path: parentPath, json: model })[0] : model, currentKey };
}

/**
 * 重写属性set操作
 * @param componentModel
 * @param attribute
 * @param bindKey
 * @param rootKey
 * @param componentId
 * @returns
 */
export function rewritePropertyDescriptor(
  componentModel: any,
  currentAttr: any,
  currentKey: string,
  rootKey: string,
  componentId: string
) {
  if (!componentModel || !currentAttr) return;
  const modelTempObj = Object.getOwnPropertyDescriptor(currentAttr ?? {}, currentKey);
  if (modelTempObj?.value) {
    const tempObj = cloneDeep(modelTempObj);
    Reflect.deleteProperty(tempObj, "value");
    Reflect.deleteProperty(tempObj, "writable");
    Object.defineProperty(currentAttr, currentKey, {
      ...tempObj,
      get: function () {
        return modelTempObj.value;
      },
      set: function (val) {
        modelTempObj.value = val;
        proxySetFN(rootKey, componentId, componentModel.id);
      },
    });
  } else {
    Object.defineProperty(currentAttr, currentKey, {
      ...modelTempObj,
      set: function (val) {
        if (modelTempObj?.set) {
          modelTempObj.set.call(componentModel, val);
        }
        proxySetFN(rootKey, componentId, componentModel.id);
      },
    });
  }

  // 如果当前属性值是一个对象，则继续将为此对象重写set
  if (isObject(currentAttr[currentKey]) && !isFunction(currentAttr[currentKey])) {
    Object.keys(currentAttr[currentKey]).forEach((key: string) => {
      const keyPath = Number.isNaN(Number(key)) ? `${rootKey}.${key}` : `${rootKey}[${key}]`;
      rewritePropertyDescriptor(componentModel, currentAttr[currentKey], key, keyPath, componentId);
    });
  }
}

/**
 * 根据模型绑定关系，进行数据更改
 * @param boundKey 绑定key
 * @param bindId 元件id
 * @param boundId 绑定元件id
 */
export function proxySetFN(rootKey: string, bindId: string, boundId: string) {
  new Promise<void>(() => {
    const allBind = Array.from(document.querySelectorAll("q-attribute-bind")).map(
      (element: any) => element.value || {}
    );
    allBind.forEach((config: IAttributeConfig) => {
      config[boundId]?.forEach((info: IAttributeInfo) => {
        const { target: bindTarget, attribute: bindAttribute, bound } = info;
        const { target: boundTarget, attribute: boundAttribute, script } = bound;
        if (
          !rootKey ||
          !bindId ||
          !boundId ||
          bindId !== bindTarget ||
          boundId !== boundTarget ||
          rootKey.indexOf(boundAttribute) === -1
        )
          return;
        const bindElement = document.querySelector(`#${bindTarget}`);
        const bindModel = (bindElement as any)?.componentModel?.model;
        const boundElement = document.querySelector(`#${boundTarget}`);
        const boundModel = (boundElement as any)?.componentModel?.model;
        if (!bindModel || !boundModel) return;
        const { currentAttr: bindAttr, currentKey: bindKey } = getParentAttribute(bindModel, bindAttribute);
        const { currentAttr: boundAttr, currentKey: boundKey } = getParentAttribute(boundModel, boundAttribute);
        if (JSON.stringify(bindAttr[bindKey]) !== JSON.stringify(boundAttr[boundKey])) {
          let value = cloneDeep(boundAttr[boundKey]);
          try {
            const dataScript = new Function(`return ${script}`)();
            value = dataScript(value);
          } catch (error) {
            console.log(error);
          }
          bindAttr[bindKey] = value;
        }
      });
    });
  });
}
