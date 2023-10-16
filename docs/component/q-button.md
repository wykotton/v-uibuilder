---
category: Components
type: 数据录入
title: Button
subtitle: 按钮
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Button.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-button.js");})

</script>

# Button 按钮

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## 代码演示

:::demo

```vue
<template>
	<q-button class="q-button">
		按钮
	</q-button>
</template>
<style>
</style>
```

:::

## Button 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| text         | 按钮显示文字                                | string  | —               | —      |
| plain        | 按钮plain                                   | boolean  | —               | —      |
| circle       | 是否为圆形                                   | boolean  | —               | —      |
| icon         | 按钮图标                                    | string  | —               | false |
| name         | 选项名称                                    | string  | —               | false |
| disabled     | 是否禁用                                    | boolean | —               | false  |

## Button DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Button 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| clickTrigger | 触发按钮点击事件                                          | (event: IMessage) |
| click        | 点击                                                     | (event: IMessage) |

## Button 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |

## Button 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |