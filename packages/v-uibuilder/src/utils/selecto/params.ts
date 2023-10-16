import { changeSetter, checkComponentRoot } from "@/composition/index";
import { CanvasIdEnum } from "@/enums/appEnum";
import { ChangeSetterEnum } from "@/enums/settingEnum";
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

export class SelectoParams {
  public topParam = {
    rootName: "selectoTop", // // 需要创建selecto实例的变量名，这是主画布
    container: document.querySelector(`#${CanvasIdEnum.INNER}`),
    rootContainer: document.querySelector(`#${CanvasIdEnum.INNER}`),
    dragContainer: document.querySelector(`#${CanvasIdEnum.INNER}`),
    selectableTargets: [".draggable2"],
    selectFromInside: true,
    dragCondition: () => useAppStore.isShiftKey,
    preventDefault: true,
    preventClickEventOnDrag: true,
    preventClickEventOnDragStart: true,
    hitRate: 30,
    dragStart: (e: any) => {
      if (!e.inputEvent.shiftKey) {
        e.stop();
        return;
      }
      clearData();
    },
    selectEnd: (e: any) => {
      if (e?.selected.length) {
        handleSelected(e, CanvasIdEnum.INNER);
      }
    },
  };

  public bottomParam = {
    rootName: "selectoBottom", // // 需要创建selecto实例的变量名，这是底部画布
    container: document.querySelector(`#${CanvasIdEnum.BOTTOM}`),
    rootContainer: document.querySelector(`#${CanvasIdEnum.BOTTOM}`),
    dragContainer: document.querySelector(`#${CanvasIdEnum.BOTTOM}`),
    selectableTargets: [".draggable2"],
    selectFromInside: true,
    dragCondition: () => useAppStore.isShiftKey,
    preventDefault: true,
    preventClickEventOnDrag: true,
    preventClickEventOnDragStart: true,
    hitRate: 30,
    dragStart: (e: any) => {
      if (!e.inputEvent.shiftKey) {
        e.stop();
        return;
      }
      clearData();
    },
    selectEnd: (e: any) => {
      if (e?.selected.length) {
        handleSelected(e, CanvasIdEnum.BOTTOM);
      }
    },
  };
}

/**
 * 清空选中组件、moveable、图层面板
 */
function clearData() {
  useAppStore.pageModel?.clearSelected();
  useSettingStore.setSelectedKeys([]);
  useSettingStore.moveableExample.clearAllTarget();
}

/**
 * 处理是否从内|部选择
 * @param e
 */
function selectFromInside(e: any, type: string) {
  const selectedKeys: string[] = [];
  if (e.currentTarget?.selectFromInside) {
    const ids = e.selected.map((element: HTMLElement) => element.id);
    // 去除错误数据
    ids.forEach((id: string) => {
      if (type === checkComponentRoot(id)) {
        selectedKeys.push(id);
      }
    });
  } else {
    const targetId = e.inputEvent?.target.id;
    if (!targetId || targetId !== type) return selectedKeys;
    e.selected.forEach((element: HTMLElement) => {
      if (element?.parentElement?.id === type) {
        selectedKeys.push(element.id);
      }
    });
  }
  return selectedKeys;
}

/**
 * 处理已选组件
 * @param components
 */
async function handleSelected(e: any, type: string) {
  const selectedKeys = selectFromInside(e, type);
  if (!selectedKeys.length) return;
  // 更新pageModel
  await useAppStore.pageModel?.addSelected(selectedKeys);
  // 更新图层面板选中项
  useSettingStore.setSelectedKeys(selectedKeys);
  // 异步操作防止selectedKeys更新监听被同步覆盖
  setTimeout(() => {
    if (selectedKeys.length === 1) {
      // 更新设置器
      changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.ALL]);
    } else {
      // 多选时，不更新设置器，只更新moveable实例
      changeSetter(useAppStore.pageModel?.currentComponent, [ChangeSetterEnum.MOVEABLE]);
    }
  }, 0);
}
