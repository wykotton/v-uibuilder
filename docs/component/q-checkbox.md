<!-- ---
category: Components
type: 数据录入
title: Checkbox
subtitle: 多选框
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Checkbox.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/dist2/assets/q-checkbox-group.js");
	})

</script>

# Checkbox 多选框

多选框。

## 何时使用

- 在一组可选项中进行多项选择时；
- 单独使用可以表示两种状态之间的切换，和 `switch` 类似。区别在于切换 `switch` 会直接触发状态改变，而 `checkbox` 一般用于状态标记，需要和提交操作配合。

## 代码演示

### 基本用法

下面几个示例展示了多选框组件的基本用法。

:::demo

```vue
<template>
  <section class="code-box-demo">
    <q-checkbox-group
      name="checkboxName"
      :options="[
        { label: '多选项1', value: '1' },
        { label: '多选项2', value: '2' },
        { label: '多选项3', value: '3' },
      ]"
    ></q-checkbox-group>
  </section>
</template>
```

:::

### 默认值

默认展示选中值

:::demo

```vue
<template>
  <section class="code-box-demo">
    <q-checkbox-group name="checkboxName" :value="value" :options="options"></q-checkbox-group>
  </section>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const value = ref(["2"]);
const options = [
  { label: "多选项1", value: "1" },
  { label: "多选项2", value: "2" },
  { label: "多选项3", value: "3" },
];
</script>
```

:::

### 禁用状态

通过 `disabled` 属性指定是否禁用 input 组件

:::demo

```vue
<template>
  <section class="code-box-demo">
    <q-checkbox-group name="checkboxName" disabled :value="value" :options="options"></q-checkbox-group>
  </section>
</template>
<script lang="ts" setup> 
import { ref } from "vue";

const value = ref(["2"]);
const options = [
  { label: "多选项1", value: "1" },
  { label: "多选项2", value: "2" },
  { label: "多选项3", value: "3" },
];
</script>
```

:::

### 带有边框

设置`border`属性可以渲染为带有边框的多选框。

:::demo

```vue
<template>
  <section class="code-box-demo">
    <q-checkbox-group name="checkboxName" border :value="value" :options="options"></q-checkbox-group>
  </section>
</template>
<script lang="ts" setup> 
import { ref } from "vue"; 
const value = ref(["2"]);
const options = [
  { label: "多选项1", value: "1" },
  { label: "多选项2", value: "2" },
  { label: "多选项3", value: "3" },
];
</script>
```

:::

## Checkbox 属性

| 属性     | 说明           | 类型    | 可选值            | 默认值 |
| -------- | -------------- | ------- | ----------------- | ------ |
| label    | 选项名称       | string  | —                 | —      |
| value    | 指定选中的选项 | string  | —                 | —      |
| checked  | 是否被选中     | boolean | —                 | false  |
| disabled | 是否禁用       | boolean | —                 | false  |
| border   | 是否有边框     | boolean | —                 | false  |
| size     | 尺寸           | string  | medium/small/mini | medium |

## Checkbox DOM 事件

| 事件名   | 说明 | 参数                 |
| -------- | ---- | -------------------- |
| click    | 单击 | (event: CustomEvent) |
| dblclick | 双击 | (event: CustomEvent) |

## Checkbox 消息响应

| 事件名     | 说明         | 参数              |
| ---------- | ------------ | ----------------- |
| setInfo    | 设置组件数据 | (event: IMessage) |
| changeInfo | 更改组件数据 | (event: IMessage) |
| resetInfo  | 重置组件数据 | (event: IMessage) |

## Checkbox 属性监听

| 事件名     | 说明             | 参数                                     |
| ---------- | ---------------- | ---------------------------------------- |
| value      | 值发生变化       | (newVal: any, oldVal: any, context: any) |
| onDOMEvent | DOM 事件被触发时 | (newVal: any, oldVal: any, context: any) |

## Checkbox 生命周期

| 事件名  | 说明 | 参数 |
| ------- | ---- | ---- |
| created | 创建 | -    |
| updated | 更新 | -    |
| destroy | 销毁 | -    | -->
