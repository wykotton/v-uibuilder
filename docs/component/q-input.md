---
category: Components
type: 数据录入
title: Input
subtitle: 输入框
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/dist2/assets/q-input.js");
})

</script>

# Input 输入框

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

- 需要用户输入表单域内容时。
- 提供组合型输入框，带搜索的输入框，还可以进行大小选择。

## 代码演示

### 基本用法
下面几个示例展示了文本输入组件的基本用法。

:::demo 

```vue
<template>
	<q-input class="q-input" placeholder="请输入"></q-input>
</template>
<script lang="ts">
export default defineComponent({
	setup() {
		return {
			value: null,
		};
	},
	mounted() {
		console.log("cctv", this)
	}
});
</script>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

### 默认值
默认展示输入值

:::demo 

```vue
<template>
	<q-input class="q-input" placeholder="请输入" :value="'张三'"></q-input>
</template>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

### 禁用状态
通过 `disabled` 属性指定是否禁用 input 组件

:::demo 

```vue
<template>
	<q-input class="q-input" disabled placeholder="请输入"></q-input>
</template>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

### 一键清空
使用`clearable`属性即可得到一个可一键清空的输入框

:::demo 

```vue
<template>
	<q-input 
		class="q-input" 
		placeholder="请输入" 
		:clearable="true"
	/>
</template>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

### 文本域
用于输入多行文本信息可缩放的输入框。 添加 `type="textarea"` 属性来将 `input` 元素转换为原生的 `textarea` 元素。

文本域默认高度可通过 `rows` 属性控制

:::demo 

```vue
<template>
	<q-input 
		class="q-input" 
		placeholder="请输入" 
		type="textarea"
		rows="3"
	/>
</template>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

## Input 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件输入框数据                              | string  | —               | —      |
| defaultValue | 组件输入框默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件输入框是否禁用                           | boolean  | —               | false |
| clearable    | 组件输入框是否清除                           | boolean  | —               | false |
| type         | 文本框还是输入框                             | boolean | —               | false  |

## Input DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Input 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Input 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Input 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |