---
category: Components
type: 插件
title: ConfigCenter
subtitle: 配置中心
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/ConfigCenter.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-config-center.js");})

</script>

# ConfigCenter 配置中心

整理中...

## 何时使用



## 代码演示

:::demo

```vue
<template>
	<q-config-center class="q-config-center" placeholder="请输入"></q-config-center>
</template>
<style>
.q-config-center {
	width: 100%;
}
</style>
```

:::

## ConfigCenter 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件配置中心数据                              | string  | —               | —      |
| defaultValue | 组件配置中心默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件配置中心是否禁用                           | boolean  | —               | false |
| clearable    | 组件配置中心是否清除                           | boolean  | —               | false |
| type         | 文本框还是配置中心                             | boolean | —               | false  |

## ConfigCenter DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## ConfigCenter 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## ConfigCenter 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## ConfigCenter 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |