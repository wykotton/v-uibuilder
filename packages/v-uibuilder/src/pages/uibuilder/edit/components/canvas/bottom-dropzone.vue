<template>
  <div class="bottom-container">
    <a-tabs type="card" :activeKey="useAppStore.bottomContentTab" @change="changeTabs">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <windows-outlined />
            平台服务组件
          </span>
        </template>
        <div class="auto-size-bottomcontent">
          <a-spin :spinning="spinning" size="large">
            <Contextmenu :canvasDropzone="bottomDropzone">
              <div
                ref="bottomDropzone"
                id="bottomcontent"
                class="dropzone"
                draggable="false"
                :style="{
                  height: `${useAppStore.canvasStyleData.height}px`,
                  width: `${useAppStore.canvasStyleData.width}px`,
                }"
                @click="onClickNode"
              ></div>
            </Contextmenu>
          </a-spin>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" v-if="useAppStore.editType === EditTypeEnum.PAGE">
        <template #tab>
          <span>
            <apartment-outlined />
            项目页面关系
          </span>
        </template>
        <ItemPageRelationship />
      </a-tab-pane>
      <a-tab-pane key="3" v-if="useAppStore.editType === EditTypeEnum.PAGE">
        <template #tab>
          <span>
            <branches-outlined />
            页面路由关系
          </span>
        </template>
        <PageRoutingRelationship />
      </a-tab-pane>
      <a-tab-pane key="4" v-if="useAppStore.editType === EditTypeEnum.PAGE">
        <template #tab>
          <span>
            <node-index-outlined />
            元件属性关系
          </span>
        </template>
        <ComponentAttributeRelationship />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script setup lang="ts">
import { onClickNode } from "@/composition/index";
import { useAppStoreWithOut } from "@/store/modules/app";
import { dragDrop, DragDropEventEnum } from "@/utils/dragdrop/index";
import { WindowsOutlined, ApartmentOutlined, BranchesOutlined, NodeIndexOutlined } from "@ant-design/icons-vue";
import { EditTypeEnum } from "@/enums/appEnum";
import ItemPageRelationship from "./plugin/item-page-relationship.vue";
import PageRoutingRelationship from "./plugin/page-routing-relationship.vue";
import ComponentAttributeRelationship from "./plugin/component-attribute-relationship.vue";
import Contextmenu from "../contextmenu.vue";
import "@/utils/font/iconfont";

// pinia
const useAppStore = useAppStoreWithOut();

// 辅助画布实例
const bottomDropzone = ref(null);
const spinning = ref(false);
const domRef = () => bottomDropzone.value;
defineExpose({ domRef });

onMounted(() => {
  if (bottomDropzone.value) {
    dragDrop.dropStart(bottomDropzone.value);

    dragDrop.on(DragDropEventEnum.DROPSTART, () => {
      spinning.value = true;
    });
    dragDrop.on(DragDropEventEnum.DROPEND, () => {
      spinning.value = false;
    });
  }
});

function changeTabs(activeKey: string) {
  useAppStore.setBottomContentTab(activeKey);
}
</script>
<style lang="scss" scoped>
// 底部画布
.bottom-container {
  width: 100%;
  height: 100%;
  overflow: auto;

  .ant-tabs {
    width: 100%;
    height: 100%;

    ::v-deep(.ant-tabs-content) {
      width: 100%;
      height: 100%;
    }
  }
}

.auto-size-bottomcontent {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  #bottomcontent {
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    z-index: 1;
    background: #fff;
    position: relative;

    &::after {
      content: " ";
      flex: auto;
    }
  }

  /**自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }

  &::-webkit-scrollbar-thumb {
    -webkit-border-radius: 2em;
    -moz-border-radius: 2em;
    border-radius: 2em;
  }
}
</style>
