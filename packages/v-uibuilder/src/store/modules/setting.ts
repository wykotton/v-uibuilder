import { defineStore } from "pinia";
import { store } from "@/store";
import { BreadcrumbInfo } from "@/types/store";

export const useSettingStore = defineStore({
  id: "setting",
  state: (): any => ({
    // moveable实例
    moveableExample: null,
    // 画布slecto实例
    selectoExample: null,
    // 画布标尺实例
    guides: null,
    // 属性设置器实例
    attributeSetter: null,
    // 属性设置器变更
    setterChange: false,
    // 样式设置器实例
    styleSetter: null,
    // DOM事件设置器实例
    eventSetter: null,
    // 图层面板组件树
    treeData: [],
    expandedKeys: <string[]>[],
    selectedKeys: <string[]>[],
    checkedKeys: <string[]>[],
    autoExpandParent: true,
    // 是否是组合
    isCombination: false,
    // 组件名面包屑
    nameBreadcrumb: <BreadcrumbInfo[]>[],
    // 是否显示组件名面包屑
    showNameBreadcrumb: false,
    // 组件别名面包屑
    aliasNameBreadcrumb: <BreadcrumbInfo[]>[],
    // 是否显示组件别名面包屑
    showAliasNameBreadcrumb: true,
    // 元件右键菜单开启/关闭
    contextMenu: true,
  }),
  getters: {},
  actions: {
    setMoveableExample(example: any) {
      this.moveableExample = example;
    },
    setSelectoExample(example: any) {
      this.selectoExample = example;
    },
    setGuides(example: any) {
      this.guides = example;
    },
    setAttributeSetter(example: any) {
      this.attributeSetter = example;
    },
    setSetterChange(value: boolean) {
      this.setterChange = value;
    },
    setStyleSetter(example: any) {
      this.styleSetter = example;
    },
    setEventSetter(example: any) {
      this.eventSetter = example;
    },
    setTreeData(tree: Array<any>) {
      this.treeData = tree;
    },
    setExpandedKeys(keys: Array<string>) {
      this.expandedKeys = keys;
    },
    setSelectedKeys(keys: Array<string>) {
      this.selectedKeys = keys;
    },
    setCheckedKeys(keys: Array<string>) {
      this.checkedKeys = keys;
    },
    setAutoExpandParent(state: Boolean) {
      this.autoExpandParent = state;
    },
    setIsCombination(value: boolean) {
      this.isCombination = value;
    },
    setNameBreadcrumb(value: BreadcrumbInfo[]) {
      this.nameBreadcrumb = value;
    },
    setShowNameBreadcrumb(value: boolean) {
      this.showNameBreadcrumb = value;
    },
    setAliasNameBreadcrumb(value: BreadcrumbInfo[]) {
      this.aliasNameBreadcrumb = value;
    },
    setShowAliasNameBreadcrumb(value: boolean) {
      this.showAliasNameBreadcrumb = value;
    },
    setContextMenu(value: boolean) {
      this.contextMenu = value;
    },
  },
});

// Need to be used outside the setup
export function useSettingStoreWithOut() {
  return useSettingStore(store);
}
