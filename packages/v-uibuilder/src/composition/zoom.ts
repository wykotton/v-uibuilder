import $ from "jquery";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { message } from "ant-design-vue";
import { watch } from "vue";
import { CanvasIdEnum } from "@/enums/appEnum";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 监听scaleNum,进行画布缩放
 */
watch(
  () => useAppStore.scaleNum,
  (newValue) => {
    scaleCanvas(newValue);
    useSettingStore.guides.verticalGuides.zoom = newValue;
    useSettingStore.guides.horizontalGuides.zoom = newValue;
  }
);

/**
 * 画布滚轮事件，用于缩放画布
 */
export function addPageZoomEvents() {
  const { userAgent } = navigator;
  if (userAgent.indexOf("Firefox") > -1) {
    $("#myApp").on("DOMMouseScroll", (event) => {
      scaleEvents(event, "Firefox");
    });
  } else {
    $("#myApp").on("mousewheel", (event) => {
      scaleEvents(event, "other");
    });
  }
}

/**
 * canvas缩放事件
 * @param event 鼠标滚轮对象
 * @param type 浏览器
 * @returns
 */
function scaleEvents(event: any, type: string) {
  if (!useAppStore.isCtrlKey) return;
  event.stopPropagation();
  event.preventDefault();
  let state = "";
  if (type === "Firefox") {
    state = event.originalEvent.detail < 0 ? "add" : "reduce";
  } else {
    state = event.originalEvent.wheelDelta > 0 ? "add" : "reduce";
  }
  calculateScale(state);
}

/**
 * 操作缩放比例
 * @param state 缩放状态
 */
export function calculateScale(state: string) {
  switch (state) {
    case "add":
      if (useAppStore.scaleNum < 2) {
        useAppStore.setScaleNum(Number((useAppStore.scaleNum + 0.1).toFixed(1)));
      } else {
        message.destroy();
        message.warning("已缩放至最大比例");
      }
      break;
    case "reduce":
      if (useAppStore.scaleNum > 0.5) {
        useAppStore.setScaleNum(Number((useAppStore.scaleNum - 0.1).toFixed(1)));
      } else {
        message.destroy();
        message.warning("已缩放至最小比例");
      }
      break;
  }
}

/**
 * canvas缩放操作
 * @param scaleNum 缩放系数
 */
export function scaleCanvas(scaleNum: number) {
  const canvas = $(`#${CanvasIdEnum.INNER}`);
  const { x, y } = calculateTranslate(canvas);
  canvas.css("transform", `scale(${scaleNum}) translate(${x}px,${y}px)`);
  if (useAppStore.themeConfig.isGrid) {
    // 用缩放比例重新计算canvas网格背景，防止网格显示错乱
    canvas.css(
      "backgroundImage",
      `
      repeating-linear-gradient( 
      0deg,
      rgba(36, 41, 46, 0.25) 0px,
      rgba(36, 41, 46, 0.25) 0px,
      transparent ${1 / scaleNum}px, transparent ${16 / scaleNum}px ),
      repeating-linear-gradient(90deg,
      rgba(36, 41, 46, 0.25) 0px,
      rgba(36, 41, 46, 0.25) 0px,
      #ffffff ${1 / scaleNum}px,
      #ffffff ${16 / scaleNum}px )`
    );
  }
}

/**
 * 计算canvas缩放后translate需要的偏移量
 * @param element 画布节点
 */
function calculateTranslate(element: any) {
  const width = ($(element) as any).width() / 2;
  const height = ($(element) as any).height() / 2;
  const x = (width * useAppStore.scaleNum - width) / useAppStore.scaleNum;
  const y = (height * useAppStore.scaleNum - height) / useAppStore.scaleNum;
  return { x, y };
}
