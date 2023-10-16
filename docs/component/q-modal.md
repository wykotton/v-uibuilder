---
category: Components
type: 容器
title: Modal
subtitle: 对话框
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Modal.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import("@zzjz/v-component/dist2/assets/q-modal.js"); 
import("@zzjz/v-component/dist2/assets/q-text.js"); 
import("@zzjz/v-component/dist2/assets/q-button.js");
})

</script>

# Modal 对话框

模态对话框。

## 何时使用

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作。

## 代码演示

:::demo

```vue
<template>
	<q-modal class="q-modal" :visible="visible" @close="visible=false">
		<q-text class="q-text" text="这是一个弹出容器，里面可以存放组件"></q-text>
	</q-modal>
	<q-button class="q-button" @click="visible=true">
		点击弹出
	</q-button>
</template>
<script lang="ts"> 
import { ref } from 'vue'
export default defineComponent({
	setup() {
		let visible = ref<any>(false)
		return {
			visible
		}
	}
})
</script>
<style>
.q-modal {
	width: 100%;
}
</style>
```

:::

## Modal 属性

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| value        | 组件对话框数据                              | string  | —               | —      |
| defaultValue | 组件对话框默认数据                           | string  | —               | —      |
| name         | 标识                                        | number  | —               | —      |
| disabled     | 组件对话框是否禁用                           | boolean  | —               | false |
| clearable    | 组件对话框是否清除                           | boolean  | —               | false |
| type         | 文本框还是对话框                             | boolean | —               | false  |

## Modal DOM事件

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| click        | 单击                                                     | (event: CustomEvent) |
| dblclick     | 双击                                                     | (event: CustomEvent) |

## Modal 消息响应

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| changeInfo   | 更改组件数据                                              | (event: IMessage) |
| resetInfo    | 重置组件数据                                              | (event: IMessage)      |

## Modal 属性监听

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| value        | 值发生变化                                                | (newVal: any, oldVal: any, context: any) |
| prop         | 传值发生变化                                              | (newVal: any, oldVal: any, context: any) |
| onDOMEvent   | DOM事件被触发时                                           | (newVal: any, oldVal: any, context: any) |

## Modal 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |