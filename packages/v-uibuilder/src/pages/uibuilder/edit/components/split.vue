<template>
  <!-- class="default-theme" -->
  <div id="myApp">
    <div class="headers">
      <slot name="headerPanel"></slot>
    </div>
    <div class="content-body">
      <div class="left-menu" :style="{ width: usePluginStore.drawerState ? '404px' : '54px' }">
        <slot name="leftPanel"></slot>
      </div>
      <div class="content" :style="{ width: usePluginStore.drawerState ? 'calc(100% - 404px)' : 'calc(100% - 54px)' }">
        <Splitpanes class="default-theme" :dblClickSplitter="false">
          <Pane>
            <Splitpanes :dblClickSplitter="false" @resized="middleResized">
              <Pane :size="useAppStore.layoutData.middleWidth">
                <Splitpanes horizontal :dblClickSplitter="false" @resized="canvasResized">
                  <Pane :size="useAppStore.layoutData.middleTopHeight" :dblClickSplitter="false">
                    <slot name="topPanel"></slot>
                  </Pane>
                  <Pane :size="useAppStore.layoutData.middleBottomHeight" max-size="90">
                    <slot name="bottomPanel"></slot>
                  </Pane>
                </Splitpanes>
              </Pane>
              <Pane :size="useAppStore.layoutData.rightWidth" max-size="30">
                <slot name="rightPanel"></slot>
              </Pane>
            </Splitpanes>
          </Pane>
        </Splitpanes>
      </div>
    </div>
    <div v-show="zoomVisible" class="zoom-progress" :style="{ opacity: zoomOpacity, top: zoomTop }">
      <a-progress type="circle" :percent="percent" :format="percentFormat" :width="70" :strokeWidth="10" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app";
import { usePluginStoreWithOut } from "@/store/modules/plugin";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

// pinia
const useAppStore = useAppStoreWithOut();
const usePluginStore = usePluginStoreWithOut();

/**
 * 调整画布和设置区窗格
 * @param e
 */
function middleResized(e: any) {
  const middleWidth = e[0].size;
  const rightWidth = e[1].size;
  useAppStore.setLayout({ middleWidth, rightWidth });
}

/**
 * 调整上下画布窗格
 * @param e
 */
function canvasResized(e: any) {
  const middleTopHeight = e[0].size;
  const middleBottomHeight = e[1].size;
  useAppStore.setLayout({ middleTopHeight, middleBottomHeight });
}

/**
 * 展示主画布缩放状态进度条
 */
const zoomVisible = ref(false);
const percent = ref(0);
const zoomOpacity = ref("0");
const zoomTop = ref("20px");
let setTransition: any = null;
let closeZoom: any = null;
watch(
  () => useAppStore.scaleNum,
  (newValue) => {
    clearTimeout(setTransition);
    clearTimeout(closeZoom);
    percent.value = Number((((Number(newValue) - 0.5) / 1.5) * 100).toFixed(0));
    zoomVisible.value = true;
    setTimeout(() => {
      zoomOpacity.value = "1";
      zoomTop.value = "48px";
    }, 0);
    setTransition = setTimeout(() => {
      zoomOpacity.value = "0";
      zoomTop.value = "20px";
      closeZoom = setTimeout(() => {
        zoomVisible.value = false;
      }, 300);
    }, 2000);
  }
);
function percentFormat() {
  return `${(useAppStore.scaleNum * 100).toFixed(0)}%`;
}
</script>
<style scoped lang="scss">
#myApp {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;

  .headers {
    width: 100%;
    height: var(--header-height);
    box-shadow: 0 4px 3px 0 rgb(36 41 46 / 25%);
    z-index: 999;
    position: relative;
    background-color: var(--theme-color);
  }

  .content-body {
    width: 100%;
    height: calc(100% - 48px);
    display: flex;
    flex-direction: row;
    align-items: center;

    .left-menu {
      height: -webkit-fill-available;
      display: flex;
      flex-direction: row;
      position: relative;
      background-color: #fff;
      transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    }

    .content {
      flex: 1;
      height: -webkit-fill-available;
      background: #fff;
      display: flex;
      flex-direction: column;
      // border: 1px solid #ccc;
      border-radius: 2px;
      transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);

      /* 拖动容器宽 */
      .default-theme.splitpanes--vertical > .splitpanes__splitter,
      .default-theme .splitpanes--vertical > .splitpanes__splitter {
        width: 8px;
        background: #e3e7ed;
      }

      /* 拖动容器高 */
      .default-theme.splitpanes--horizontal > .splitpanes__splitter,
      .default-theme .splitpanes--horizontal > .splitpanes__splitter {
        height: 8px;
        background: #e3e7ed;
      }
    }
  }

  .zoom-progress {
    position: absolute;
    left: calc(50% - 40px);
    padding: 8px;
    z-index: 10000;
    transition: all 0.3s;
    background-color: #fff;
    border-radius: 25px;

    ::v-deep(.ant-progress-circle-trail) {
      stroke: #dadada;
    }
  }
}
</style>
