---
category: Components
type: 导航
title: Breadcrumb
subtitle: 面包屑
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Breadcrumb.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-breadcrumb.js");})

</script>

# Breadcrumb  面包屑

显示当前页面在系统层级结构中的位置，并能向上返回。

## 何时使用

当系统拥有超过两级以上的层级结构时；
当需要告知用户『你在哪里』时；
当需要向上导航的功能时。

## 代码演示

### 基础用法

:::demo

```vue
<template>
  <q-breadcrumb :bread-data="options"></q-breadcrumb>
</template>
<script setup>
  const options = [
    {
      path: "",
      breadcrumbName: "Home",
      href: "",
      children: []
    },
    {
      path: "",
      breadcrumbName: "Application Center",
      href: "",
      children: [
        {
          breadcrumbName: "Application List",
          href: "",
          path: "",
          children: []
        }
      ]
    },
    {
      path: "",
      breadcrumbName: "An Application",
      href: "",
      children: []
    },
  ]
</script>
```

:::



## Breadcrumb 属性

| 属性               | 说明   | 类型     | 可选值                       | 默认值          |
|------------------|------|--------|---------------------------|--------------|
| breadcrumbName           | 显示标题 | string | —                         | — |
| href      | 跳转地址 | string | —                         | —            |
| path | 路由地址 | string | —                         | —            |
| children      | 滚动容器 | Array  | —               | —         |


## Breadcrumb DOM事件

| 事件名      | 说明  | 参数                   |
|----------|-----|----------------------|
| click    | 单击  | (event: CustomEvent) |
| dblclick | 双击  | (event: CustomEvent) |

## Breadcrumb 消息响应

| 事件名                 | 说明        | 参数                |
|---------------------|-----------|-------------------|
| click   | 点击事件 | (event: IMessage) |
| setValue   | 设置组件数据 | (event: IMessage) |
| resetValue   | 重置组件数据 | (event: IMessage) |
| updateValue   | 更新组件数据 | (event: IMessage) |

## Breadcrumb 生命周期

| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |