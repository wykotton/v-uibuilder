import { ComponentProtocolEnum } from "@zzjz/v-uibuilder-types";
import JSONfn from "json-fn";
import { isString } from "lodash-es";

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
                    return JSONfn.parse(list);
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
 * 元件仓库通讯协议
 * @param targetIndex 仓库名称
 * @param options 参数
 */
export function componentsAction(
    targetIndex: string,
    options: {
        type: ComponentProtocolEnum;
        body?: any;
    }
) {
    return new Promise((resolve, reject) => {
        Object.assign(options, { reply: { resolve, reject } });
        window.dispatchEvent(
            new CustomEvent(targetIndex, {
                detail: {
                    ...options,
                },
            })
        );
        setTimeout(() => {
            resolve(null);
        }, 5000);
    });
}