---
title: 扩展UIBuilder
lang: zh-CN
aside: false
---

# 扩展UIBuilder
元件作为UIBuilder最重要的资产，使之灵活扩展显得尤为重要，以下详细介绍UIBuilder从元件开发到如何接入的过程。

## 元件介绍
元件作为UIBuilder开发应用的最小可复用单元，是构建应用的关键因子。其只对外暴露配置项，用户无需感知其内|部实现；UIBuilder拥有丰富元件，以及可扩展能力。而庞大多样的元件通过配置文件动态注册到UIBuilder元件库中。以达到适配不同类型用户打造不同应用场景APP的需求。

### 元件资产配置

UIBuilder中的物料需要进行一定的配置和处理，才能让用户在UIBuilder中使用起来。这个过程中，需要一份一份配置文件，也就是资产包。资产包文件中，针对每个物料定义了它们在低代码编辑器中的使用描述。

资产包配置如：
```javascript
{
  "componentName":"q-text",
  "componentPath":"http://localhost:3000/v-component/dist2/assets/q-text.js",
  "options":{"text":"文本组件1"},
  "group":["UIB原子组件"],
  "text":"文本",
  "type":"文本"
}
```

在UIBuilder中，我们可以看到，元件库面板中的元件被分隔成了各种类型和组，元件以集合的形式提供给UIBuilder的，而资产包正是这些组件构成集合的形式。 定义它的 Interface，如下：

```javascript
// 消息IMessage
export interface IMessage {
    header: {
        // 发起点
        src: string,
        // 发起类型和iovSchema中inputMessage与outputMessage相匹配
        srcType: string,
        // 目|标点
        dst: string,
        // 目|标类型和iovSchema中inputMessage与outputMessage相匹配
        dstType: string,
        // 转换函数
        fn?: (messagebody: IMessage) => any,
        reply?: {
            resolve: (messagebody: IMessage) => any,
            reject: (messagebody: IMessage) => any
        },
    },
    body: any
}

// 结构ISchema
export interface ISchema {
  // 组件ID
  get id(): string;

  // 组件样式
  get initStyle(): string;

  set initStyle(value: string);

  // 组件输入输出schema信息
  get iovSchema(): IIOVSchema;

  // 组件自定义消息事件
  get onMessageMeta(): IMessageMeta;

  set onMessageMeta(value: IMessageMeta);

  // 组件内|部dom事件
  get onDOMEvent(): IDOMEventMeta;

  set onDOMEvent(value: IDOMEventMeta);

  // 组件监听设置
  get onWatchSetting(): IWatchSetting;

  set onWatchSetting(value: IWatchSetting);

  // 组件自定义属性设置器(注:接收一个webcomponent组件的实例负责渲染完成属性设置)
  get attributeSetting(): ISchema;

  set attributeSetting(value: ISchema);

  // 生命周期
  set lifeCycle(value: ILifeCycle);

  get lifeCycle(): ILifeCycle;

  // 组件状态(注:运行时还是设计时,主要给设计时使用防止鼠标事件被组件捕获)
  set contextType(value: boolean);

  get contextType(): boolean;

  //版本
  //set version(value:string)
  get version(): string;

  [key: string]: any;
}

// 组件IComponent
export interface IComponent {
    model?: ISchema,
    onMessage(message: IMessage): void;
    sendMessage(message: IMessage): Promise<any>;
}
```

最终形成了我们看到的元件库面板，如下图：
![](/images/how-to-extend-uib/0.png)

这份资产包里的物料是我们内|部沉淀出的，你可以通过参考这套元件资产包体验引擎提供的搭建、配置能力。并最终开发出自己的元件和元件包。

### 元件物料描述配置
在低代码平台中，用户是不同的，有可能是开发、测试、运营、设计，也有可能是销售、行政、HR 等等各种角色。他们大多数不具备专业的前端开发知识，对于低代码平台来说，我们使用组件的流程如下：

1.  用户通过拖拽/选择组件，在画布中看到组件；
2.  选中组件，出现组件的配置项；
3.  修改组件配置项；
4.  画布更新生效。

`当我们选中一个组件，我们可以看到面板右侧会显示组件的配置项。` 
![](/images/how-to-extend-uib/1.png)
`它包含以下内容：`

1.  属性： 描述组件的基础信息，通常包含包信息、组件名称、标题、描述等。
2.  样式： 描述组件的样式信息，通常包含包布局、文字、背景、位置、边框等。
3.  事件： 描述组件的事件信息，通常包含包DOM事件、消息响应、属性监听、生命周期等。

