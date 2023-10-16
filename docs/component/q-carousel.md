---
category: Components
type: 数据展示
title: Carousel
subtitle: 幻灯片
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Carousel.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-carousel.js");})

</script>

# Carousel 幻灯片

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型幻灯片，带搜索的幻灯片，还可以进行大小选择。

## 代码演示

:::demo

```vue
<template>
	<!-- <q-carousel class="q-carousel"></q-carousel> -->
	开发中...
</template>
<style>
.q-carousel {
	width: 100%;
}
</style>
```

:::

## Carousel 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件幻灯片数据                              | string  | —               | —      |
| defaultValue | 组件幻灯片默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件幻灯片是否禁用                           | boolean  | —               | false |
| clearable    | 组件幻灯片是否清除                           | boolean  | —               | false |
| type         | 文本框还是幻灯片                             | boolean | —               | false  |

## Carousel DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Carousel 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Carousel 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Carousel 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |