---
category: Components
type: 数据展示
title: Timeline
subtitle: 时间轴
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Timeline.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
  import ("@zzjz/v-component/dist2/assets/q-timeline.js");
}) 
</script>

# Timeline 标签

垂直展示的时间流信息。

## 何时使用

当有一系列信息需按时间排列时，可正序和倒序。
需要有一条时间轴进行视觉上的串联时。

## 代码演示

:::demo

```vue

<template>
  <q-timeline></q-timeline>
</template>
<style>
</style>
```

:::

## Timeline 属性

| 属性             | 说明      | 类型      | 可选值 | 默认值   |
|----------------|---------|---------|-----|-------|
| title          | 标题      | string  | —   | —     |
| value          | 标题值     | string  | —   | —     |
| dot            | 自定义节点图标 | string  | —   | —     |
| dotColor       | 图标颜色    | string  | —   | —     |
| subtitle       | 子标题数据   | string  | —   | —     |
| subtitle.title | 子标题     | string  | —   | —     |
| subtitle.value | 子标题值    | string  | —   | —     |
| pending        | 幽灵节点    | string  | —   | —     |
| reverse        | 正序/倒叙   | boolean | —   | false |

## Timeline DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Timeline 消息响应

| 事件名                | 说明     | 参数                |
|--------------------|--------|-------------------|
| setTimelineData    | 设置时间轴值 | (event: IMessage) |
| updateTimelineData | 修改时间轴值 | (event: IMessage) |

## Timeline 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |