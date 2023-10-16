import { cloneDeep, isArray, isFunction, isObject } from "lodash-es";
import { JSONPath } from "jsonpath-plus";
import { IRelationship, ISchema } from "@zzjz/v-uibuilder-types";

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
 * @param bingKey
 * @param rootKey
 * @param componentId
 * @returns
 */
export function rewritePropertyDescriptor(
  componentsArray: ISchema[],
  componentModel: any,
  attribute: any,
  bingKey: string,
  rootKey: string,
  componentId: string
) {
  if (!componentModel || !attribute) return;
  const modelTempObj = Object.getOwnPropertyDescriptor(attribute ?? {}, bingKey);
  // 先还原基础原型
  // Object.defineProperty(proxyModel, bindKey, { ...reductionTempObj });
  if (modelTempObj?.value) {
    const tempObj = cloneDeep(modelTempObj);
    Reflect.deleteProperty(tempObj, "value");
    Reflect.deleteProperty(tempObj, "writable");
    Object.defineProperty(attribute, bingKey, {
      ...tempObj,
      get: function () {
        return modelTempObj.value;
      },
      set: function (val) {
        modelTempObj.value = val;
        proxySetFN(componentsArray, rootKey, componentId, componentModel.id);
      },
    });
  } else {
    Object.defineProperty(attribute, bingKey, {
      ...modelTempObj,
      set: function (val) {
        if (modelTempObj?.set) {
          modelTempObj.set.call(componentModel, val);
        }
        proxySetFN(componentsArray, rootKey, componentId, componentModel.id);
      },
    });
  }

  // 如果当前属性值是一个对象，则继续将为此对象重写set
  if (isObject(attribute[bingKey]) && !isFunction(attribute[bingKey])) {
    Object.keys(attribute[bingKey]).forEach((key: string) => {
      const keyPath = Number.isNaN(Number(key)) ? `${rootKey}.${key}` : `${rootKey}[${key}]`;
      rewritePropertyDescriptor(componentsArray, componentModel, attribute[bingKey], key, keyPath, componentId);
    });
  }
}

/**
 * 根据模型绑定关系，进行数据更改
 * @param rootKey
 * @param componentId
 */
export function proxySetFN(componentsArray: ISchema[], rootKey: string, srcId: string, targetId: string) {
  new Promise<void>(() => {
    const allBind = cloneDeep(componentsArray)
      .filter((current: any) => current.attrBindRelationship && isArray(current.attrBindRelationship))
      .map((current: any) => current.attrBindRelationship)
      .flat();
    allBind.forEach((current: IRelationship) => {
      const { src, target, selectedKey, bindKey, handleFn } = current;
      if (!rootKey || !srcId || !targetId || src !== srcId || target !== targetId || rootKey.indexOf(bindKey) === -1)
        return;
      const srcModel = componentsArray?.find?.((current) => current.id === src);
      const targetModel = componentsArray?.find?.((current) => current.id === target);
      if (!srcModel || !targetModel) return;
      const { currentAttr: srcAttr, currentKey: srcKey } = getParentAttribute(srcModel, selectedKey);
      const { currentAttr: targetAttr, currentKey: targetKey } = getParentAttribute(targetModel, bindKey);
      if (JSON.stringify(srcAttr[srcKey]) !== JSON.stringify(targetAttr[targetKey])) {
        let value = cloneDeep(targetAttr[targetKey]);
        try {
          const dataScript = new Function(`return ${handleFn}`)();
          value = dataScript(value);
        } catch (error) {
          console.log(error);
        }
        srcAttr[srcKey] = value;
      }
    });
  });
}
