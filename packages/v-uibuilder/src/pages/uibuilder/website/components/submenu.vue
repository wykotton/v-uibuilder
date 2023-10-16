<template>
  <a-sub-menu :key="treeData.key" @titleClick="titleClick">
    <template #title>
      <span>{{ treeData.title }}</span>
    </template>
    <template v-for="item in treeData.children" :key="item.key">
      <Submenu v-if="item.children.length" :treeData="item"></Submenu>
      <a-menu-item v-else :key="item.key">{{ item.title }}</a-menu-item>
    </template>
  </a-sub-menu>
</template>
<script setup lang="ts">
import { treeDataOptions } from "@/types/website";
import Submenu from "./submenu.vue";

defineProps<{
  treeData: treeDataOptions;
}>();

function titleClick(e: any) {
  e?.stopPropagation();
  e?.preventDefault();
}
</script>
<style scoped lang="scss"></style>
