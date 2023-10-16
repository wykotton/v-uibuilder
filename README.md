[TOC]

### 启动

`
前端启动: npm run app:v-uibuilder dev
`
`
后端启动: npm run app:v-uibuilder-server start:dev
`

### 依赖增加
`
pnpm i -F @zzjz/v-uibuilder-server  -w  @nestjs/common@latest
`

### 依赖删除
`
pnpm uninstall -F @zzjz/v-uibuilder-server  -w  @nestjs/common@latest
`

### 增加项目之间的依赖

`
pnpm i @panda/tools -r --filter @panda/server @panda/web
`

### 增加项目之间的依赖删除

`
pnpm uninstall @panda/tools -r --filter @panda/server @panda/web
`

### 提交规范

- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
