---
title: Pagination 分页器
lang: zh-CN
---
# Pagination 分页器
分页器组件

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
import("@zzjz/v-component/dist2/assets/q-paginationly.js"); 
}) 
</script>

## 基础用法

:::demo

```vue
<template>
  <q-paginationly class="q-pagination"  current="0" total="1000" page-size="15" ></q-paginationly>
  禁用
  <br/>
  <q-paginationly class="q-pagination"  current="0" total="1000" page-size="15" disabled="true"></q-paginationly>
  显示改变 pageSize
  <br/>
  <q-paginationly class="q-pagination" :current="0" :total="100" :page-size="15"  show-size-changer="true"  :page-size-options="['10', '20', '30', '40']"></q-paginationly>
  显示快速跳转
  <br/>
  <q-paginationly class="q-pagination" :current="0" :total="100" :page-size="15"   show-quick-jumper="true"></q-paginationly>
  简单分页
  <br/>
  <q-paginationly class="q-pagination" :current="0" :total="100" :page-size="15"  simple="true"></q-paginationly>
</template>
<style>
.q-input {
	width: 100%;
}
</style>
```

:::

## 跳转及分页大小选择

通过 `show-size-changer` 属性指定开启pagesize切换功能,`pageSizeOptions`数组控制pagesize选项
通过 `show-quick-jumper`开启快速跳转

:::demo

```vue
<template>
  <q-pagination class="q-pagination"  show-size-changer show-quick-jumper onpageChange="" current="0" total="100" page-size="15" ></q-pagination>
</template>
<style>
.q-input {
  width: 100%;
}
</style>
```

:::



## Pagination 属性

| 属性                | 说明                              | 类型      | 可选值          | 默认值 |
|-------------------|---------------------------------|---------| --------------- | ------ |
| current           | 当前页                             | number  | —  | —   |
| total             | 数据总数                            | number  | —               | —      |
| page-size         | 分页大小                            | number  | —               | —      |
| page-size-options | 分页可选项                           | Array   | —               | —      |
| show-size-changer       | 是否显示分页可选                        | Boolean | —               | —      |
| show-quick-jumper         | 是否显示快速跳转                        | boolean | —               | false  |

## Pagination 事件

| 事件名       | 说明      | 参数                               |
| ------------ |---------|----------------------------------|
| pageSizeChange      | 分页大小变更时 | (event: Event, pageSize(当前分页大小)) |
| pageChange       | 切换页数时   | (event: Event，current(当前页))      |
