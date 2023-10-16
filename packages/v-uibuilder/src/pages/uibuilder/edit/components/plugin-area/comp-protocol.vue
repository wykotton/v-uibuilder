<template>
  <a-spin :spinning="componentsLoading">
    <a-input-search
      @search="searchComponents"
      v-model:value="searchText"
      placeholder="输入组件名查询"
      class="w-full py-12px"
    ></a-input-search>
    <div ref="compRef">
      <a-button type="primary" @click="useGetComponent">刷新仓库</a-button>
      <a-divider type="vertical" />
      <a-button
        type="primary"
        class="mb-10px"
        @click="componentsAction(selectWarehouse, { type: ComponentProtocolEnum.IMPORT, body: pageModel })"
      >
        元件导入
      </a-button>
      <a-divider type="vertical" />
      <a-button
        type="primary"
        class="mb-10px"
        @click="componentsAction(selectWarehouse, { type: ComponentProtocolEnum.EXPORT, body: pageModel })"
      >
        元件导出
      </a-button>
      <a-button
        type="primary"
        class="mb-10px"
        @click="componentsAction(selectWarehouse, { type: ComponentProtocolEnum.DELETE, body: pageModel })"
      >
        元件删除
      </a-button>
      <a-divider type="vertical" />
      <a-select
        v-model:value="selectWarehouse"
        class="w-90px"
        placeholder="选择仓库"
        :options="useAppStore.getComponentWarehouse?.map(({ name }:IComponentWarehouse) => ({ value: name }))"
      ></a-select>
      <a-tabs v-model:activeKey="tabsActiveKey">
        <a-tab-pane v-for="(item, index) in group" :key="index" :tab="item">
          <a-collapse v-model:activeKey="activeKey[index]">
            <template v-for="(panel, pIndex) in componentSchema">
              <a-collapse-panel
                :header="panel[0]"
                :key="pIndex"
                v-if="panel[1].some((current: any) => current?.group?.includes(item))"
              >
                <ul class="com-menu-ul">
                  <template v-for="com in panel[1]">
                    <li
                      class="com-menu-li cursor-pointer"
                      draggable="true"
                      :key="com?.componentName"
                      :data-tag="com?.componentName"
                      :data-options="JSON.stringify(com || '{}')"
                      @mouseover="saveTagetComponent($event, com)"
                      v-if="com?.group?.includes(item)"
                    >
                      <div class="com-menu-item" :title="com.text">
                        <img class="h-32px w-32px" draggable="false" :src="com.image || emptyImage" alt="暂无略缩图" />
                        <span class="com-menu-name" v-html="com.highlights || com.text"></span>
                      </div>
                    </li>
                  </template>
                </ul>
              </a-collapse-panel>
            </template>
          </a-collapse>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { dragDrop } from "@/utils/dragdrop/index";
import { cloneDeep } from "lodash-es";
import { getComponents, componentsAction, dataSearch } from "@/composition/index";
import emptySvg from "@/assets/svg/empty-component.svg";
import { useAppStoreWithOut } from "@/store/modules/app";
import { IComponentWarehouse } from "@/types/IPageModel";
import { ComponentProtocolEnum } from "@/enums/appEnum";

// pinia
const useAppStore = useAppStoreWithOut();

const componentsLoading = ref(true);
const group = ref([]);
const activeKey = ref([[], [], []]);
const compRef = ref(null);
const componentSchema = ref();
const componentsList = ref<any>([]);
const tabsActiveKey = ref(0);
const emptyImage = ref(emptySvg);
const selectWarehouse = ref();
const pageModel = useAppStore.pageModel;

/**
 * 刷新元件仓库
 */
async function useGetComponent() {
  componentsAction(selectWarehouse.value, { type: ComponentProtocolEnum.REFRESH, body: pageModel });
  setTimeout(async () => {
    componentsList.value = getComponents();
    componentSchema.value = await transformSchema(componentsList.value);
  }, 100);
}
onMounted(() => {
  useGetComponent();
});

/**
 * 注册组件拖拽事件
 */
watchEffect(() => {
  if (!compRef.value) return;
  dragDrop.dragStart(compRef.value);
});

/**
 * 返回注册元件数据
 * @param components
 */
async function transformSchema(components: any[]) {
  const componentMap = new Map();
  componentsLoading.value = true;

  for await (const current of components) {
    const { type = "", group: tGroup = [] } = current;
    const modelGroup = tGroup;
    const modelType = type;

    Object.assign(group.value, [...new Set([...group.value, ...modelGroup])]);

    if (!modelType) {
      console.error(`组件类型不存在`);
      continue;
    }
    if (!componentMap.has(modelType)) {
      componentMap.set(modelType, []);
    }
    componentMap.get(modelType).push(cloneDeep(current));
  }
  componentsLoading.value = false;
  return componentMap;
}

/**
 * 查询元件
 */
const searchText = ref("");
async function searchComponents() {
  if (!searchText.value) {
    componentSchema.value = await transformSchema(componentsList.value);
    return;
  }
  const results = dataSearch(componentsList.value, searchText.value, "component");
  componentSchema.value = await transformSchema(results);
}

function saveTagetComponent(ev: MouseEvent, component: any) {
  if (!ev.target) return;
  Reflect.set(ev.target, "component", component);
}

/**
 * 监听自动刷新
 */
const autoRefresh = inject("autoRefresh");
watch([autoRefresh], () => {
  useGetComponent();
});
</script>
<style lang="scss" scoped>
.com-menu-ul {
  width: 100%;
  margin: 0;
}

.com-menu-li {
  width: 33.33%;
  max-width: 150px;
  height: 100px;
  position: relative;
  float: left;
  padding: 16px 8px;
  overflow: hidden;
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  transition: box-shadow 0.2s ease, -webkit-box-shadow 0.2s ease;
}
.com-menu-li:hover {
  -webkit-box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
  box-shadow: 0 6px 16px 0 rgb(0 0 0 / 15%);
  border-color: transparent;
}

.com-menu-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.com-menu-name {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  margin-top: auto;
}

::v-deep(.highlights-text) {
  color: #ff5134;
}

::v-deep(.ant-collapse-content-box) {
  padding: 0 !important;
}
::v-deep(.ant-collapse-content) {
  overflow: hidden;
}
</style>
