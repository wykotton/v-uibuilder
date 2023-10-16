---
category: Components
type: 数据录入
title: Cascader
subtitle: 级联选择框
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Cascader.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import("@zzjz/v-component/dist2/assets/q-cascader.js");})

</script>

# Cascader 级联选择框

通过鼠标或键盘输入内容，是最基础的表单域的包装。

## 何时使用

+ 需要从一组相关联的数据集合进行选择，例如省市区，公司层级，事物分类等。
+ 从一个较大的数据集合中进行选择时，用多级分类进行分隔，方便选择。
+ 比起 Select 组件，可以在同一个浮层中完成选择，有较好的体验。

## 代码演示

:::demo

```vue

<template>
  <q-cascader></q-cascader>
</template>
<style>
</style>
```

:::

## Cascader 属性

| 属性                | 说明                                      | 类型                                     |     可选值     | 默认值                                                        |
|-------------------|-----------------------------------------|----------------------------------------|:-----------:|------------------------------------------------------------|
| options           | <div style="width: 150pt">级联选择器内容</div> | Array                                  |      —      | —                                                          |
| expandTrigger     | 菜单展开方式                                  | string                                 |      —      | click                                                      |
| value             | 级联选择器值                                  | Array                                  |      —      | —                                                          |
| defaultValue      | 级联选择器默认值                                | Array                                  |      —      | —                                                          |
| getPopupContainer | 弹出层父容器                                  | Function(triggerNode)                  |      —      | () => document.body	                                       |
| displayRender     | 自定义输入框内容                                | "({labels, selectedOptions}) => VNode" |      —      | "labels => labels.join(' / ')"                             |
| fieldNames        | 自定义展示字段                                 | Object                                 |      —      | "{ label: 'label', value: 'value', children: 'children' }" |
| multiple          | 开启多选                                    | boolean                                |      —      | false                                                      |
| maxTagCount       | 展示标签数                                   | Array                                  |      —      | 1                                                          |
| maxTagPlaceholder | 隐藏 tag 时显示的内容                           | v-slot,function(omittedValues)         |      —      | —                                                          |
| allowClear        | 级联选择器默认值                                | boolean                                |      —      | true                                                       |
| autofocus         | 自动聚焦                                    | boolean                                |      —      | false                                                      |
| bordered          | 是否有边框                                   | boolean                                |      —      | false                                                      |
| changeOnSelect    | 单选也生效                                   | boolean                                |      —      | false                                                      |
| disabled          | 禁用                                      | boolean                                |      —      | false                                                      |
| open              | 控制浮层显隐                                  | boolean                                |      —      | false                                                      |
| notFoundContent   | 当下拉列表为空时显示的内容                           | string                                 |      —      | not Found                                                  |
| placeholder       | 输入框占位文本                                 | string                                 |      —      | 请选择                                                        |
| placement         | 浮层预设位                                   | string                                 | 左下,右下,左上,右上 | 右下                                                         |
| size              | 输入框尺寸                                   | string                                 |   大,默认,小    | 默认                                                         |
| tagRenderSlot     | 自定义 tag 内容                              | string                                 |   大,默认,小    | —                                                          |
| dropdownStyle     | 弹出层样式                                   | string                                 |      —      | width: 600px                                               |
| showSearch        | 开启搜索                                    | boolean                                |      —      | false                                                      |
| searchValue       | 搜索值                                     | string                                 |      —      | —                                                          |
| filter            | 搜索过滤                                    | function(inputValue, path): boolean    |      —      | —                                                          |
| limit             | 搜索结果展示数量                                | number                                 |      —      | 50                                                         |
| matchInputWidth   | 搜索结果列表是否与输入框同宽                          | boolean                                |      —      | —                                                          |

## Cascader DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Cascader 消息响应

| 事件名           | 说明        | 参数                |
|---------------|-----------|-------------------|
| changeOptions | 修改级联选择器内容 | (event: IMessage) |
| changeValue   | 改值        | (event: IMessage) |
| resetInfo     | 重设        | (event: IMessage) |
| setInfo       | 赋值        | (event: IMessage) |

## Cascader 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |