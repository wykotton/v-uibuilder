import { useAppStoreWithOut } from "@/store/modules/app";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { useChangeInitStyle } from "@/composition/index";
import { recordSnapshot } from "@/composition/index";
import { CanvasIdEnum } from "@/enums/appEnum";

// pinia
const useAppStore = useAppStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

export enum AttributeEnum {
  MOVEABLE_TOP = "moveableTop",
  MOVEABLE_BOTTOM = "moveableBottom",
  ONE = "one",
  GROUP = "group",
  LEFT = "left",
  TOP = "top",
  WIDTH = "width",
  HEIGHT = "height",
}

export class MoveableParams {
  public toolsState = {
    disabledMove: false,
    stopPropagation: false,
  };

  public topParam = {
    rootName: AttributeEnum.MOVEABLE_TOP, // // 需要创建movable实例的变量名，这是主画布
    rootNode: document.querySelector(`#${CanvasIdEnum.INNER}`), // 需要创建movable实例的根节点
    target: null,
    snappable: true,
    snapContainer: document.querySelector(`#${CanvasIdEnum.INNER}`),
    bounds: { left: 0, top: 0, right: useAppStore.canvasStyleData.width, bottom: useAppStore.canvasStyleData.height },
    draggable: true,
    resizable: true,
    throttleDrag: 1,
    throttleResize: 1,
    startDragRotate: 0,
    throttleDragRotate: 0,
    zoom: 1,
    origin: false,
    stopPropagation: true,
    preventClickDefault: false,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
    elementGuidelines: [],
    snapGap: true,
    // Events
    dragStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkMoveTarget(e, AttributeEnum.ONE)) {
        e.stop();
        return;
      }
      e.set((this as any).getStartCoordinate(e, AttributeEnum.ONE));
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableTopRect = (this as any).moveableTop.getRect();
    },
    drag: (e: any) => {
      (this as any).dragMoveListener(e);
    },
    dragEnd: () => {
      if (!(this as any).moveableTopRect) return;
      const targetRect = (this as any).moveableTop.getRect();
      // 拖拽前后矩阵信息比对，未改变位置则不做后续操作
      if (
        (this as any).moveableTopRect.left !== targetRect.left ||
        (this as any).moveableTopRect.top !== targetRect.top
      ) {
        // 更新组件initStyle和样式设置器
        useChangeInitStyle((this as any).moveableTop.target, [AttributeEnum.LEFT, AttributeEnum.TOP], true);
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableTopRect = null;
      // 拖拽完阻止冒泡到画布
      this.toolsState.stopPropagation = true;
    },
    dragGroupStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      this.toolsState.disabledMove = !e.inputEvent.ctrlKey && (this as any).checkMoveTarget(e, AttributeEnum.GROUP);
      const coordinateArr = (this as any).getStartCoordinate(e, AttributeEnum.GROUP);
      e.events.forEach((ev: any, i: number) => {
        ev.set(coordinateArr[i]);
      });
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableTopRect = (this as any).moveableTop.getRect();
    },
    dragGroup: (e: any) => {
      if (e.inputEvent.ctrlKey || !this.toolsState.disabledMove) return;
      (this as any).dragMoveListener(e);
    },
    dragGroupEnd: (e: any) => {
      if (!(this as any).moveableTopRect) return;
      const targetRect = (this as any).moveableTop.getRect();
      // 拖拽前后矩阵信息比对，未改变位置则不做后续操作
      if (
        (this as any).moveableTopRect.left !== targetRect.left ||
        (this as any).moveableTopRect.top !== targetRect.top
      ) {
        if (e.targets) {
          e.targets.forEach((element: any) => {
            // 更新组件initStyle
            useChangeInitStyle(element, [AttributeEnum.LEFT, AttributeEnum.TOP], false);
          });
        }
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableTopRect = null;
    },
    resizeStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkResizeTarget(e, AttributeEnum.ONE)) {
        e.inputEvent.preventDefault();
        e.inputEvent.stopPropagation();
        e.stop();
        return;
      }
      e.dragStart && e.dragStart.set((this as any).getStartCoordinate(e, AttributeEnum.ONE));
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableTopRect = (this as any).moveableTop.getRect();
    },
    resize: (e: any) => {
      (this as any).resizableListener(e);
    },
    resizeEnd: () => {
      if (!(this as any).moveableTopRect) return;
      const targetRect = (this as any).moveableTop.getRect();
      // 拖拽前后矩阵信息比对，未改变宽高则不做后续操作
      if (
        (this as any).moveableTopRect.width !== targetRect.width ||
        (this as any).moveableTopRect.height !== targetRect.height
      ) {
        // 更新组件initStyle和样式设置器
        useChangeInitStyle(
          (this as any).moveableTop.target,
          [AttributeEnum.LEFT, AttributeEnum.TOP, AttributeEnum.WIDTH, AttributeEnum.HEIGHT],
          true
        );
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableTopRect = null;
    },
    resizeGroupStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkResizeTarget(e, AttributeEnum.GROUP)) {
        e.stop();
        return;
      }
      const coordinateArr = (this as any).getStartCoordinate(e, AttributeEnum.GROUP);
      e.events.forEach((ev: any, i: number) => {
        ev.dragStart && ev.dragStart.set(coordinateArr[i]);
      });
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableTopRect = (this as any).moveableTop.getRect();
    },
    resizeGroup: (e: any) => {
      (this as any).resizableListener(e);
    },
    resizeGroupEnd: (e: any) => {
      if (!(this as any).moveableTopRect) return;
      const targetRect = (this as any).moveableTop.getRect();
      // 拖拽前后矩阵信息比对，未改变宽高则不做后续操作
      if (
        (this as any).moveableTopRect.width !== targetRect.width ||
        (this as any).moveableTopRect.height !== targetRect.height
      ) {
        if (e.targets) {
          e.targets.forEach((element: any) => {
            // 更新组件initStyle
            useChangeInitStyle(
              element,
              [AttributeEnum.LEFT, AttributeEnum.TOP, AttributeEnum.WIDTH, AttributeEnum.HEIGHT],
              false
            );
          });
        }
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableTopRect = null;
    },
    click: (e: any) => {
      (this as any).clickMoveable(e, AttributeEnum.MOVEABLE_TOP);
    },
    clickGroup: (e: any) => {
      (this as any).clickMoveableGroup(e, AttributeEnum.MOVEABLE_TOP);
    },
  };

  public bottomParam = {
    rootName: AttributeEnum.MOVEABLE_BOTTOM, // // 需要创建movable实例的变量名，这是底部画布
    rootNode: document.querySelector(`#${CanvasIdEnum.BOTTOM}`), // 需要创建movable实例的根节点
    target: null,
    snappable: true,
    snapContainer: document.querySelector(`#${CanvasIdEnum.BOTTOM}`),
    bounds: { left: 0, top: 0, right: useAppStore.canvasStyleData.width, bottom: useAppStore.canvasStyleData.height },
    draggable: true,
    resizable: true,
    throttleDrag: 1,
    throttleResize: 1,
    startDragRotate: 0,
    throttleDragRotate: 0,
    zoom: 1,
    origin: false,
    stopPropagation: true,
    preventClickDefault: false,
    padding: { left: 0, top: 0, right: 0, bottom: 0 },
    elementGuidelines: [],
    snapGap: true,
    // Events
    dragStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkMoveTarget(e, AttributeEnum.ONE)) {
        e.stop();
        return;
      }
      e.set((this as any).getStartCoordinate(e, AttributeEnum.ONE));
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableBottomRect = (this as any).moveableBottom.getRect();
    },
    drag: (e: any) => {
      (this as any).dragMoveListener(e);
    },
    dragEnd: () => {
      if (!(this as any).moveableBottomRect) return;
      const targetRect = (this as any).moveableBottom.getRect();
      // 拖拽前后矩阵信息比对，未改变位置则不做后续操作
      if (
        (this as any).moveableBottomRect.left !== targetRect.left ||
        (this as any).moveableBottomRect.top !== targetRect.top
      ) {
        // 更新组件initStyle和样式设置器
        useChangeInitStyle((this as any).moveableBottom.target, [AttributeEnum.LEFT, AttributeEnum.TOP], true);
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableBottomRect = null;
      // 拖拽完阻止冒泡到画布
      this.toolsState.stopPropagation = true;
    },
    dragGroupStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      this.toolsState.disabledMove = !e.inputEvent.ctrlKey && (this as any).checkMoveTarget(e, AttributeEnum.GROUP);
      const coordinateArr = (this as any).getStartCoordinate(e, AttributeEnum.GROUP);
      e.events.forEach((ev: any, i: number) => {
        ev.set(coordinateArr[i]);
      });
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableBottomRect = (this as any).moveableBottom.getRect();
    },
    dragGroup: (e: any) => {
      if (e.inputEvent.ctrlKey || !this.toolsState.disabledMove) return;
      (this as any).dragMoveListener(e);
    },
    dragGroupEnd: (e: any) => {
      if (!(this as any).moveableBottomRect) return;
      const targetRect = (this as any).moveableBottom.getRect();
      // 拖拽前后矩阵信息比对，未改变位置则不做后续操作
      if (
        (this as any).moveableBottomRect.left !== targetRect.left ||
        (this as any).moveableBottomRect.top !== targetRect.top
      ) {
        if (e.targets) {
          e.targets.forEach((element: any) => {
            // 更新组件initStyle
            useChangeInitStyle(element, [AttributeEnum.LEFT, AttributeEnum.TOP], false);
          });
        }
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableBottomRect = null;
    },
    resizeStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkResizeTarget(e, AttributeEnum.ONE)) {
        e.inputEvent.preventDefault();
        e.inputEvent.stopPropagation();
        e.stop();
        return;
      }
      e.dragStart && e.dragStart.set((this as any).getStartCoordinate(e, AttributeEnum.ONE));
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableBottomRect = (this as any).moveableBottom.getRect();
    },
    resize: (e: any) => {
      (this as any).resizableListener(e);
    },
    resizeEnd: () => {
      if (!(this as any).moveableBottomRect) return;
      const targetRect = (this as any).moveableBottom.getRect();
      // 拖拽前后矩阵信息比对，未改变宽高则不做后续操作
      if (
        (this as any).moveableBottomRect.width !== targetRect.width ||
        (this as any).moveableBottomRect.height !== targetRect.height
      ) {
        // 更新组件initStyle和样式设置器
        useChangeInitStyle(
          (this as any).moveableBottom.target,
          [AttributeEnum.LEFT, AttributeEnum.TOP, AttributeEnum.WIDTH, AttributeEnum.HEIGHT],
          true
        );
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableBottomRect = null;
    },
    resizeGroupStart: (e: any) => {
      usePluginStore.closeFixedMenu();
      if (!(this as any).checkResizeTarget(e, AttributeEnum.GROUP)) {
        e.stop();
        return;
      }
      const coordinateArr = (this as any).getStartCoordinate(e, AttributeEnum.GROUP);
      e.events.forEach((ev: any, i: number) => {
        ev.dragStart && ev.dragStart.set(coordinateArr[i]);
      });
      // 获取拖拽前的矩阵信息，用于拖拽后比对位置
      (this as any).moveableBottomRect = (this as any).moveableBottom.getRect();
    },
    resizeGroup: (e: any) => {
      (this as any).resizableListener(e);
    },
    resizeGroupEnd: (e: any) => {
      if (!(this as any).moveableBottomRect) return;
      const targetRect = (this as any).moveableBottom.getRect();
      // 拖拽前后矩阵信息比对，未改变宽高则不做后续操作
      if (
        (this as any).moveableBottomRect.width !== targetRect.width ||
        (this as any).moveableBottomRect.height !== targetRect.height
      ) {
        if (e.targets) {
          e.targets.forEach((element: any) => {
            // 更新组件initStyle
            useChangeInitStyle(
              element,
              [AttributeEnum.LEFT, AttributeEnum.TOP, AttributeEnum.WIDTH, AttributeEnum.HEIGHT],
              false
            );
          });
        }
        // 添加快照
        recordSnapshot();
      }
      (this as any).moveableBottomRect = null;
    },
    click: (e: any) => {
      (this as any).clickMoveable(e, AttributeEnum.MOVEABLE_BOTTOM);
    },
    clickGroup: (e: any) => {
      (this as any).clickMoveableGroup(e, AttributeEnum.MOVEABLE_BOTTOM);
    },
  };
}
