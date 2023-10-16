## 标签页

> 用于选项卡切换组件

#### 参数

`data`

- 类型 `Object`

- 实例 [
          { name: `UIB组件`, key: 0 },
          { name: `deepCharts`, key: 1 },
          { name: `快捷键`, key: 2 },
          { name: `帮助文档`, key: 3 },
          { name: `页面Schema`, key: 4 },
       ]

- 作用 用于配置选项卡的基础信息

`activeKey`

- 类型 `Number`

- 实例 0/1

-作用 用于配置初始化显示激活选项卡

`director`

- 类型 `String`

- 实例 `left` / `top`

- 作用 用户配置tab选项卡 的 方向

`color`

- 类型 `String`

- 实例 `#000000` / `pink`

- 作用 用户配置tab选项卡 的 字体颜色

`activeColor`

- 类型 `String`

- 实例 `#000000` / `pink`

- 作用 用户配置tab选项卡 的 激活状态颜色


`width`

- 类型 `String`

- 实例 `20%`

- 作用 用户配置tab选项卡 的 显示宽度
<!-- ![text](../_media/button.gif) -->


`backgoundColor`

- 类型 `String`

- 实例 `red`

- 作用 用户配置tab选项卡 的 背景颜色

`marginRight`

- 类型 `String`

- 实例 `10`/`20`

- 作用 用户配置tab选项卡 的 右外间距

`marginTop`

- 类型 `String`

- 实例 `10`/`20`

- 作用 用户配置tab选项卡 的 上外间距

`marginLeft`

- 类型 `String`

- 实例 `10`/`20`

- 作用 用户配置tab选项卡 的 左外间距

`marginBottom`

- 类型 `String`

- 实例 `10`/`20`

- 作用 用户配置tab选项卡 的 下外间距


`lineHeight`

- 类型 `String`

- 实例 `10`

- 作用 用户配置tab选项卡 的 行高

### 事件

`change` 

- 类型 `Function`

- 实例 @change="handleChange"

- 回调参数 Function(detail) {}