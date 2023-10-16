<template>
  <div ref="innerScroll" class="auto-size-inner-dropzone">
    <div
      class="ruler-content"
      :style="{
        height: `${useAppStore.canvasStyleData.height + 100}px`,
        width: `${useAppStore.canvasStyleData.width + 100}px`,
      }"
    >
      <div class="ruler box"></div>
      <div class="ruler horizontal" :style="{ width: `${useAppStore.canvasStyleData.width + 80}px` }"></div>
      <div class="ruler vertical" :style="{ height: `${useAppStore.canvasStyleData.height + 80}px` }"></div>
      <a-spin :spinning="spinning" size="large">
        <Contextmenu :canvasDropzone="innerDropzone">
          <div
            ref="innerDropzone"
            id="inner-dropzone"
            class="dropzone"
            :style="{
              height: `${useAppStore.canvasStyleData.height}px`,
              width: `${useAppStore.canvasStyleData.width}px`,
            }"
            @click="onClickNode"
          >
          </div>
        </Contextmenu>
      </a-spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStoreWithOut } from "@/store/modules/app";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { dragDrop, DragDropEventEnum } from "@/utils/dragdrop/index";
import { initGuides } from "@/utils/guides/example";
import { onClickNode, useDelegateButtonMov } from "@/composition/index";
import Contextmenu from "../contextmenu.vue";
import "@/utils/font/iconfont";

// pinia
const useAppStore = useAppStoreWithOut();
const useSettingStore = useSettingStoreWithOut();

// 画布实例
const innerDropzone = ref(null);
const innerScroll = ref(null);
const spinning = ref(false); 

const domRef = () => innerDropzone.value;

defineExpose({ domRef });

onMounted(() => {
  if (!innerDropzone.value || !innerScroll.value) return;
  const guides = initGuides();
  useSettingStore.setGuides(Object.preventExtensions(guides));
  dragDrop.dropStart(innerDropzone.value);

  dragDrop.on(DragDropEventEnum.DROPSTART, () => {
    spinning.value = true;
  });
  dragDrop.on(DragDropEventEnum.DROPEND, () => {
    spinning.value = false;
  });

  const { keyPressMove } = useDelegateButtonMov();
  // 主画布拖动
  keyPressMove({
    el: innerScroll.value as HTMLElement,
    key: " ",
    cursor: {
      default: "default",
      grab: "grab",
      grabbing: "grabbing",
    },
    isPreventDefault: true,
    handler(info) {
      console.log(info);
    },
  });
});
</script>
<style lang="scss" scoped>
// 主画布
.auto-size-inner-dropzone {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;

  &::-webkit-scrollbar {
    height: 8px !important;
    width: 8px !important;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 0 !important;
    border-style: dashed;
    background-color: rgb(156, 157, 160);
    border-color: transparent;
    // border-top-width: 6px;
    // border-left-width: 6px;
    // border-bottom-width: 0;
    // border-right-width: 0;
    background-clip: content-box;
    cursor: pointer;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--theme-color);
    border-radius: 6px !important;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .ruler-content {
    width: 100%;
    height: 100%;
    position: relative;
    .ruler {
      position: absolute;
      top: 0;
      left: 0;
    }

    .ruler.box {
      width: 20px;
      height: 20px;
      background: #9c9da0;
      box-sizing: border-box;
      z-index: 21;
    }

    .ruler.horizontal {
      left: 20px;
      height: 20px;
    }

    .ruler.vertical {
      top: 20px;
      width: 20px;
    }

    #inner-dropzone {
      position: absolute;
      left: 20px;
      top: 20px;
      overflow: hidden;
      background-image: repeating-linear-gradient(
          0deg,
          rgba(36, 41, 46, 0.25) 0px,

          rgba(36, 41, 46, 0.25) 0px,

          transparent 1px,

          transparent 16px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(36, 41, 46, 0.25) 0px,
          rgba(36, 41, 46, 0.25) 0px,
          transparent 1px,
          transparent 16px
        );
      content-visibility: auto;
      contain-intrinsic-size: 200px;
      background-color: var(--canvas-color);
    }

    .dropzone {
      // background-color: #fff;
      box-shadow: 0 2px 8px rgba(36, 41, 46, 0.25);
      transition: background-color 0.3s;
      flex: 1;
      overflow: hidden;
    }

    .ant-spin-nested-loading{
      height: 100%;
    }
  }
}
</style>
