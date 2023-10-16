---
category: Components
type: 数据录入
title: DateTime
subtitle: 日期选择框
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/DateTime.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import("@zzjz/v-component/dist2/assets/q-select.js");import("@zzjz/v-component/dist2/assets/q-date-time.js");}) 
</script>

# DateTime 日期选择框

输入或选择日期的控件。

## 何时使用

- 当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

### 基本用法
下面几个示例展示了单选框组件的基本用法。

:::demo 

```vue
<template>
	<section class="code-box-demo">
		<q-date-time class="q-date-time" placeholder="请输入"></q-date-time>
	</section>
</template>
<style>
.q-date-time {
	width: 100%;
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
		<q-date-time class="q-date-time" value="2022-12-12" placeholder="请输入"></q-date-time>
	</section>
</template>
<style>
.q-date-time {
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
	<section class="code-box-demo">
		<q-date-time class="q-date-time" disabled value="2022-12-12" placeholder="请输入"></q-date-time>
	</section>
</template>
<style>
.q-date-time {
	width: 100%;
}
</style>
```

:::

### 日期类型
提供选择器，自由切换不同类型的日期选择器，常用于日期筛选场合。

:::demo 

```vue
<template>
  <section class="code-box-demo">
		<q-date-time class="q-date-time" type="datetime-local" />
		<q-date-time class="q-date-time" type="time" />
		<q-date-time class="q-date-time" type="date" />
		<q-date-time class="q-date-time" type="week" />
		<q-date-time class="q-date-time" type="month" />
  </section>
</template>
<style>
.q-date-time {
	width: 100%;
	margin-bottom: 20px
}

</style>
```

:::

### 最大日期
限制日期可选择的最大值。（未实装）

:::demo 

```vue
<template>
  <section class="code-box-demo">
		<q-date-time class="q-date-time" type="date" max="2022-12-27" />
  </section>
</template>
<style>
.q-date-time {
	width: 100%;
	margin-bottom: 20px
}

</style>
```

:::

## DateTime 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 当前日期                                    | string  | —               | —      |
| defaultValue | 默认日期                                    | string  | —               | —      |
| name         | 选项名称                                    | string  | —               | —      |
| type         | 日期类型                                    | string  | —               | —      |
| disabled     | 是否禁用                                    | boolean | —               | false |
| max          | 最大日期                                    | string  | —               | —      |

## DateTime DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## DateTime 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## DateTime 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## DateTime 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |