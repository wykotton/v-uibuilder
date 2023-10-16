import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { getTrees, getTreeData } from "./tree";
import { ISchema } from "@/types/IModelSchema";
import { recordSnapshot } from "./header";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

/**
 * 删除组件
 */
export async function deleteEvent() {
  if (!useAppStore?.pageModel.selectedComponents.length || useAppStore.isFocus) return;
  const deleteComponent = (tree: any[]) => {
    tree.forEach((item: any) => {
      useAppStore?.pageModel.delete(item.key);
      if (item?.children.length) {
        deleteComponent(item.children);
      }
    });
  };
  // 递归删除所有子组件数据
  useAppStore?.pageModel.selectedComponents.forEach((component: ISchema) => {
    const element = document.querySelector(`#${component.id}`) as HTMLElement;
    const elementTree = [{ key: component.id, children: getTreeData(element) }];
    deleteComponent(elementTree);
  });
  // 清除选中组件
  useAppStore?.pageModel.clearSelected();
  // 更新moveable实例
  useSettingStore.moveableExample.setElementGuidelines();
  // 更新图层面板
  useSettingStore.setTreeData(getTrees());
  useSettingStore.setSelectedKeys([]);
  // 添加快照
  recordSnapshot();
}
