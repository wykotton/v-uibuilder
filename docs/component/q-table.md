---
category: Components
type: 数据展示
title: Table
subtitle: 表格
cover: https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Table.svg
---

<script lang="ts" setup>
import { onMounted } from "vue";
onMounted(()=>{
	import("@zzjz/v-component/dist2/assets/q-tablely.js");
}) 
</script>

# Table 表格

展示行列数据。

## 何时使用

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 代码演示

:::demo

```vue
<template>
	<q-tablely></q-tablely>
</template>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

## Table 属性

### 表头

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| title        | 表头名称                                    | string  | —               | —      |
| key          | 表头对应key                                 | string  | —               | —      |
| dataIndex    | 表头索引                                    | string  | —               | —      |

### 数据项

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| tdata        | 表格值                                    | array  | —               | —      |

### 操作列

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| title        | 标题                                    | string  | —               | —      |
| fixed        | 锁定                                    | boolean  | —               | —      |
| btn          | 按钮                                    | string  | —               | —      |

### 操作栏

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| visible      | 是否启用                                    | boolean  | —               | —      |
| btn          | 按钮                                        | string  | —               | —      |

### 搜索栏

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| visible      | 是否启用                                    | boolean  | —               | —      |
| value        | 默认值                                      | string  | —               | —      |
| btnTitle     | 按钮文字                                    | string  | —               | —      |
| placeholder  | 占位符                                      | string  | —               | —      |
| func         | 执行函数                                    | string  | —               | —      |

### 分页配置

| 属性         | 说明                                       | 类型    | 可选值          | 默认值 |
| ------------ | ------------------------------------------ | ------- | --------------- | ------ |
| visible      | 是否启用                                    | boolean  | —               | —      |
| current      | 当前页                                      | string  | —               | —      |
| pageSize     | 每页行数                                    | string  | —               | —      |


## Table DOM事件
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| onGetPageData     | 获得分页数据                                                    | (event: CustomEvent) |
| onEditTableData     | 编辑表格数据                                                     | (event: CustomEvent) |
| onDeleteTableData     | 删除表格数据                                                     | (event: CustomEvent) |
| onCustomEvents     | 自定义事件                                                     | (event: CustomEvent) |
| onThrowTableData     | 抛出表格数据                                                     | (event: CustomEvent) |
| onSearchTableData     | 搜索表格                                                     | (event: CustomEvent) |
| onPageChange     | 改变分页                                                     | (event: CustomEvent) |

## Table 消息响应
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| setInfo      | 设置组件数据                                              | (event: IMessage) |
| throwTableData   | 抛出表格数据                                              | (event: IMessage) |
| openAddModal    | 弹出新增模态                                              | (event: IMessage)      |
| PageChange    | 变更分页                                              | (event: IMessage)      |
| SelectionRow    | 选中指定行                                              | (event: IMessage)      |

## Table 生命周期
| 事件名       | 说明                                                     | 参数                 |
| ------------ | -------------------------------------------------------- | -------------------- |
| created      | 创建                                                     | - |
| updated      | 更新                                                     | - |
| destroy      | 销毁                                                     | - |