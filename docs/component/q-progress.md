---
category: Components
type: 数据展示
title: Progress
subtitle: 锚点
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Progress.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
  import("@zzjz/v-component/dist2/assets/q-progress.js");
}) 
</script>

# Progress  进度条

展示操作的当前进度。

## 何时使用

在操作需要较长时间才能完成时，为用户显示该操作的当前进度和状态。

当一个操作会打断当前界面，或者需要在后台运行，且耗时可能超过 2 秒时；
当需要显示一个操作完成的百分比时。

## 标准进度条

:::demo

```vue
<template>
  <q-progress :percent="30" />
  <q-progress :percent="50" status="active" />
  <q-progress :percent="70" status="exception" />
  <q-progress :percent="100" status="success" />
  <q-progress :percent="50" :show-info="false" />
</template>
<style>
</style>
```

:::

## 圆形进度条

:::demo

```vue
<template>
  <q-progress type="circle" :percent="75" />
  <q-progress type="circle" :percent="70" status="exception" />
  <q-progress type="circle" :percent="100" status="success" />
</template>
<style>
</style>
```

:::


:::

## 自定义内容

:::demo

```vue
<template>
  <q-progress type="circle" :percent="75" :infoFormat="percent => `${percent} Days`" />
  <q-progress type="circle" :percent="100" :infoFormat="() => 'Done'"/>
</template>
<style>
</style>
```

:::

## Progress 属性

| 属性               | 说明   | 类型       | 可选值                       | 默认值     |
|------------------|------|----------|---------------------------|---------|
| percent           | 百分比  | number   | —                         | —       |
| size      | 大小   | string   | small,default             | small   |
| strokeLinecap | 进度条样式 | string   | round,square              | square  |
| status      | 状态 | string | success,exception,normal,active | —       |
| showInfo      | 是否显示进度数值或状态图标 | boolean | — | true    |
| strokeColor      | 进度条的色彩 | string | — | #1890ff |
| trailColor      | 未完成的分段的颜色 | string | — | #f5f5f5 |
| progressTitle      | 鼠标移入显示 | string | — | —       |
| steps      | 进度条总共步数（仅线类型生效） | number | — | —       |
| strokeWidth      | 进度条线宽（仅线类型生效） | number | — | —       |


## Progress DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Progress 消息响应

| 事件名                 | 说明        | 参数                |
|---------------------|-----------|-------------------|
| increase   | 增加 | (event: IMessage) |
| decrease   | 减少 | (event: IMessage) |
| setValue   | 赋值 | (event: IMessage) |
| change   | 值变更 | (event: IMessage) |
| click   | 点击事件 | (event: IMessage) |

## Progress 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |