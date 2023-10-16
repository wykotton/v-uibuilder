<template>
  <div class="w-full h-full">
    <DualLayout v-if="website.navigation === navigationEnum.DUAL" class="layout" :website="website"></DualLayout>
    <LeftLayout v-if="website.navigation === navigationEnum.LEFT" class="layout" :website="website"></LeftLayout>
    <TopLayout v-if="website.navigation === navigationEnum.TOP" class="layout" :website="website"></TopLayout>
    <FloatingLayout
      v-if="website.navigation === navigationEnum.FLOAT"
      class="layout"
      :website="website"
    ></FloatingLayout>
  </div>
</template>
<script setup lang="ts">
import { websiteOptions } from "@/types/website";
import { navigationEnum } from "@/enums/websiteEnum";
import DualLayout from "../layout/dualLayout.vue";
import LeftLayout from "../layout/leftLayout.vue";
import TopLayout from "../layout/topLayout.vue";
import FloatingLayout from "../layout/floatingLayout.vue";

defineProps<{
  website: websiteOptions;
}>();
</script>
<style scoped lang="scss">
.layout {
  width: 100%;
  height: 100%;
}
</style>
