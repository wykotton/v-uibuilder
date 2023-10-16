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

### 基本用法

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

### 配置表头

:::demo

```vue
<template>
	<q-tablely :columns="columns"></q-tablely>
</template>
<script lang="ts" setup>
	const columns = [
    {
      title: "表头1",
      key: "name",
      dataIndex: "name",
      type: "text",
      required: true,
      // resizable: true
    },
    {
      title: "表头2",
      key: "age",
      dataIndex: "age",
      type: "number",
      // resizable: true,
    },
    {
      title: "表头3",
      key: "address",
      dataIndex: "address",
      type: "text",
      // resizable: true,
    },
    {
      title: "表头4",
      key: "tags",
      dataIndex: "tags",
      type: "tag",
      mode: "multiple",
      options: [{
        label: "帅气",
        value: "帅气"
      }, {
        label: "开发者",
        value: "开发者"
      }, {
        label: "失败者",
        value: "失败者"
      }, {
        label: "酷",
        value: "酷"
      }, {
        label: "老师",
        value: "老师"
      }],
      // resizable: true,
    }
  ]
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 配置数据

:::demo

```vue
<template>
	<q-tablely :columns="columns" :tdata="tdata"></q-tablely>
</template>
<script lang="ts" setup>

	const columns = [
    {
      title: "时间",
      key: "date",
      dataIndex: "date",
      type: "text",
      // resizable: true,
    },
		{
      title: "姓名",
      key: "name",
      dataIndex: "name",
      type: "text",
      required: true,
      // resizable: true
    },
    {
      title: "地址",
      key: "address",
      dataIndex: "address",
      type: "text",
      // resizable: true,
    }
  ]
	const tdata = [{
		date: "2016-05-02",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1518 弄"
	}, {
		date: "2016-05-04",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1517 弄"
	}, {
		date: "2016-05-01",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1519 弄"
	}, {
		date: "2016-05-03",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1516 弄"
	}]
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 配置操作列

:::demo

```vue
<template>
	<q-tablely :operationcol="operationcol"></q-tablely>
</template>
<script lang="ts" setup>
	const operationcol = {
    title: "操作",
    fixed: false, // 是否锁定列
    btn: [{
      label: "审核", // 按钮文字
      type: "链接", // 按钮风格
      // func: "editHandleFun", // 点击按钮后触发的父组件事件
    }],
  }
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 配置操作栏

:::demo

```vue
<template>
	<q-tablely :operationbar="operationbar"></q-tablely>
</template>
<script lang="ts" setup>
	const operationbar = {
    visible: true,
    type: "默认", // 按钮风格
    btn: [{
      label: "导入", // 按钮文字
      type: "默认", // 按钮风格
    }],
  }
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 配置搜索栏

:::demo

```vue
<template>
	<q-tablely :searchbar="searchbar"></q-tablely>
</template>
<script lang="ts" setup>
	const searchbar = {
    visible: true,
    type: "默认",
    value: "",
    btnTitle: "搜索",
    placeholder: "请输入搜索关键字",
    func: "searchHandleFun"
  }
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 分页配置

:::demo

```vue
<template>
	<q-tablely :columns="columns" :tdata="tdata" :pagination="pagination"></q-tablely>
</template>
<script lang="ts" setup>
const columns = [
    {
      title: "序号",
      key: "index",
      dataIndex: "index",
      type: "text",
      // resizable: true,
    },
		{
      title: "姓名",
      key: "name",
      dataIndex: "name",
      type: "text",
      required: true,
      // resizable: true
    },
    {
      title: "地址",
      key: "address",
      dataIndex: "address",
      type: "text",
      // resizable: true,
    }
  ]
	const tdata = []
	for (let i = 0; i < 500; i++) {
		tdata[i] = {
			index: i+1,
			name: "王小虎",
			address: "上海市普陀区金沙江路 1518 弄"
		}		
	}
	
	const pagination = {
    visible: true,
    data: {
      current: "1",
      pageSize: "10",
      showSizeChanger: true,
      showQuickJumper: true
    }
  }
</script>
<style>
.q-tablely {
	width: 100%;
}
</style>
```

:::

### 默认选中

使用时数据项必须配置相应不重复的 `key` 值，且选中变量  `selectedRowKeys` 为数组类型。

:::demo

```vue
<template>
	<q-tablely :columns="columns" :tdata="tdata" :selectedRowKeys="selectedRowKeys"></q-tablely>
</template>
<script lang="ts" setup>
	const selectedRowKeys = ['3']
	const columns = [
    {
      title: "时间",
      key: "date",
      dataIndex: "date",
      type: "text",
      // resizable: true,
    },
		{
      title: "姓名",
      key: "name",
      dataIndex: "name",
      type: "text",
      required: true,
      // resizable: true
    },
    {
      title: "地址",
      key: "address",
      dataIndex: "address",
      type: "text",
      // resizable: true,
    }
  ]
	const tdata = [{
		key: "1",
		date: "2016-05-02",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1518 弄"
	}, {
		key: "2",
		date: "2016-05-04",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1517 弄"
	}, {
		key: "3",
		date: "2016-05-01",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1519 弄"
	}, {
		key: "4",
		date: "2016-05-03",
		name: "王小虎",
		address: "上海市普陀区金沙江路 1516 弄"
	}]
</script>
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