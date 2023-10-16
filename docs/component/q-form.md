---
category: Components
type: 容器
title: Form
subtitle: 表单容器
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Form.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import("@zzjz/v-component/dist2/assets/q-form.js"); 
import("@zzjz/v-component/dist2/assets/q-input.js"); 
import("@zzjz/v-component/dist2/assets/q-date-time.js"); 
import("@zzjz/v-component/dist2/assets/q-checkbox-group.js"); 
import("@zzjz/v-component/dist2/assets/q-radio-group.js");
})

</script>

# Form 表单容器

高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。

## 何时使用

- 用于创建一个实体或收集信息。
- 需要对输入的数据类型进行校验时。

## 代码演示

### 基础用法

:::demo

```vue

<template>
	<q-form class="q-form">
		<div>
			<div class="q-form-item">
				<label>活动名称：</label><span><q-input class="q-input" placeholder="请输入"></q-input></span>
			</div>
			<div class="q-form-item">
				<label>活动时间：</label><span><q-date-time class="q-date-time" placeholder="请输入"></q-date-time></span>
			</div>
			<div class="q-form-item">
				<label>活动性质：</label>
				<span>
					<q-checkbox-group 
						class="q-checkbox-group" 
						name="checkboxName" 
						:options="[
							{label: '美食/餐厅线上活动', value: '1'}, 
							{label: '地推活动', value: '2'}, 
							{label: '线下主题活动', value: '3'}, 
							{label: '单纯品牌曝光', value: '4'}
						]" />
				</span>
			</div>
			<div class="q-form-item">
				<label>特殊资源：</label>
				<span>
					<q-radio-group 
						class="q-radio-group" 
						name="radioName" 
						:options="[
							{label: '线上品牌商赞助', value: '1'}, 
							{label: '线下场地免费', value: '2'}
						]" />
				</span>
			</div>
		</div>
	</q-form>
</template>
<style>

.q-form {
	width: 100%;
}
.q-form-item{
	margin-bottom: 10px;
}
.q-input{
	width: 200px;
	height: 28px;
}
.q-date-time{
	width: 200px;
	vertical-align: sub;
}
.q-checkbox-group{
	display: inline-block;
}
</style>
```

:::

### 带操作按钮

:::demo

```vue

<template>
	<q-form class="q-form" showSubmitBtn showResetBtn submitStyle="color: #fff; border-color: #1890ff; background: #1890ff; text-shadow: 0 -1px 0 rgb(0 0 0 / 12%); box-shadow: 0 2px #0000000b;border: 1px solid transparent;" resetStyle="border: 1px solid transparent; box-shadow: 0 2px #00000004;border-radius: 2px; color: #000000d9; border-color: #d9d9d9; background: #fff;">
		<div>
			<div class="q-form-item">
				<label>活动名称：</label><span><q-input class="q-input" placeholder="请输入"></q-input></span>
			</div>
			<div class="q-form-item">
				<label>活动时间：</label><span><q-date-time class="q-date-time" placeholder="请输入"></q-date-time></span>
			</div>
			<div class="q-form-item">
				<label>活动性质：</label>
				<span>
					<q-checkbox-group 
						class="q-checkbox-group" 
						name="checkboxName" 
						:options="[
							{label: '美食/餐厅线上活动', value: '1'}, 
							{label: '地推活动', value: '2'}, 
							{label: '线下主题活动', value: '3'}, 
							{label: '单纯品牌曝光', value: '4'}
						]" />
				</span>
			</div>
			<div class="q-form-item">
				<label>特殊资源：</label>
				<span>
					<q-radio-group 
						class="q-radio-group" 
						name="radioName" 
						:options="[
							{label: '线上品牌商赞助', value: '1'}, 
							{label: '线下场地免费', value: '2'}
						]" />
				</span>
			</div>
		</div>
	</q-form>
</template>
<style>

.q-form {
	width: 100%;
}
.q-form-item{
	margin-bottom: 10px;
}
.q-input{
	width: 200px;
	height: 28px;
}
.q-date-time{
	width: 200px;
	vertical-align: sub;
}
.q-checkbox-group{
	display: inline-block;
}
</style>
```

:::

## Form 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件表单容器数据                              | string  | —               | —      |
| defaultValue | 组件表单容器默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件表单容器是否禁用                           | boolean  | —               | false |
| clearable    | 组件表单容器是否清除                           | boolean  | —               | false |
| type         | 文本框还是表单容器                             | boolean | —               | false  |

## Form DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Form 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Form 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Form 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |