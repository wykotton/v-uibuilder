<template>
  <a-sub-menu :key="menuInfo.key" @mouseenter.stop="focusSelectCom(menuInfo.key)" @mouseleave.stop="blurSelectCom">
    <template #title>{{ menuInfo.title }}</template>
    <template v-for="item in menuInfo.children" :key="item.key">
      <template v-if="!item.children?.length">
        <a-menu-item :key="item.key" @mouseenter="focusSelectCom(item.key)" @mouseleave="blurSelectCom">
          {{ item.title }}
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :menu-info="item" :key="item.key" />
      </template>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
import { blurSelectCom, focusSelectCom } from "@/composition/index";
import SubMenu from "@/components/sub-menu/index.vue";

defineProps({
  menuInfo: {
    type: Object,
    default: () => ({}),
  },
});
</script>
