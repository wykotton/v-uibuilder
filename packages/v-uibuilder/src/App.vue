<template>
  <ConfigProvider :locale="ZH">
    <RouterView />
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import ZH from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
</script>
<style>
body {
  overflow: hidden;
}
</style>
