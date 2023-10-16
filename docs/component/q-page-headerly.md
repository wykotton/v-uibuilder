---
category: Components
type: 页头
title: PageHeader
subtitle: 固钉
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/PageHeader.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import("@zzjz/v-component/dist2/assets/q-page-headerly.js");})

</script>

# PageHeader  页头

页头位于页容器中，页容器顶部，起到了内容概览和引导页级操作的作用。包括由面包屑、标题、页面内容简介、页面级操作等、页面级导航组成。

## 何时使用
当需要使用户快速理解当前页是什么以及方便用户使用页面功能时使用，通常也可被用作页面间导航。

## 代码演示

### 基础用法

:::demo

```vue
<template>
  <q-page-headerly style="width: 100%"></q-page-headerly>
</template>
```

:::



## PageHeader 属性

| 属性               | 说明    | 类型     | 可选值                       | 默认值 |
|------------------|-------|--------|---------------------------|-----|
| pageHeaderStyle           | 自定义样式 | string | —                         | —   |
| title      | 标题    | string | —                         | —  |
| subTitle | 副标题   | string | —                         | —   |


## PageHeader DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |



## PageHeader 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |