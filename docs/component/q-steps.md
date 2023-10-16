---
category: Components
type: 数据展示
title: Steps
subtitle: 步骤条
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Timeline.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
  import ("@zzjz/v-component/dist2/assets/q-steps.js");
})

</script>

# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 何时使用

当任务复杂或者存在先后关系时，将其分解成一系列步骤，从而简化任务。

## 代码演示

:::demo

```vue

<template>
  <q-steps></q-steps>
</template>
<style>
</style>
```

:::

## Steps 属性

| 属性              | 说明                      | 类型      | 可选值                       | 默认值     |
|-----------------|-------------------------|---------|---------------------------|---------|
| title           | 标题                      | string  | —                         | —       |
| subtitle        | 子标题                     | string  | —                         | —       |
| description     | 描述                      | string  | —                         | —       |
| titleSlot       | 标题插槽                    | slot    | —                         | —       |
| descriptionSlot | 子标题数据                   | slot    | —                         | —       |
| iconSlot        | 图标插槽                    | slot    | —                         | —       |
| status          | 当前步骤的状态                 | string  | wait,process,finish,error | —       |
| disabled        | 是否禁用                    | boolean | —                         | false   |
| value           | 标题值                     | string  | —                         | —       |
| direction       | 步骤条方向                   | string  | horizontal,vertical       | —       |
| labelPlacement  | 标签放置位置                  | string  | vertical,vertical         | —       |
| status          | 当前步骤的状态                 | string  | wait,process,finish,error | —       |
| current         | 当前步骤                    | number  | —                         | —       |
| initial         | 起始序号                    | number  | —                         | 0       |
| type            | 步骤条类型                   | number  | default,navigation        | default |
| size            | 步骤条类型                   | number  | default,small             | default |
| percent         | 当前步骤进度条                 | number  | —                         | —       |
| responsive      | 当屏幕宽度小于 532px 时自动变为垂直模式 | boolean | —                         | true    |

## Steps DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Steps 消息响应

| 事件名               | 说明        | 参数                |
|-------------------|-----------|-------------------|
| setStepsCurrent   | 设置步骤条当前步骤 | (event: IMessage) |
| setStepsData      | 设置步骤条数据   | (event: IMessage) |
| stepsNext         | 下一步       | (event: IMessage) |
| stepsPrevious     | 上一步       | (event: IMessage) |
| updateStepsStatus | 修改步骤条状态   | (event: IMessage) |

## Steps 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |