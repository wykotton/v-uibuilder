---
category: Components
type: 数据展示
title: Text
subtitle: 文本
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Text.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import ("@zzjz/v-component/dist2/assets/q-text.js");
}) 
</script>

# Text 文本

常用的文本显示组件

## 何时使用

- 使用 `value` 来定义 Text 的显示内容

## 代码演示

:::demo

```vue
<template>
	<q-text class="q-text"></q-text>
</template>
<style>
.q-text {
	width: 100%;
}
</style>
```

:::

## Text 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| text        | 组件文本数据                              | string  | —               | —      |

## Text DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Text 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |

## Text 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Text 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |