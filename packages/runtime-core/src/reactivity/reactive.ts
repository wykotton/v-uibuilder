import { reactive, computed } from "@vue/reactivity";
import { watch } from "@vue/runtime-core";
import { isObject } from "lodash-es";

/**
 * 创建深度监视模型代理
 * @param obj 代理对象
 * @returns proxy obj
 */

export function createDeepWatchModelProxy(obj: object) {
  if (!obj) return;
  return reactive(obj);
}

/**
 * 监听对象
 * @param soureces ;
 * @param cb
 * @param options
 * @returns
 */
export function watchProxy(soureces: object, cb: (value: object, oldValue: object) => void, options?: object) {
  if (!soureces) return;
  return watch(isObject(soureces) ? soureces: () => soureces, cb, options);
}

// 实现一个方法判断

/**
 * 延迟计算函数
 * @param getter ;
 * @param debueOptions
 * @returns
 */
export function proxyComputed(getter: any, debueOptions?: object | undefined) {
  if (!getter) return;
  return computed(getter, debueOptions);
}
