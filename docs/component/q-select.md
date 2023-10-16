---
category: Components
type: 数据录入
title: Select
subtitle: 选择器
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Select.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/dist2/assets/q-select.js");
}) 
</script>

# Select 选择器

下拉选择器。

## 何时使用

- 弹出一个下拉菜单给用户选择操作，用于代替原生的选择器，或者需要一个更优雅的多选器时。
- 当选项少时（少于 5 项），建议直接将选项平铺，使用 [Radio](/component/q-radio.html) 是更好的选择。

## 代码演示

### 基本用法
适用广泛的基础单选 `value` 的值为当前被选中的 `项` 的 `value` 属性值

:::demo

```vue
<template>
	<section class="code-box-demo">
		<q-select class="q-select" :value="value" :options="options"></q-select>
	</section>
</template>
<script lang="ts" setup> 
import { ref } from 'vue'

	const value = ref('Option3')
	const options = [
		{
			value: 'Option1',
			label: 'Option1',
		},
		{
			value: 'Option2',
			label: 'Option2',
		},
		{
			value: 'Option3',
			label: 'Option3',
		},
		{
			value: 'Option4',
			label: 'Option4',
		},
		{
			value: 'Option5',
			label: 'Option5',
		},
	]
</script>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::

### 默认值
默认展示选中值

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-select class="q-select" value="下拉2"></q-select>
	</section>
</template>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::

### 禁用状态

禁用整个选择器组件

为 `q-select` 设置 `disabled`属性，则整个选择器不可用。

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-select class="q-select" disabled></q-select>
	</section>
</template>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::

### 一键清空

您可以使用清除图标来清除选择。

为 `q-select` 设置 `clearable` 属性，则可将选择器清空。 需要注意的是，`clearable` 属性仅适用于单选。

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-select 
			class="q-select" 
			:clearable="true"
			></q-select>
	</section>
</template>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::

### 基础多选

为 `q-select` 设置 `multiple` 属性即可启用多选。

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-select 
			class="q-select" 
			:multiple="true"
			></q-select>
	</section>
</template>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::

### 多选折叠已选项

为 `q-select` 设置 `collapseTags` 属性即可启用多选。

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-select 
			class="q-select" 
			:multiple="true"
			:collapseTags="true"
			></q-select>
	</section>
</template>
<style>
.code-box-demo{
	padding-bottom: 30px;
}
.q-select {
	position: absolute;
}
</style>
```

:::



## Select 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件选中值                                  | string  | —               | —      |
| defaultValue | 组件选中值                                  | string  | —               | —      |
| name         | 标识                                        | string  | —               | —      |
| options      | 组件可选项                                  | array    | —               | —      |
| disabled     | 是否禁用组件                                 | boolean  | —               | false |
| clearable    | 是否显示清除按钮                             | boolean | —               | false  |
| multiple     | 是否开启多选                                 | boolean | —               | false  |
| collapseTags | 多选时是否折叠已选项                         | boolean | —               | false  |

## Select DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Select 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Select 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Select 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |