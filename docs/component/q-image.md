---
category: Components
type: 数据展示
title: Image
subtitle: 图片
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Image.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/src/components/q-image/q-image");
})

</script>

# Image 图片

可预览的图片。

## 何时使用

- 需要展示图片时使用。
- 加载大图时显示 loading 或加载失败时容错处理。

## 代码演示

### 基础用法
:::demo

```vue
<template>
	<q-image class="q-image" src="/images/ui-builder-logo.svg"></q-image>
</template>
<style>
.q-image {
	width: 100%;
}
</style>
```

:::

### 相册模式
:::demo

```vue
<template>
	<q-image class="q-image" src="https://aliyuncdn.antdv.com/logo.png" :previewSrcList="previewSrcList"></q-image>
</template>
<script lang="ts" setup>
	const previewSrcList = [
		"/images/ui-builder-logo.svg",
		"https://aliyuncdn.antdv.com/logo.png"
	]
</script>
<style>
.q-image {
	width: 100%;
}
</style>
```

:::



## Image 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件图片数据                              | string  | —               | —      |
| defaultValue | 组件图片默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件图片是否禁用                           | boolean  | —               | false |
| clearable    | 组件图片是否清除                           | boolean  | —               | false |
| type         | 文本框还是图片                             | boolean | —               | false  |

## Image DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Image 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Image 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Image 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |