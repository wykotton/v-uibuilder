---
category: Components
type: 数据展示
title: BackTop
subtitle: 回到顶部
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/BackTop.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-back-top.js");})

</script>

# BackTop  回到顶部

返回页面顶部的操作按钮。

## 何时使用

当页面内容区域比较长时；
当用户需要频繁返回顶部查看相关内容时。

## 代码演示

:::demo

```vue
<template>
  <div class="q-back-top-parent" style="height: 300px;overflow: auto">
    <div class="q-back-top-child" style="height: 1000px;position: relative">
      <q-back-top target=".q-back-top-parent" style="position: absolute;right: 10px; bottom: 10px;position: absolute"></q-back-top>
    </div>
  </div>
</template>
```

:::

## BackTop 属性

| 属性               | 说明        | 类型       | 可选值                       | 默认值  |
|------------------|-----------|----------|---------------------------|------|
| target           | 监听滚动事件的元素 | string | —                         | .auto-size-inner-dropzone     |
| backTopSlot      | 按钮内容      | slot     | —                         | —    |
| visibilityHeight | 出现该按钮的高度  | number   | —                         | —    |
| leftOrRight      | 按钮位置      | string   | left, right               | left |
| aroundSize       | 左/右偏移距离   | number   | —                         | 100  |
| bottomSize       | 图标插槽      | number   | —                         | 100  |
| backTopStyle     | 内|部样式      | string   | wait,process,finish,error | —    |

## BackTop DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## BackTop 消息响应

| 事件名                 | 说明        | 参数                |
|---------------------|-----------|-------------------|
| click   | 点击事件 | (event: IMessage) |

## BackTop 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |