import Moveable from "moveable";
import { MoveableParams, AttributeEnum } from "./params";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { message } from "ant-design-vue";
import { ISchema } from "@/types/IModelSchema";
import {
  checkComponentRoot,
  changeSetter,
  onClickNode,
  changePluginSource,
  detectionModalLoad,
} from "@/composition/index";
import $ from "jquery";
import { cloneDeep } from "lodash-es";
import { CanvasIdEnum } from "@/enums/appEnum";
import { ChangeSetterEnum } from "@/enums/settingEnum";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/*
 * Moveable
 * draggable 拖拽
 * resizable 改变大小
 * snappable 捕捉、自动吸附
 */
export class MoveableExample extends MoveableParams {
  constructor() {
    super();
    this.initMoveable(this.topParam);
    this.initMoveable(this.bottomParam);
  }

  /*
   * 创建moveable实例
   */
  private initMoveable(param: any) {
    (this as any)[param.rootName] = new Moveable(
      param.rootNode || null, // moveable元素的父元素
      {
        target: param.target || null, // movable元素
        snappable: param.snappable || false, // 是否初始化捕捉功能
        snapContainer: param.snapContainer || null, // 捕捉功能(辅助线)的容器
        snapThreshold: param.snapThreshold || 5, // 捕捉效果触发的临界值,即元素与辅助线间距小于此数值,则自动贴边
        bounds: param.bounds || null, // moveable操作元素的外边界值
        draggable: param.draggable || false, // 是否初始化拖拽
        resizable: param.resizable || false, // 是否初始化调整大小
        keepRatio: param.keepRatio || false, // 调整大小或缩放时，保持宽度、高度的比例
        throttleDrag: param.throttleDrag || 0, // 拖拽的节流步长，即每次拖拽多少px，0则不节流
        throttleResize: param.throttleResize || 0, // 调整大小时的节流
        startDragRotate: param.startDragRotate || 0, // 拖拽开始的角度
        throttleDragRotate: param.throttleDragRotate || 0, // 旋转角度的节流，每次拖拽旋转多少度，0则不节流
        zoom: param.zoom || 1, // target辅助边框和操作点的大小
        origin: param.origin || false, // 是否显示target中心辅助点
        padding: param.padding || null, // 在目|标周围添加填充以增加拖动区域
        stopPropagation: param.stopPropagation || false, // 阻止事件冒泡(mousedown, touchstart)
        preventClickDefault: param.preventClickDefault || false, // 阻止dragStart的单击事件(mousedown, touchstart)
        elementGuidelines: param.elementGuidelines || [], // 捕捉效果辅助线的dom列表
        snapGap: param.snapGap || false, // 显示多组件间相等的间隙距离
        snapDirections: param.snapDirections || { left: true, top: true, right: true, bottom: true }, // 元素磁吸时当前target捕捉的方向
        elementSnapDirections: param.elementSnapDirections || { left: true, top: true, right: true, bottom: true }, // 元素磁吸时其它DOM捕捉的方向
      }
    );
    const events = [
      "dragStart",
      "drag",
      "dragEnd",
      "dragGroupStart",
      "dragGroup",
      "dragGroupEnd",
      "resizeStart",
      "resize",
      "resizeEnd",
      "resizeGroupStart",
      "resizeGroup",
      "resizeGroupEnd",
      "click",
      "clickGroup",
    ];
    events.forEach((event) => {
      (this as any)[param.rootName].on(event, (e: any) => {
        if (detectionModalLoad(event, e.target, e)) return;
        param[event] ? param[event](e) : void 0;
      });
    });
  }

  // 矩阵信息临时数据
  public moveableTopRect: any = null;
  public moveableBottomRect: any = null;

  /**
   * 设置moveable可拖拽的target
   * @param e
   * @param dragStart 是否开始拖拽
   * @returns
   */
  public setMoveableTarget(e: any, dragStart = false) {
    if (
      detectionModalLoad("setMoveableTarget", e.target, [...arguments, this], { isp: dragStart, property: "moveable" })
    )
      return;
    const rootId = e.delegateTarget.id;
    if (!rootId) return;
    switch (rootId) {
      case CanvasIdEnum.INNER:
        this.setTopTarget(e.currentTarget);
        if (dragStart) {
          (this as any).moveableTop.dragStart(e);
        }
        break;
      case CanvasIdEnum.BOTTOM:
        this.setBottomTarget(e.currentTarget);
        if (dragStart) {
          (this as any).moveableBottom.dragStart(e);
        }
        break;
    }
  }

  /*
   * 设置Top的target
   */
  public setTopTarget(target: HTMLElement) {
    if (detectionModalLoad("setTopTarget", target, arguments)) return;
    if ((this as any).moveableTop.target === target) {
      return;
    }
    this.clearAllTarget();
    (this as any).moveableTop.target = target;
  }
  /*
   * 设置Bottom的target
   */
  public setBottomTarget(target: HTMLElement) {
    if (detectionModalLoad("setBottomTarget", target, arguments)) return;
    if ((this as any).moveableBottom.target === target) {
      return;
    }
    this.clearAllTarget();
    (this as any).moveableBottom.target = target;
  }
  /*
   * 清除所有target
   */
  public clearAllTarget() {
    if ((this as any).moveableTop.target) {
      (this as any).moveableTop.target = null;
    }
    if ((this as any).moveableBottom.target) {
      (this as any).moveableBottom.target = null;
    }
  }

  /**
   * 获取拖拽时的起始坐标，防止位置闪烁
   * @param event 操作对象
   * @param type 单个/组
   */
  public getStartCoordinate(event: any, type: string) {
    if (detectionModalLoad("getStartCoordinate", event.target, arguments)) return;
    let coordinate: any = [];
    switch (type) {
      case AttributeEnum.ONE:
        const target = event.target;
        const { left, top } = this.getCoordinate(target);
        coordinate = [left, top];
        break;
      case AttributeEnum.GROUP:
        const targets = event.targets;
        targets.forEach((item: HTMLElement) => {
          const { left, top } = this.getCoordinate(item);
          coordinate.push([left, top]);
        });
        break;
    }
    return coordinate;
  }
  private getCoordinate(target: HTMLElement) {
    let left = 0;
    let top = 0;
    if (!target) return { left, top };
    const { left: targetLeft, top: targetTop } = target.getBoundingClientRect();
    if (target.assignedSlot) {
      const { left: slotLeft, top: slotTop } = target.assignedSlot.getBoundingClientRect();
      left = targetLeft - slotLeft;
      top = targetTop - slotTop;
    } else if (target.parentElement) {
      const { left: parentLeft, top: parentTop } = target.parentElement.getBoundingClientRect();
      left = targetLeft - parentLeft;
      top = targetTop - parentTop;
    } else {
      left = targetLeft;
      top = targetTop;
    }
    left = left / useAppStore.scaleNum;
    top = top / useAppStore.scaleNum;
    return { left, top };
  }

  /*
   * 拖拽
   */
  public dragMoveListener(event: any) {
    if (detectionModalLoad("dragMoveListener", event.target, arguments)) return;
    // console.log(event);
    switch (event.eventType) {
      case "drag":
        this.dragMove(event);
        break;
      case "dragGroup":
        this.dragGroupMove(event);
        break;
    }
  }

  /**
   * 单组件拖拽
   * @param event 拖拽对象
   */
  private dragMove(event: any) {
    const { target } = event;
    if (detectionModalLoad("dragMove", event.target, [...arguments, this], { isp: true, property: "moveable" })) return;
    const beforeTranslate = event.beforeTranslate;
    let x = Number(beforeTranslate[0].toFixed(3));
    let y = Number(beforeTranslate[1].toFixed(3));
    // 非画布组件手动处理边界;
    if (target.parentElement.id !== CanvasIdEnum.INNER && target.parentElement.id !== CanvasIdEnum.BOTTOM) {
      const slotElement = target.assignedSlot;
      const dropzone = slotElement?.parentElement; // 获取组件内|部着陆区
      if (dropzone) {
        const { overflowX, overflowY } = getComputedStyle(dropzone, null);
        const parentWidth = dropzone.offsetWidth || 0;
        const parentHeight = dropzone.offsetHeight || 0;
        // 基于overflow判定是否需要限制边界
        if (overflowX === "hidden" || overflowX === "clip") {
          x < 0 ? (x = 0) : void 0;
          x + event.width > parentWidth ? (x = parentWidth - event.width) : void 0;
        }
        if (overflowY === "hidden" || overflowY === "clip") {
          y < 0 ? (y = 0) : void 0;
          y + event.height > parentHeight ? (y = parentHeight - event.height) : void 0;
        }
      }
    }
    this.handleTransform(x, y, 0, 0, target, true);
  }

  /**
   * 多组件拖拽
   * @param event 拖拽对象组
   */
  private dragGroupMove(event: any) {
    if (detectionModalLoad("dragGroupMove", event.target, arguments)) return;
    event.events.forEach((ev: any) => {
      const target = ev.target;
      const beforeTranslate = ev.beforeTranslate;
      const x = Number(beforeTranslate[0].toFixed(3));
      const y = Number(beforeTranslate[1].toFixed(3));
      this.handleTransform(x, y, 0, 0, target, true);
    });
  }

  /**
   * 调整大小
   * @param event 操作对象
   */
  public resizableListener(event: any) {
    if (detectionModalLoad("resizableListener", event.target, arguments)) return;
    // console.log(event);
    switch (event.eventType) {
      case "resize":
        this.updateResize(event);
        break;
      case "resizeGroup":
        this.updateResizeGroup(event);
        break;
    }
  }

  /**
   * 调整单组件大小
   * @param event 操作对象
   */
  private updateResize(event: any) {
    const { target, width, height } = event;
    if (detectionModalLoad("updateResize", target, arguments)) return;
    const beforeTranslate = event.drag.beforeTranslate;
    const x = Number(beforeTranslate[0].toFixed(3));
    const y = Number(beforeTranslate[1].toFixed(3));
    this.handleTransform(x, y, width, height, target, false);
  }

  /**
   * 调整多组件大小
   * @param event 操作对象
   */
  private updateResizeGroup(event: any) {
    if (detectionModalLoad("updateResizeGroup", event.target, arguments)) return;
    event.events.forEach((ev: any, i: number) => {
      const { target, width, height } = event;
      const beforeTranslate = ev.drag.beforeTranslate;
      const x = Number(beforeTranslate[0].toFixed(3));
      const y = Number(beforeTranslate[1].toFixed(3));
      this.handleTransform(x, y, width, height, target, false);
    });
  }

  /**
   * 处理变换操作
   * @param x
   * @param y
   * @param width
   * @param height
   * @param target
   * @param isPosition
   */
  public handleTransform(
    x: number,
    y: number,
    width: number,
    height: number,
    target: HTMLElement,
    isPosition: boolean
  ) {
    const parentElement = target.assignedSlot || target.parentElement;
    if (!parentElement) return;
    target.style.left.indexOf("px") !== -1
      ? (target.style.left = x + "px")
      : (target.style.left = ((x / parentElement.offsetWidth) * 100).toFixed(3) + "%");
    target.style.top.indexOf("px") !== -1
      ? (target.style.top = y + "px")
      : (target.style.top = ((y / parentElement.offsetHeight) * 100).toFixed(3) + "%");
    if (isPosition) return;
    target.style.width.indexOf("px") !== -1
      ? (target.style.width = width + "px")
      : (target.style.width = ((width / parentElement.offsetWidth) * 100).toFixed(3) + "%");
    target.style.height.indexOf("px") !== -1
      ? (target.style.height = height + "px")
      : (target.style.height = ((height / parentElement.offsetHeight) * 100).toFixed(3) + "%");
  }

  /**
   * 点击拖拽对象
   * @param event 点击对象
   * @param type 是哪个moveable实例(moveableTop/moveableBottom)
   */
  public clickMoveable(event: any, type: string) {
    if (detectionModalLoad("clickMoveable", event.target, arguments)) return;
    const id = event.target.componentModel?.model.id;
    if (id) {
      changePluginSource();
    }
  }

  /**
   * 点击拖拽组
   * @param event 点击对象
   * @param type 是哪个moveable实例(moveableTop/moveableBottom)
   */
  public async clickMoveableGroup(event: any, type: string) {
    if (detectionModalLoad("clickMoveableGroup", event.target, arguments)) return;
    let element = null;
    if (event.inputTarget.classList.contains("draggable2")) {
      element = event.inputTarget;
    } else {
      element = $(event.inputTarget).parents(".draggable2")[0];
    }
    if (!element) {
      // 如果点击组时点到了画布，就和点击画布做相同操作
      event.target = event.inputTarget;
      onClickNode(event);
      return;
    }
    const id = element.id;
    if (useAppStore.isCtrlKey) {
      // 添加选中组件数据
      const selectedKeys = cloneDeep(useSettingStore.selectedKeys);
      if (!useAppStore.pageModel?.checkFocus(id)) {
        await useAppStore.pageModel?.addSelected([id]);
        // 添加图层面板选中项
        selectedKeys.push(id);
      } else {
        useAppStore.pageModel?.removeSelected([id]);
        // 去除图层面板选中项
        const index = selectedKeys.findIndex((item: string) => item === id);
        index !== -1 ? selectedKeys.splice(index, 1) : void 0;
        if (selectedKeys.length === 1) {
          // 更新设置器
          changeSetter(useAppStore.pageModel?.currentComponent, [
            ChangeSetterEnum.ATTRIBUTE,
            ChangeSetterEnum.STYLE,
            ChangeSetterEnum.EVENT,
          ]);
        }
      }
      useSettingStore.setSelectedKeys(selectedKeys);
      // 设置被选中组件和可被吸附的组件
      this.setElementGuidelines();
    } else {
      useAppStore.pageModel?.clearSelected();
      await useAppStore.pageModel?.addSelected([id]);
      // 更新图层面板选中项
      useSettingStore.setSelectedKeys([id]);
      // 更新设置器
      changeSetter(useAppStore.pageModel?.currentComponent, [
        ChangeSetterEnum.ATTRIBUTE,
        ChangeSetterEnum.STYLE,
        ChangeSetterEnum.EVENT,
      ]);
      // 设置被选中组件
      type === AttributeEnum.MOVEABLE_TOP ? this.setTopTarget(element) : this.setBottomTarget(element);
      // 更新阻止冒泡状态
      this.toolsState.stopPropagation = true;
    }
  }

  /*
   * 设置被选中组件和可被吸附的组件
   */
  public setElementGuidelines() {
    if (!(this as any).moveableTop || !(this as any).moveableBottom) return;
    const topTargets: HTMLElement[] = [];
    const bottomTargets: HTMLElement[] = [];
    const topArr: HTMLElement[] = Array.from(document.querySelectorAll(`#${CanvasIdEnum.INNER} .draggable2`));
    const bottomArr: HTMLElement[] = Array.from(document.querySelectorAll(`#${CanvasIdEnum.BOTTOM} .draggable2`));
    useAppStore.pageModel?.selectedComponents.forEach((component: ISchema) => {
      switch (checkComponentRoot(component.id)) {
        case CanvasIdEnum.INNER:
          topTargets.push(document.querySelector(`#${component.id}`) as HTMLElement);
          break;
        case CanvasIdEnum.BOTTOM:
          bottomTargets.push(document.querySelector(`#${component.id}`) as HTMLElement);
          break;
      }
    });
    topTargets.length === 0
      ? ((this as any).moveableTop.target = null)
      : topTargets.length === 1
      ? ((this as any).moveableTop.target = topTargets[0])
      : ((this as any).moveableTop.target = topTargets);
    (this as any).moveableTop.elementGuidelines = topArr;
    bottomTargets.length === 0
      ? ((this as any).moveableBottom.target = null)
      : bottomTargets.length === 1
      ? ((this as any).moveableBottom.target = bottomTargets[0])
      : ((this as any).moveableBottom.target = bottomTargets);
    (this as any).moveableBottom.elementGuidelines = bottomArr;
  }

