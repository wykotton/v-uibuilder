<template>
  <div class="tree-node-modal">
    <div class="tree-node-modal-title">
      <span>模态视图层</span>
      <!-- <div class="tree-node-modal-title-visible-icon"><svg fill="currentColor" preserveAspectRatio="xMidYMid meet"
          width="16" height="16" viewBox="0 0 1024 1024">
          <path
            d="M512.7 700.9c-102.1 0-184.9-82.8-184.9-184.9 0-28.6 6.5-55.6 18-79.7l-93.7-93.7C138.9 418.1 65.2 514 65.2 514s200.4 260.7 447.6 260.7c50.2 0 98.6-10.8 143.6-27.9l-63.9-63.9c-24.2 11.5-51.2 18-79.8 18z">
          </path>
          <path
            d="M960.3 514S759.9 253.3 512.7 253.3c-49.5 0-97.2 10.5-141.7 27.2L243.5 153.1l-45.3 45.3 262.3 262.2c-13.1 13.3-21.2 31.5-21.2 51.6 0 40.6 32.9 73.4 73.4 73.4 20.1 0 38.4-8.1 51.6-21.2l260.9 260.8 45.3-45.3-95.6-95.6C887.2 609.1 960.3 514 960.3 514z m-376.7-20.9c-6.8-25.2-26.6-45.1-51.9-51.9L437.5 347c23-10.3 48.5-16 75.3-16 102.1 0 184.9 82.8 184.9 184.9 0 26.8-5.7 52.2-15.9 75.2l-98.2-98z">
          </path>
        </svg></div> -->
    </div>
    <div class="tree-pane-modal-content">
      <div class="tree-node-branches">
        <div class="tree-node-children">
          <div class="tree-node expanded selected" v-for="item in modalLayers" :key="item.key">
            <div class="tree-node-title" style="padding-left: 24px" @click="onClickNode(item)">
              <div v-if="item.selected">
                <svg
                  fill="currentColor"
                  preserveAspectRatio="xMidYMid meet"
                  width="16"
                  height="16"
                  viewBox="0 0 1024 1024"
                  class="tree-node-modal-radio-active"
                >
                  <path
                    d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-256a256 256 0 1 0 0-512 256 256 0 0 0 0 512z"
                  ></path>
                </svg>
              </div>
              <div v-else>
                <svg
                  fill="currentColor"
                  preserveAspectRatio="xMidYMid meet"
                  width="16"
                  height="16"
                  viewBox="0 0 1024 1024"
                  class="tree-node-modal-radio"
                  data-spm-anchor-id="0.0.0.i12.594f4b2cOGZWLN"
                >
                  <path
                    d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m0-64A448 448 0 1 0 512 64a448 448 0 0 0 0 896z"
                  ></path>
                </svg>
              </div>
              <i class="tree-node-expand-placeholder"></i>
              <div class="tree-node-title-label">
                <span class="lc-title">
                  <span class="lc-title-txt">{{ item.title }}</span>
                </span>
              </div>
              <!-- <div class="tree-node-lock-btn"><svg fill="currentColor" preserveAspectRatio="xMidYMid meet" width="16"
                  height="16" viewBox="0 0 1024 1024">
                  <path
                    d="M832 464h-68V240c0-70.7-57.3-128-128-128H388c-70.7 0-128 57.3-128 128v224h-68c-17.7 0-32 14.3-32 32v384c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V496c0-17.7-14.3-32-32-32zM540 701v53c0 4.4-3.6 8-8 8h-40c-4.4 0-8-3.6-8-8v-53c-12.1-8.7-20-22.9-20-39 0-26.5 21.5-48 48-48s48 21.5 48 48c0 16.1-7.9 30.3-20 39z m152-237H332V240c0-30.9 25.1-56 56-56h248c30.9 0 56 25.1 56 56v224z">
                  </path>
                </svg>
                <meta data-role="tip">
              </div>
              <div class="tree-node-rename-btn"><svg fill="currentColor" preserveAspectRatio="xMidYMid meet" width="16"
                  height="16" viewBox="0 0 1024 1024">
                  <path
                    d="M965.824 405.952a180.48 180.48 0 0 1-117.12-85.376 174.464 174.464 0 0 1-16-142.08 22.208 22.208 0 0 0-7.04-23.552 480.576 480.576 0 0 0-153.6-89.216 23.104 23.104 0 0 0-24.32 5.76 182.208 182.208 0 0 1-135.68 57.92 182.208 182.208 0 0 1-133.12-56.64 23.104 23.104 0 0 0-26.88-7.04 478.656 478.656 0 0 0-153.6 89.856 22.208 22.208 0 0 0-7.04 23.552 174.464 174.464 0 0 1-16 141.44A180.48 180.48 0 0 1 58.24 405.952a22.4 22.4 0 0 0-17.28 17.792 455.08 455.08 0 0 0 0 176.512 22.4 22.4 0 0 0 17.28 17.792 180.48 180.48 0 0 1 117.12 84.736c25.408 42.944 31.232 94.592 16 142.08a22.208 22.208 0 0 0 7.04 23.552A480.576 480.576 0 0 0 352 957.632h7.68a23.04 23.04 0 0 0 16.64-7.04 184.128 184.128 0 0 1 266.944 0c6.592 8.96 18.752 11.968 28.8 7.04a479.36 479.36 0 0 0 156.16-88.576 22.208 22.208 0 0 0 7.04-23.552 174.464 174.464 0 0 1 13.44-142.72 180.48 180.48 0 0 1 117.12-84.736 22.4 22.4 0 0 0 17.28-17.792 452.613 452.613 0 0 0 0-176.512 23.04 23.04 0 0 0-17.28-17.792z m-42.88 169.408a218.752 218.752 0 0 0-128 98.112 211.904 211.904 0 0 0-21.76 156.736 415.936 415.936 0 0 1-112 63.68 217.472 217.472 0 0 0-149.12-63.68 221.312 221.312 0 0 0-149.12 63.68 414.592 414.592 0 0 1-112-63.68c12.8-53.12 4.288-109.12-23.68-156.096A218.752 218.752 0 0 0 101.12 575.36a386.176 386.176 0 0 1 0-127.36 218.752 218.752 0 0 0 128-98.112c27.2-47.552 34.944-103.68 21.76-156.8a415.296 415.296 0 0 1 112-63.68A221.44 221.44 0 0 0 512 187.392a218.24 218.24 0 0 0 149.12-57.984 413.952 413.952 0 0 1 112 63.744 211.904 211.904 0 0 0 23.04 156.096 218.752 218.752 0 0 0 128 98.112 386.65 386.65 0 0 1 0 127.36l-1.28 0.64z">
                  </path>
                  <path
                    d="M512 320.576c-105.984 0-192 85.568-192 191.104a191.552 191.552 0 0 0 192 191.104c106.112 0 192.064-85.568 192.064-191.104a190.72 190.72 0 0 0-56.256-135.168 192.448 192.448 0 0 0-135.744-55.936z m0 318.528c-70.656 0-128-57.088-128-127.424 0-70.4 57.344-127.36 128-127.36 70.72 0 128 56.96 128 127.36 0 33.792-13.44 66.176-37.44 90.112a128.32 128.32 0 0 1-90.496 37.312z">
                  </path>
                </svg>
                <meta data-role="tip">
              </div> -->
            </div>
            <div class="tree-node-branches" v-if="item.children && item.children.length">
              <div class="tree-node-children">
                <slot name="child" :item="item"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue";
import { useSettingStoreWithOut } from "@/store/modules/setting";
import { useAppStoreWithOut } from "@/store/modules/app";
import { cloneDeep } from "lodash-es";
import { onSelect } from "@/composition/index";
const props = defineProps<{
  modalLayers: Array<any>;
}>();
const { modalLayers } = toRefs(props);
const useSettingStore = useSettingStoreWithOut();
const useAppStore = useAppStoreWithOut();
const onClickNode = async (item: any) => {
  const id = item.key;
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
      // if (selectedKeys.length === 1) {
      //   // 更新设置器
      //   changeSetter(useAppStore.pageModel?.currentComponent, [
      //     ChangeSetterEnum.ATTRIBUTE,
      //     ChangeSetterEnum.STYLE,
      //     ChangeSetterEnum.EVENT,
      //   ]);
      // }
    }
    useSettingStore.setSelectedKeys(selectedKeys);
    // 设置被选中组件和可被吸附的组件
    // this.setElementGuidelines();
    return;
  }

  // if (useAppStore.isCtrlKey) {
  //   onSelect([item.key], { node: { eventKey: item.key } })
  //   return
  // }
  useSettingStore.moveableExample.clearAllTarget();
  modalLayers.value.map((v: any) => {
    let vDom = document.getElementById(v.key) as any;
    if (v.key === item.key) {
      if (!vDom.visible) onSelect([item.key], { node: { eventKey: item.key } });
      vDom.visibleHandleFun(!vDom.visible);
    } else vDom.visibleHandleFun(false);
  });
};
// const modalState = computed(() => {
//   const selectedComponents = useAppStore.pageModel.selectedComponents
//   return (key: string) => selectedComponents.filter((v: any) => v.id === key).length
// });
// const test = () => {
//   console.log(modalLayers.value)
//   console.log(useAppStore.pageModel.selectedComponents)
// }
watch(
  () => useSettingStore.selectedKeys,
  (newVal) => {
    if (newVal.length) {
      let selectedModal:any;
      newVal.map((v:string) => {
        if (v.slice(0, 7) === "Q-MODAL" || v.slice(0, 8) === "Q-DRAWER") selectedModal = v
      })
      modalLayers.value.map((v:any) => {
        if (v.key === selectedModal) v.selected = true
        else  v.selected = false
      })
    }    
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
$color_1: #006cff;
$color_2: rgba(31, 56, 88, 0.4);
$color_3: rgba(31, 56, 88, 0.6);
$color_4: rgba(0, 0, 0, 0.6);
$color_5: #b33406;
$color_6: #67bbbb;
$color_7: #d35ad3;
$color_8: #9b9b9b;
$background-color_1: #fff;
$border-left-color_1: #197aff;

.tree-node-modal {
  margin: 5px;
  border: 1px solid rgba(31, 56, 88, 0.2);
  border-radius: 3px;
  -webkit-box-shadow: 0 1px 4px 0 rgba(31, 56, 88, 0.15);
  box-shadow: 0 1px 4px 0 rgba(31, 56, 88, 0.15);

  .tree-node-modal-title {
    position: relative;
    background: rgba(31, 56, 88, 0.04);
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid rgba(31, 56, 88, 0.2);

    .tree-node-modal-title-visible-icon {
      position: absolute;
      top: 4px;
      right: 12px;
      cursor: pointer;
    }
  }

  .tree-pane-modal-content {
    > .tree-node-branches {
      &:before {
        display: none;
      }
    }
  }

  .tree-node-modal-radio {
    margin-right: 4px;
    opacity: 0.8;
    position: absolute;
    top: 7px;
    left: 6px;
  }

  .tree-node-modal-radio-active {
    margin-right: 4px;
    opacity: 0.8;
    position: absolute;
    top: 7px;
    left: 6px;
    color: $color_1;
  }

  .tree-node-branches:before {
    position: absolute;
    display: block;
    width: 0;
    border-left: 1px solid transparent;
    height: 100%;
    top: 0;
    left: 6px;
    content: " ";
    z-index: 2;
    pointer-events: none;
  }

  &:hover .tree-node-branches:before {
    border-left-color: #ddd;
  }
}

.tree-node {
  .tree-node-expand-btn {
    width: 12px;
    line-height: 0;
    -webkit-align-self: stretch;
    -ms-flex-item-align: stretch;
    align-self: stretch;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-transition: color 0.2s ease;
    transition: color 0.2s ease;
    color: $color_2;
    margin-right: 4px;

    &:hover {
      color: $color_3;
    }

    > svg {
      -webkit-transform-origin: center;
      -ms-transform-origin: center;
      transform-origin: center;
      -webkit-transform: rotate(-90deg);
      -ms-transform: rotate(-90deg);
      transform: rotate(-90deg);
      -webkit-transition: -webkit-transform 0.1s ease;
      transition: -webkit-transform 0.1s ease;
      transition: transform 0.1s ease;
      transition: transform 0.1s ease, -webkit-transform 0.1s ease;
    }
  }

  .tree-node-expand-placeholder {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }

  .tree-node-icon {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin-right: 4px;
    color: $color_4;

    > svg {
      width: 16px;
      height: 16px;

      * {
        fill: rgba(31, 56, 88, 0.4);
      }
    }

    > img {
      width: 16px;
      height: 16px;

      * {
        fill: rgba(31, 56, 88, 0.4);
      }
    }
  }

  .tree-node-title {
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    border-bottom: 1px solid rgba(31, 56, 88, 0.1);
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    height: 30px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    padding-right: 5px;

    &:first-child {
      margin-left: 2px;
    }

    .tree-node-title-label {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
      overflow: visible;
      margin-right: 5px;

      .tree-node-title-input {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -ms-flex: 1;
        flex: 1;
        border: 1px solid #197aff;
        background-color: $background-color_1;
        color: $color_4;
        line-height: 18px;
        padding: 2px;
        outline: none;
        margin-left: -3px;
        border-radius: 2px;
      }
    }

    .tree-node-hide-btn {
      opacity: 0;
      color: $color_4;
      line-height: 0;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 22px;

      &:hover {
        opacity: 1 !important;
      }
    }

    .tree-node-lock-btn {
      opacity: 0;
      color: $color_4;
      line-height: 0;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 22px;

      &:hover {
        opacity: 1 !important;
      }
    }

    .tree-node-rename-btn {
      opacity: 0;
      color: $color_4;
      line-height: 0;
      -webkit-align-self: stretch;
      -ms-flex-item-align: stretch;
      align-self: stretch;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 22px;

      &:hover {
        opacity: 1 !important;
      }
    }

    &:hover {
      .tree-node-hide-btn {
        opacity: 0.5;
      }

      .tree-node-lock-btn {
        opacity: 0.5;
      }

      .tree-node-rename-btn {
        opacity: 0.5;
      }
    }

    .tree-node-tag {
      margin-left: 5px;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      -ms-flex-align: center;
      align-items: center;
      line-height: 0;
    }

    .tree-node-tag.cond {
      color: $color_5;
    }

    .tree-node-tag.loop {
      color: $color_6;
    }

    .tree-node-tag.slot {
      color: $color_7;
    }
  }

  .tree-node-title.editing {
    > .tree-node-hide-btn {
      display: none;
    }

    > .tree-node-lock-btn {
      display: none;
    }

    > .tree-node-rename-btn {
      display: none;
    }
  }

  .tree-node-branches {
    padding-left: 12px;
    position: relative;
  }
}

html.lc-cursor-dragging {
  .tree-node {
    .tree-node-title {
      .tree-node-hide-btn {
        display: none;
      }

      .tree-node-lock-btn {
        display: none;
      }

      .tree-node-rename-btn {
        display: none;
      }
    }
  }
}

.tree-node.is-root {
  > .tree-node-title {
    padding-left: 5px;
  }
}

.tree-node.expanded {
  > .tree-node-title {
    > .tree-node-expand-btn {
      > svg {
        -webkit-transform: rotate(0);
        -ms-transform: rotate(0);
        transform: rotate(0);
      }
    }
  }
}

.tree-node.detecting {
  > .tree-node-title {
    background: rgba(31, 56, 88, 0.04);
  }
}

.tree-node.selected {
  > .tree-node-title {
    background: rgba(31, 56, 88, 0.06);
  }

  > .tree-node-branches {
    &::before {
      border-left-color: $border-left-color_1;
    }
  }
}

.tree-node.hidden {
  .tree-node-title-label {
    color: $color_8;
  }

  > .tree-node-title {
    > .tree-node-hide-btn {
      opacity: 0.8;
    }
  }

  .tree-node-branches {
    .tree-node-hide-btn {
      opacity: 0;
    }
  }
}

.tree-node.condition-flow {
  > .tree-node-title {
    > .tree-node-hide-btn {
      opacity: 1;
    }
  }
}

.tree-node.condition-flow.hidden {
  > .tree-node-title {
    > .tree-node-hide-btn {
      opacity: 0;
    }
  }
}

.tree-node.locked {
  > .tree-node-title {
    > .tree-node-lock-btn {
      opacity: 0.8;
    }
  }

  .tree-node-branches {
    .tree-node-hide-btn {
      opacity: 0;
    }

    .tree-node-lock-btn {
      opacity: 0;
    }
  }
}

.tree-node.dropping {
  > .tree-node-branches {
    &:before {
      border-left: 1px solid #006cff;
    }
  }

  > .tree-node-title {
    .tree-node-expand-btn {
      color: $color_1;
    }

    .tree-node-icon {
      color: $color_1;
    }

    .tree-node-title-label {
      > .lc-title {
        color: $color_1;
      }
    }
  }
}

.tree-node.highlight {
  > .tree-node-title {
    background: rgba(31, 56, 88, 0.06);
  }
}
</style>
