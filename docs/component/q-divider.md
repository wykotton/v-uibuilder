---
category: Components
type: 数据展示
title: Divider
subtitle: 分割线
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Anchor.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import("@zzjz/v-component/dist2/assets/q-divider.js")})
;
</script>

# Divider  分割线

区隔内容的分割线。

## 何时使用

对不同章节的文本段落进行分割。
对行内文字/链接进行分割，例如表格的操作列。

## 代码演示

### 基础用法

## 水平分割线

:::demo

```vue
<template>
 <q-divider text="剧中标题"></q-divider>
 <q-divider text="左侧标题" orientation="left"></q-divider>
 <q-divider text="右侧标题" orientation="right"></q-divider>
 <q-divider text="虚线" dashed style="background-color: #7cb305;width: 100%;height: 2px;"></q-divider>
</template>

<style>
.q-anchor {
  height: 150px;
  position: relative ;
}
</style>
```

:::


## 垂直分割线

:::demo

```vue
<template style="display: flex">
  tab1
  <q-divider type="vertical" text="" style="background-color: red;width: 2px;height: 20px;margin: 0 10px"></q-divider>
  tab2
  <q-divider type="vertical" text="" style="background-color: #7cb305;width: 2px;height: 20px;margin: 0 10px" dashed></q-divider>
  tab3
</template>

<style>
.q-anchor {
  height: 150px;
  position: relative ;
}
</style>
```

:::



## Divider 属性

| 属性               | 说明        | 类型       | 可选值               | 默认值   |
|------------------|-----------|----------|-------------------|-------|
| dashed           | 是否虚线 | boolean  | —                 | false |
| text      | 分割线文字      | text     | —                 | —     |
| orientation | 分割线标题的位置  | string   | left,right,center | —     |
| orientationMargin      | 标题和最近 left/right 边框之间的距离，去除了分割线，同时 orientation 必须为 left 或 right      | number   | —                 | —     |
| plain      | 文字是否显示为普通正文样式      | boolean | —                 | false |
| type      | 水平还是垂直类型      | string | horizontal ,vertical                 | —     |


## Divider DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |


## Divider 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |