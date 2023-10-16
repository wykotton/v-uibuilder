---
category: Components
type: 容器
title: Combination
subtitle: 容器
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Combination.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import ("@zzjz/v-component/dist2/assets/q-combination.js");
import ("@zzjz/v-component/dist2/assets/q-text.js");
import ("@zzjz/v-component/dist2/assets/q-tablely.js");}) 

</script>

# Combination 容器

承载各种元件集合的容器。

## 何时使用

- 需要组合在一起进行编辑的元件集合。

## 代码演示

:::demo

```vue
<template>
	<q-combination class="q-combination">
		<q-text class="q-text" text="这是一段文字和表格和按钮的组合"></q-text>
		<q-tablely class="q-tablely"></q-tablely>
		<div class="option-lamu">
			<q-button class="q-button1">
				探索
			</q-button>
			<q-button class="q-button2">
				回归
			</q-button>
		</div>
	</q-combination>
</template>
<style>
.q-combination {
	width: 100%;
}
.q-text{
	margin-bottom: 20px;
}
.option-lamu{
	position: relative;
	margin-bottom: 50px;
}
.q-button1{
	position: absolute;
	top: 20px;
	right: 70px;
	color: #fff; 
	border-color: #1890ff; 
	background: #1890ff; 
	text-shadow: 0 -1px 0 rgb(0 0 0 / 12%); 
	box-shadow: 0 2px #0000000b;
	border: 1px solid transparent;
	border-radius: 3px;
	font-size: 14px;
	padding: 0px 10px;
	cursor: pointer;
}
.q-button2{
	position: absolute;
	top: 20px;
	right: 0px;
	color: #333; 
	border-color: #1890ff; 
	background: #fff; 
	text-shadow: 0 -1px 0 rgb(0 0 0 / 12%); 
	box-shadow: 0 2px #0000000b;
	border: 1px solid #e3e3e3;
	border-radius: 3px;
	font-size: 14px;
	padding: 0px 10px;
	cursor: pointer;
}
</style>
```

:::

## Combination 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件容器数据                              | string  | —               | —      |
| defaultValue | 组件容器默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件容器是否禁用                           | boolean  | —               | false |
| clearable    | 组件容器是否清除                           | boolean  | —               | false |
| type         | 文本框还是容器                             | boolean | —               | false  |

## Combination DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Combination 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Combination 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Combination 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |