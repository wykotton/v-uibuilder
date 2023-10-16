---
category: Components
type: 插件
title: RouterConfig
subtitle: 路由配置
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/RouterConfig.svg
---

<script lang="ts" setup> 
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/dist2/assets/q-router-config.js");
})

</script>

# RouterConfig 路由配置

这是所有元件事件、消息的交换中心，是协调画布中元件之间数据和事件扭转的中枢。

## 何时使用

- 需要调用元件事件时。
- 需要收发元件消息时。

## 代码演示

:::demo

```vue
<template>
  <q-router-config class="q-router-config" placeholder="请输入"></q-router-config>
</template>
<style>
.q-router-config {
  width: 100%;
}
</style>
```

:::

## RouterConfig 属性

| 属性         | 说明                 | 类型    | 可选值 | 默认值 |
| ------------ | -------------------- | ------- | ------ | ------ |
| value        | 组件路由配置数据     | string  | —      | —      |
| defaultValue | 组件路由配置默认数据 | string  | —      | —      |
| name         | 标识                 | number  | —      | —      |
| disabled     | 组件路由配置是否禁用 | boolean | —      | false  |
| clearable    | 组件路由配置是否清除 | boolean | —      | false  |
| type         | 文本框还是路由配置   | boolean | —      | false  |

## RouterConfig DOM 事件

| 事件名   | 说明 | 参数                 |
| -------- | ---- | -------------------- |
| click    | 单击 | (event: CustomEvent) |
| dblclick | 双击 | (event: CustomEvent) |

## RouterConfig 消息响应

| 事件名     | 说明         | 参数              |
| ---------- | ------------ | ----------------- |
| setInfo    | 设置组件数据 | (event: IMessage) |
| changeInfo | 更改组件数据 | (event: IMessage) |
| resetInfo  | 重置组件数据 | (event: IMessage) |

## RouterConfig 属性监听

| 事件名     | 说明             | 参数                                     |
| ---------- | ---------------- | ---------------------------------------- |
| value      | 值发生变化       | (newVal: any, oldVal: any, context: any) |
| prop       | 传值发生变化     | (newVal: any, oldVal: any, context: any) |
| onDOMEvent | DOM 事件被触发时 | (newVal: any, oldVal: any, context: any) |

## RouterConfig 生命周期

| 事件名  | 说明 | 参数 |
| ------- | ---- | ---- |
| created | 创建 | -    |
| updated | 更新 | -    |
| destroy | 销毁 | -    |
