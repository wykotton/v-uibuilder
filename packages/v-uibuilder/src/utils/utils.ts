import { isElement } from "lodash-es";

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

export const isStringNormal = (str: string): boolean => {
  if (/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g.test(str)) {
    return false;
  }
  // console.log(str.match(/[`!@#$%^&*()_+<>?:"{},.\/;'[\]，。！【】￥·、《》：“”…（）\-=\s]/m))
  // return !/[`!@#$%^&*()_+<>?:"{},.\/;'[\]，。！【】￥·、《》：“”…（）\-=\s]/m.test(str);
  return !/[`!@#$%^&*()+<>?:"{},.\/;'[\]，。！【】￥·、《》：“”…（）\-=\s]/m.test(str);
};

export function getNotSVGElement(path = []) {
  return path.find((element) => !isSVGElement(element));
}

export function isSVGElement(element: SVGAElement) {
  if (!isElement(element)) return false;
  return Object.prototype.toString.call(element).includes("SVG");
}

/**
 * dom转json
 * @param node 
 * @returns 
 */
export function DOMToJSON(node: HTMLElement) {
  node = node || undefined;
  const obj = {
    nodeType: node.nodeType,
    tagName: "",
    nodeValue: "",
    nodeName: "",
    attributes: [],
    childNodes: [],
  };
  if (node.tagName) {
    obj.tagName = node.tagName.toLowerCase();
  } else if (node.nodeName) {
    obj.nodeName = node.nodeName;
  }
  if (node.nodeValue) {
    obj.nodeValue = node.nodeValue;
  }
  let attrs = node.attributes;
  let childNodes = node.childNodes;
  let length;
  let arr;
  if (attrs) {
    length = attrs.length;
    arr = obj.attributes = new Array(length) as never[];
    for (let i = 0; i < length; i++) {
      const attr = attrs[i];
      arr[i] = [attr.nodeName, attr.nodeValue] as never;
    }
  }
  if (childNodes) {
    length = childNodes.length;
    arr = obj.childNodes = new Array(length) as never[];
    for (let i = 0; i < length; i++) {
      arr[i] = DOMToJSON(childNodes[i] as HTMLElement) as never;
    }
  }
  return obj;
};
