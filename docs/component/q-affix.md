---
category: Components
type: 导航
title: Affix
subtitle: 固钉
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Affix.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{import ("@zzjz/v-component/dist2/assets/q-affix.js");})

</script>

# Affix 固钉

将页面元素钉在可视范围。

## 何时使用

当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。

页面可视范围过小时，慎用此功能以免遮挡页面内容。

## 代码演示

### 基础用法

:::demo

```vue
<template>
  <div id="affix-wrapper">
    <div id="affix-content">
      <q-affix target="#affix-content" affix-offset-top="40">
        <button>固钉</button>
      </q-affix>
    </div>
  </div>
</template>
<script setup>
const options = [
  {
    path: "",
    AffixName: "Home",
    href: "",
    children: [],
  },
  {
    path: "",
    AffixName: "Application Center",
    href: "",
    children: [
      {
        AffixName: "Application List",
        href: "",
        path: "",
        children: [],
      },
    ],
  },
  {
    path: "",
    AffixName: "An Application",
    href: "",
    children: [],
  },
];
</script>
<style>
#affix-wrapper {
  height: 200px;
  overflow: auto;
}

#affix-content button {
  line-height: 1.5715;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: 0 2px #00000004;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  touch-action: manipulation;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  border-radius: 2px;
  color: #000000d9;
  border-color: #d9d9d9;
  background: #fff;
}
</style>
```

:::

## Affix 属性

| 属性           | 说明                                | 类型   | 可选值 | 默认值 |
| -------------- | ----------------------------------- | ------ | ------ | ------ |
| target         | 设置 Affix 需要监听其滚动事件的元素 | string | —      | —      |
| offsetBottom   | 距离窗口底部达到指定偏移量后触发    | number | —      | 40     |
| affixOffsetTop | 距离窗口顶部达到指定偏移量后触发    | number | —      | 0      |

## Affix DOM 事件

| 事件名   | 说明 | 参数                 |
| -------- | ---- | -------------------- |
| click    | 单击 | (event: CustomEvent) |
| dblclick | 双击 | (event: CustomEvent) |

## Affix 生命周期

| 事件名  | 说明 | 参数 |
| ------- | ---- | ---- |
| created | 创建 | -    |
| updated | 更新 | -    |
| destroy | 销毁 | -    |
