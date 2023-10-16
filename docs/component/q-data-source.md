---
category: Components
type: 插件
title: DataSource
subtitle: 数据源
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/DataSource.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import("@zzjz/v-component/dist2/assets/q-data-source.js");})

</script>

# DataSource 数据源

restAPI 配置。

## 何时使用

- 需要交互请求数据时。

## 代码演示

:::demo

```vue
<template>
  <q-data-source class="q-data-source" placeholder="请输入"></q-data-source>
</template>
<style>
.q-data-source {
  width: 100%;
}
</style>
```

:::

## DataSource 属性

| 属性         | 说明               | 类型    | 可选值 | 默认值 |
| ------------ | ------------------ | ------- | ------ | ------ |
| value        | 组件数据源数据     | string  | —      | —      |
| defaultValue | 组件数据源默认数据 | string  | —      | —      |
| name         | 标识               | number  | —      | —      |
| disabled     | 组件数据源是否禁用 | boolean | —      | false  |
| clearable    | 组件数据源是否清除 | boolean | —      | false  |
| type         | 文本框还是数据源   | boolean | —      | false  |

## DataSource DOM 事件

| 事件名   | 说明 | 参数                 |
| -------- | ---- | -------------------- |
| click    | 单击 | (event: CustomEvent) |
| dblclick | 双击 | (event: CustomEvent) |

## DataSource 消息响应

| 事件名     | 说明         | 参数              |
| ---------- | ------------ | ----------------- |
| setInfo    | 设置组件数据 | (event: IMessage) |
| changeInfo | 更改组件数据 | (event: IMessage) |
| resetInfo  | 重置组件数据 | (event: IMessage) |

## DataSource 属性监听

| 事件名     | 说明             | 参数                                     |
| ---------- | ---------------- | ---------------------------------------- |
| value      | 值发生变化       | (newVal: any, oldVal: any, context: any) |
| prop       | 传值发生变化     | (newVal: any, oldVal: any, context: any) |
| onDOMEvent | DOM 事件被触发时 | (newVal: any, oldVal: any, context: any) |

## DataSource 生命周期

| 事件名  | 说明 | 参数 |
| ------- | ---- | ---- |
| created | 创建 | -    |
| updated | 更新 | -    |
| destroy | 销毁 | -    |
