import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { useUserStoreWithOut } from "@/store/modules/user";
import { message, notification } from "ant-design-vue";
import interact from "interactjs";
import { isString } from "lodash-es";
import { parse } from "telejson";
import { savePageWarehouseApi } from "@/api/uibuilder/edit";
import { ComponentProtocolEnum } from "@/enums/appEnum";
import { getPageInfo } from "./page";

// pinia
const useUserStore = useUserStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

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
          return parse(list);
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
  let components = []; //.concat(...allComponent);
  components.push(...allComponent.flat());
  usePluginStore.setComponentsList(Object.preventExtensions(components));
  return components;
}

/**
 * 元件仓库协议
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

/**
 * 保存到页面库
 * @param {object} info 页面信息
 * @param {object} pageType 页面库类型
 */
export async function savePageWarehouse(info: { [key: string]: string }, pageType: string) {
  const userInfo = useUserStore.getUibUserInfo;
  if (!userInfo?.id) {
    notification.destroy();
    notification.warning({
      message: "用户id不存在!",
    });
    return;
  }
  const { type = "", name = "" } = info;
  const pageInfo = getPageInfo();
  if (!pageInfo) {
    message.error("页面数据获取失败!");
    return;
  }
  const data = [
    {
      custom_model: pageInfo,
      theme: {},
      name,
      type,
      group: pageType === "user" ? ["我的页面"] : ["公共页面"],
    },
  ];
  const userId = pageType === "user" ? userInfo.id : "";
  const results = await savePageWarehouseApi({ userId, data });
  return results;
}

/**
 * 弹窗拖动 
 */
export async function modalDrag({
  handle,
  content,
  resize
} = {
    handle: '.ant-modal-header',
    content: '.ant-modal',
    resize: '.ant-modal-content'
  }) {
  interact(content)
    .draggable({
      allowFrom: handle,
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      listeners: {
        move: dragMoveListener,
      }
    }).resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      allowFrom: resize,

      listeners: {
        move(event) {
          const target = event.target
          let x = (parseFloat(target.getAttribute('data-x')) || 0)
          let y = (parseFloat(target.getAttribute('data-y')) || 0)

          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.height = event.rect.height + 'px'

          // translate when resizing from top or left edges
          x += event.deltaRect.left
          y += event.deltaRect.top

          target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        }
      },
      modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
          outer: 'parent'
        }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 }
        })
      ],

      inertia: true
    })

  function dragMoveListener(event: any) {
    const target = event.target
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // update the element's style
    const styleObj = {
      width: event.rect.width + 'px',
      height: event.rect.height + 'px',
      transform: 'translate(' + x + 'px, ' + y + 'px)'
    }
    Object.assign(target.style, styleObj);
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
  }
}

interface IDragCanvas {
  el: HTMLElement;
  key: string; handler: (ev: any) => void;
  cursor: {
    default: "default",
    grab: "grab",
    grabbing: "grabbing",
  };
  isPreventDefault: boolean;
}

/**
 * 按住拖动
 * @param {*} options
 */
export const useDelegateButtonMov = () => {
  const delegateObj = { mouseHandler: { srcElement: null }, isMov: false };
  const keyPressMove = (options: IDragCanvas) => {
    const { el, key, handler, cursor, isPreventDefault } = options;

    /**
     * div绑定键盘事件必须有这个东西,它原本是使用`tab`来定位元素的方式
     */
    if (!el) {
      return;
    } else if (!el.getAttribute("tabindex")) {
      el.setAttribute("tabindex", "-1");
    }
    el.style.outline = "none";
    el.style.cursor = cursor.default;
    // 引用信息
    const info = {
      // 是否按住
      isPress: false,
      // 是否正在拖拽
      isGrabbing: false,
    };
    // 拖拽的起点
    const startInfo = {
      x: 0,
      y: 0,
      scrollLeft: 0,
      scrollTop: 0,
    };
    // 拖拽的偏移值
    const diffInfo = {
      x: 0,
      y: 0,
    };

    // 指定键按下
    const keyDownHandler = (e: any) => {
      const { srcElement } = delegateObj.mouseHandler;
      if (el !== document.activeElement) return;
      if (isPreventDefault && e.key === key) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === key && !info.isPress && el.contains(srcElement)) {
        info.isPress = true;
        el.style.cursor = cursor.grab;
        addMouseEvent();
        delegateObj.isMov = false;
      }
    };
    // 指定键松开
    const keyUpHandler = (e: any) => {
      isPreventDefault && e.key === key && e.preventDefault();
      if (e.key === key) {
        info.isPress = false;
        info.isGrabbing = false;
        el.style.cursor = cursor.default;
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        delegateObj.isMov = true;

        removeMouseEvent();
      }
    };
    // 鼠标区块信息
    const mouseHandler = (e: any) => {
      delegateObj.mouseHandler = e;
    };

    // 绑定
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousedown", mouseHandler);

    // 鼠标按下
    const mouseDownHandler = (e: any) => {
      e.stopImmediatePropagation();
      const { pageX, pageY } = e;
      if (info.isPress) {
        info.isGrabbing = true;
        startInfo.x = pageX;
        startInfo.y = pageY;
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        el.style.cursor = cursor.grabbing;
      }
    };
    // 鼠标移动
    const mousemoveHandler = (e: any) => {
      e.stopImmediatePropagation();
      const { pageX, pageY } = e;
      if (info.isPress && info.isGrabbing) {
        diffInfo.x = startInfo.x - pageX;
        diffInfo.y = startInfo.y - pageY;
        el.scrollLeft = startInfo.scrollLeft + diffInfo.x;
        el.scrollTop = startInfo.scrollTop + diffInfo.y;
      }
    };
    // 鼠标松开
    const mouseUpHandler = (e: any) => {
      e.stopImmediatePropagation();
      info.isGrabbing = false;
      if (info.isPress) {
        startInfo.scrollLeft = el.scrollLeft;
        startInfo.scrollTop = el.scrollTop;
        el.style.cursor = cursor.grab;
      } else {
        el.style.cursor = cursor.default;
      }
    };
    // 鼠标丢失
    const mouseLeaveHandler = (e: any) => {
      e.stopImmediatePropagation();
      mouseUpHandler(e);
    };
    const addMouseEvent = () => {
      // console.log("添加了鼠标事件");
      el.addEventListener("mousemove", mousemoveHandler, true);
      el.addEventListener("mousedown", mouseDownHandler, true);
      el.addEventListener("mouseup", mouseUpHandler, true);
      el.addEventListener("mouseleave", mouseLeaveHandler, true);
    };
    const removeMouseEvent = () => {
      // console.log("移除了鼠标事件");
      el.removeEventListener("mousemove", mousemoveHandler, true);
      el.removeEventListener("mouseup", mouseUpHandler, true);
      el.removeEventListener("mousedown", mouseDownHandler, true);
      el.removeEventListener("mouseleave", mouseLeaveHandler, true);
    };
    onUnmounted(() => {
      removeMouseEvent();
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousedown", mouseHandler);
    })

    // 业务逻辑一般通过这个handler来处理,由于是传递的引用对象,那么业务代码也能拿到改变后的信息
    handler && handler(info);
  };
  return {
    keyPressMove,
  };
}; 