具体详细介绍，请参见导航 [组件](/component/q-text.html)来详细了解一个元件在UIBuilder中可被配置的内容。

## 元件开发

### 元件创建和命名
在开发UIBuilder元件之前，先准备好一份元件模板，可参看 `packages\v-component\src\components\` 目录下的元件，复制一份，另存并重命名为自己将要开发的元件名字，以小写字母q开头后接中横线-和你的元件名称，全部为小写字母。

### 元件开发要素
UIBuilder元件采用的Web Component是基于lit库来快速构建的，从代码结构上分为样式、模板和结构模型三部分，其中结构模型尤为关键，它诠释了元件基本结构、初始化样式、属性、消息、事件、监听、声明周期以及各个值的读写状态等。

> 样式在 styles静态变量中定义

```javascript
static styles = css`
  :host {
    display: block;
  }
  p {
    margin: 0;
    word-break: break-all;
  }
`;
```

> 模板在 render 函数中定义

```javascript
render() {
  return html`<div></div>`
}
```

> 模型在 initModel 函数中定义

```javascript
{
    _iovSchema: {
      get componentName() {
        return "q-text";
      },
      get type() {
        return EComponentType.TEXT;
      },
      get text() {
        return "文本组件";
      },
      get group() {
        return [EComponentGroup.BASIC];
      },
      get image() {
        return "";
      },
      get description() {
        return "文本组件,可以编写文字信息";
      },
      get version() {
        return "1.0.0";
      },
      eventSpecification: {
        inputMessage: [
          {
            text: "自定义组件接收消息",
            eventType: "customMessage",
            messageSchema: "",
            messageDemo: "",
          },
        ],
        outputMessage: [
          {
            text: "组件点击数据",
            eventType: "click",
            messageSchema: "",
            messageDemo: "",
          },
        ],
      },
      optionsView: {
        model: {
          description: "组件model",
          type: "object",
          properties: {},
        },
      },
    },
    get iovSchema() {
      return this["_iovSchema"];
    },
    set iovSchema(value) {
      if (value === this["_iovSchema"] || isEqual(value, this["_iovSchema"])) {
        return;
      }
      this["_iovSchema"] = value;
    },
    _onMessageMeta: {
      // 自定义消息
      customMessage: [ 
        function (e: IMessage) {},
      ],
    },
    _onDOMEvent: {
      click: [
        function (e: Event) {
          console.log(e);
        },
      ],
      dblclick: [
        function (e: Event) {
          console.log(e, "dblclick");
        },
      ],
    },
    _initStyle: "height:150px;width:150px;",
    _onWatchSetting: {
      prop: [
        function (newVal: any, oldVal: any, context: any) {
          console.log(newVal, oldVal, context);
        },
      ],
      text: [
        function (newVal: any, oldVal: any, context: any) {
          console.log(newVal, oldVal, context);
        },
      ], 
      onDOMEvent: [
        function (newVal: any, oldVal: any, context: any) {
          console.log(newVal, oldVal, context, "onDOMEvent");
        },
      ],
    },
    _lifeCycle: {
      created: function () {
        console.log("created");
      },
      updated: function () {
        console.log("updated");
      },
      destroy: function () {
        console.log("destroy");
      },
    },
    _eventInterception: {}, 
  }
```

> 组件状态管理使用内置的@state与@property实现。

我们组件库的目录结构如下：

```
v-component  
├── demo.html                         // 组件库物料引入清单  
├── src                               // 组件源码  
│   ├── components                    // 组件包目录
│   │   ├── q-text                    // 【必选】  
│   │   │   └── q-text.ts             // 【必选】元件主文件  
│   │   │   └── IQText.ts             // 【必选】元件TS定义文件  
│   │   │   └── index.scss            // 【必选】元件样式文件  
```

## 如何接入

### 开发阶段
可以把你开发的元件主文件引入组件库物料清单 `packages\v-component\demo2.html` 文件中

```html
<div depot="true" list='[{
  "componentName":"q-text",
  "componentPath":"http://localhost:3000/v-component/src/components/q-text/q-text.ts",
  "options":{"text":"文本组件"},
  "group":["UIB原子组件"],
  "text":"文本",
  "type":"文本"
}]'></div>
```
### 产品阶段
将组件编译打包到dist2目录，再修改 `packages\v-component\demo2.html` 文件

```html
<div depot="true" list='[{
  "componentName":"q-text",
  "componentPath":"http://localhost:3000/v-component/dist2/assets/q-text.js",
  "options":{"text":"文本组件"},
  "group":["UIB原子组件"],
  "text":"文本",
  "type":"文本"
}]'></div>
```