  /**
   * 对拖拽操作进行前置条件校验
   * @param event 操作对象
   * @param type one/group
   */
  public checkMoveTarget(event: any, type: string) {
    if (detectionModalLoad("checkMoveTarget", event.target, arguments)) return;
    if (useAppStore.isSpaceKey) return false;
    switch (type) {
      case AttributeEnum.ONE:
        const target = event.target;
        // 组件被锁定，无法拖拽
        if (target.locking && target.locking.moveable) {
          return false;
        }
        break;
      case AttributeEnum.GROUP:
        const targets = event.targets;
        let differentLevels = false;
        let groupLocking = false;
        targets.forEach((component: any) => {
          if (
            component.parentElement !== targets[0].parentElement ||
            component.assignedSlot !== targets[0].assignedSlot
          )
            differentLevels = true;
          if (component.locking && component.locking.moveable) groupLocking = true;
        });
        if (differentLevels) {
          message.destroy();
          message.warning("所选组件来自不同层级，多组件操作已禁用！");
          return false;
        }
        if (groupLocking) {
          message.destroy();
          message.warning("所选组件包含被锁定组件，多组件操作已禁用！");
          return false;
        }
        break;
    }
    return true;
  }

  /**
   * 对调整大小操作进行前置条件校验
   * @param event 操作对象
   * @param type one/group
   */
  public checkResizeTarget(event: any, type: string) {
    if (detectionModalLoad("checkResizeTarget", event.target, arguments)) return;
    if (useAppStore.isSpaceKey) return false;
    switch (type) {
      case AttributeEnum.ONE:
        // 判断组件是否被锁定，锁定后禁止操作
        const target = event.target;
        // 组件被锁定，无法拖拽
        if (target.locking && target.locking.moveable) {
          return false;
        }
        // 手动初始化target矩阵信息，用于手动处理非画布组件边界限制
        // const targetRoot = $(event.target).data("data").targetRoot;
        // const targetRect = targetRoot === "#inner-dropzone" ? moveableTop.getRect() : moveableBottom.getRect();
        // const { left, top } = $(event.target).position();
        // targetRect.pos1 = [left, top];
        // targetRect.pos2 = [left + targetRect.width, top];
        // targetRect.pos3 = [left, top + targetRect.height];
        // targetRect.pos4 = [left + targetRect.width, top + targetRect.height];
        // targetResizeRect = targetRect;
        break;
      case AttributeEnum.GROUP:
        const targets = event.targets;
        let differentLevels = false;
        let groupLocking = false;
        targets.forEach((component: any) => {
          if (
            component.parentElement !== targets[0].parentElement ||
            component.assignedSlot !== targets[0].assignedSlot
          )
            differentLevels = true;
          if (component.locking && String(component.locking) === "true") groupLocking = true;
        });
        if (differentLevels) {
          message.destroy();
          message.warning("所选组件来自不同层级，多组件操作已禁用！");
          return false;
        }
        if (groupLocking) {
          message.destroy();
          message.warning("所选组件包含被锁定组件，多组件操作已禁用！");
          return false;
        }
        // 手动初始化多组件辅助框矩阵信息，用于手动处理非画布组件边界限制
        // const targestRoot = $(event.targets[0]).data("data").targetRoot;
        // const targetsRect = targestRoot === "#inner-dropzone" ? moveableTop.getRect() : moveableBottom.getRect();
        // let xArr = [];
        // let yArr = [];
        // event.targets.forEach((target, i) => {
        //   xArr.push($(target).position().left);
        //   yArr.push($(target).position().top);
        // });
        // const minX = Math.min(...xArr);
        // const minY = Math.min(...yArr);
        // targetsRect.pos1 = [minX, minY];
        // targetsRect.pos2 = [minX + targetsRect.width, minY];
        // targetsRect.pos3 = [minX, minY + targetsRect.height];
        // targetsRect.pos4 = [minX + targetsRect.width, minY + targetsRect.height];
        // targetResizeRect = targetsRect;
        break;
    }
    return true;
  }

  /*
   * 有组件通过非直接操作更变大小和位置时，更新辅助矩阵
   */
  public updateMoveable() {
    const length = useAppStore.pageModel?.selectedComponents.length;
    if (!length) return;
    if (length === 1) {
      // 更新单组件moveable组件矩阵
      (this as any).moveableTop.updateTarget();
      (this as any).moveableBottom.updateTarget();
    } else {
      // 更新多组件moveable组件矩阵
      (this as any).moveableTop.updateRect();
      (this as any).moveableBottom.updateRect();
    }
  }
}
