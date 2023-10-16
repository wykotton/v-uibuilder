<template>
  <div
    :style="{
      background: `${instance.menuBgColor} url('${instance.menuBgImage}') no-repeat fixed center/100% 100%`,
      padding: instance.menuPadding,
    }"
  >
    <template v-for="item in menuData" :key="item.key">
      <div v-if="item.children?.length">
        <q-popover
          ref="popover"
          trigger="hover"
          show_arrow="false"
          block="false"
          position="right-start"
          style="width: 100%"
        >
          <div
            :id="item.key"
            :style="getItemStyle(item)"
            @mouseenter="changeMenuBg($event, item)"
            @mouseleave="changeMenuBg($event, item)"
            @mousedown="menuClick($event, item)"
          >
            <div v-if="item.icon || instance.icon" style="padding: 0 4px">
              <span v-html="item.icon || instance.icon"></span>
            </div>
            <div>{{ item.title }}</div>
          </div>
          <div slot="popover" tip="popover">
            <sub-menu :menu-data="item.children"></sub-menu>
          </div>
        </q-popover>
      </div>
      <div v-else>
        <div
          :id="item.key"
          :style="getItemStyle(item)"
          @mouseenter="changeMenuBg($event, item)"
          @mouseleave="changeMenuBg($event, item)"
          @mousedown="menuClick($event, item)"
        >
          <div v-if="item.icon || instance.icon" style="padding: 4px; pointer-events: none">
            <span v-html="item.icon || instance.icon"></span>
          </div>
          <div>{{ item.title }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { inject, ref, Ref } from "vue";
import { cloneDeep } from "lodash-es";
import { menuTreeData } from "@zzjz/v-uibuilder-types";
import SubMenu from "./index.vue";

defineProps<{
  menuData: menuTreeData[];
}>();
const instance = inject("instance") as Ref;

function getItemStyle(item: menuTreeData) {
  return `background: ${item.bgColor || instance.value.bgColor} url("${
    item.bgImage || instance.value.bgImage
  }") no-repeat fixed center/100% 100%;
  color: ${item.color || instance.value.color};
  font-size: ${item.fontSize || instance.value.fontSize}px;
  font-weight: ${item.fontWeight || instance.value.fontWeight};
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  padding: 4px 6px;
  width: 100%;
  box-sizing: border-box`;
}

/**
 * hover变更背景色和背景图
 * @param ev
 * @param item
 */
function changeMenuBg(ev: any, item: menuTreeData) {
  const target = ev?.target;
  if (!target) return;
  const eventType = ev.type;
  switch (eventType) {
    case "mouseenter":
      target.style.background = `${item.hoverBgColor || instance.value.hoverBgColor} url("${
        item.hoverBgImage || instance.value.hoverImage
      }") no-repeat fixed center/100% 100%`;
      target.style.color = item.hoverColor || instance.value.hoverColor;
      break;
    case "mouseleave":
      target.style.background = `${item.bgColor || instance.value.bgColor} url("${
        item.bgImage || instance.value.bgImage
      }") no-repeat fixed center/100% 100%`;
      target.style.color = item.color || instance.value.color;
      break;
  }
}

const popover = ref();
/**
 * 菜单项点击
 * @param item
 */
function menuClick(ev: any, item: menuTreeData) {
  ev.stopPropagation();
  if (!instance.value) return;
  const tempItem = cloneDeep(item);
  Reflect.deleteProperty(tempItem, "children");
  try {
    instance.value.menuItemClick?.(tempItem);
    popover.value.leave?.();
  } catch (error) {}
}
</script>
<style lang="scss" scoped></style>
