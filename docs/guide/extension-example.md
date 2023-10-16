## 元件开发指南

## 开发示例

示例代码中实现了简易版的 TODO List 组件，代码如下以及效果如下：

## 安装创建元件模板工程：

<a href="/assets/component-model/ComponentModel.js" download="ComponentModel.js">ComponentModel.js 依赖文件</a>
<a href="/assets/component-model/ComponentModel.d.ts" download="ComponentModel.d.ts">ComponentModel.d.ts 声明依赖文件</a>

```
## 安装脚手架
pnpm create vite

输入项目名:（例子：）uib-materials

选择lit cli模板作为开发框架

## 创建元件components文件夹 此处按照 my-element 做示例
## 创建common文件夹，引入元件模型依赖。引入 ComponentModel.js依赖
## 创建main.ts

## 配置tsconfig.json:
{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "./types",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "Node",
    "isolatedModules": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": false,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

## 文件目录：
src
    assets/
    common/
        ComponentModel.js
        ComponentModel.d.ts
    components/
        my-element/
            index.ts
    main.ts

## 进入对应目录
cd uib-materials

## 安装依赖
pnpm i

## 安装lodash-es
pnpm i lodash-es @types/lodash-es

## 项目启动
pnpm dev

## 项目访问
访问控制台打印链接。
```

### 实际效果

示例代码中实现了简易版的 TODO List 组件，代码如下以及效果如下：
![/images/extension-example/1676444182818.jpg](/images/extension-example/1676443254737.jpg)

### 代码实现

my-element/
  index.ts文件中加入以下代码
```
import { css, html, LitElement } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { isEqual } from 'lodash-es'
import { ComponentModel } from '../../common/ComponentModel'

interface ToDoItem {
  text: string;
  status: 0 | 1;
}

@customElement('q-my-element')
export class MyElement extends LitElement {
  constructor() {
    super();
    this.initModel();
  }

  componentModel!: ComponentModel;

  @property({ type: Array })
  public list: ToDoItem[] = [];

  @query("#input")
  public inputRef!: HTMLInputElement;

  public submitTodo(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.addTodo();
  }


  public addTodo() {
    if (this.inputRef?.value) {
      const list: ToDoItem[] = [...this.list];
      list.push({
        text: this.inputRef?.value,
        status: 0
      });
      this.list = list;
      this.inputRef.value = '';
      // 元件向总线发送消息事件
      const message = {
        header: {
          src: this.id,
          dst: "",
          srcType: "addTodo",
          dstType: "",
        },
        body: {
          list, target: {
            text: this.inputRef?.value,
            status: 0
          }
        },
      };
      this.componentModel.sendMessage(message);
    }
  }

  public contextmenu(item: MouseEvent, index: number) {
    item.preventDefault();
    item.stopPropagation();
    this.list.splice(index, 1);
    this.requestUpdate();
  }

  public clickFun(_item: MouseEvent, index: number) {
    const newList = this.list;
    if (newList[index]) {
      newList[index].status = newList[index].status === 1 ? 0 : 1;
    }
    this.list = newList;
    this.requestUpdate();
  }


  public render() {
    return (
      html`
      <div class="container">
        <h1 class="caption"> TODO List</h1>
        <form class="container" @submit=${(e: MouseEvent)=>
          this.submitTodo(e)}>
          <input class="input" id="input" placeholder="Enter your todo" />
          <ul class="list">
            ${this.list.map((item, index) => {
            return (
              html`<li class=${item.status === 1 ? "completed" : "normal"} @contextmenu=${(item: MouseEvent)=> {
              this.contextmenu(item,
              index)
              }}
              @click=${(item: MouseEvent) => { this.clickFun(item, index) }}
              >
              ${item.text}
            </li>`
            )
          })}
          </ul>
        </form>
        <div class="tips">鼠标左键单击切换状态、右键单击删除 </div>
      </div>`
    );
  }

  static styles = [
    css`
    .container {
      border: none;
      box-shadow: rgb(223 223 223) 0px 0px 4px 2px;
      width: 100%;
      position: relative;
   }
    .caption {
      font-weight: bold;
      color: rgb(219, 199, 237);
      display: flex;
      justify-content: center;
  }
    .input {
      width: 100%;
      border: none;
      display: block;
      padding: 1rem 2rem;
      outline-color: rgb(219, 199, 237);
      font-size: 1.5rem;
      box-sizing: border-box;
  }
  :host{
    display:block;
    width:500px;
    height:600px;
  }
  .input{

  }
  .caption{
    text-align:center;
  }
  .list li {
    background-color: white;
    border-top: 1px solid rgb(223, 223, 223);
    padding: 1rem 2rem;
    font-size: 1.5rem;
}
  .completed {
      color: rgb(170, 170, 170);
      text-decoration: line-through;
      cursor: pointer;
  }
  .normal {
      background-color: white;
      border-top: 1px solid rgb(223, 223, 223);
      padding: 1rem 2rem;
      font-size: 1.5rem;
  }
  `
  ]

  initModel() {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-my-element";
          },
          get type() {
            return "文本";
          },
          get text() {
            return "我的测试元件";
          },
          get group() {
            return ["UIB原子元件"];
          },
          get image() {
            return "";
          },
          get description() {
            return "我的测试元件。。";
          },
          get version() {
            return "1.0.0";
          },
          eventSpecification: {
            inputMessage: [
              {
                text: "外部添加事项",
                eventType: "externalAddTodo",
                messageSchema: "",
                messageDemo: ""
              }
            ],
            outputMessage: [
              {
                text: "添加事项",
                eventType: "addTodo",
                messageSchema: "",
                messageDemo: ""
              }
            ]
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                count: {
                  type: "number",
                  description: "计算数量",
                },
              }
            }
          }
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
          // 元件响应外部事件
          externalAddTodo: [
            function (e: any) {
              // @ts-ignore 
              self.list({
                text: typeof e.body !== "string" ? JSON.stringify(e.body) : e.body,
                status: 0
              })
            },
          ],
        },
        _onDOMEvent: {
          // 给元件根节点加DOM默认事件
          click: [
            function (e: Event) {
              console.log(e);
            }
          ]
        },
        _initStyle: "height:150px;width:150px;overflow:hidden;",
        _onWatchSetting: {
          // 监听元件属性变更回调
          list: [
            function (newVal: any, oldVal: any, context: any) {
              console.log(newVal, oldVal, context);
            },
          ],
        },
        _lifeCycle: {
          created: function () {
          },
          updated: function () {
          },
          destroy: function () {
          }
        },
      }
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'q-my-element': MyElement
  }
}


```

## 元件打包和部署

```
修改vite.config.ts打包配置

export default defineConfig({
  build: {
    // lib: {
    //   entry: 'src/components/',
    //   formats: ['es'],
    // },
    rollupOptions: {
      input: {
        "q-my-element":"src/components/my-element/index.ts",
      },
      output: {
        format: "esm",
        exports: "auto",
        dir: "dist",
        esModule: true,
        namespaceToStringTag: false,
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})

元件打包命令：

pnpm build

输出产物：
dist/
    assets/
        q-my-element.js
    index.html

注意index.html为手动引入

内容如下：

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>我的物料库</title>
  </head>
  <body>
    <div
    depot="true"
    list='[{
      "componentName":"q-my-element","componentPath":"/dist/assets/q-my-element.js",
      "options":{"text":"我的测试元件"},"group":["UIB原子组件"],"text":"测试元件","type":"文本"}]'
  ></div>
  </body>
</html>



```

> list 清单元素讲解

```

/**
 * 组件仓库协议清单
 */
export interface IQDepotOptions {
    // 组件标签名(zzjz-di-login)
    componentName: string;
    // 组件路径
    componentPath: string;
    // 组件名称
    text: string,
    // 组件预览图
    image: string,
    // 组件类型
    type: string,
    // 组件分组列
    group: string[],
    // 组件描述信息
    description: string,
    // 组件model
    options: ISchema,
}

/**
 * 消息接口
 */
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

/**
 * 组件ISchema
 */
export interface ISchema {
  // 组件ID
  get id(): string;

  set id(value: string);

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

  // 元件从库拖拽到画布的生命周期，有问题，未实装，建议放到组件属性配置中
  set publicAPI(value: IPublicAPI);

  get publicAPI(): IPublicAPI;

  //版本
  //set version(value:string)
  get version(): string;

  [key: string]: any;
}

type ILifeCycle = {
  created: (el: HTMLElement, model: ISchema) => void;
  updated: (el: HTMLElement, model: ISchema, type?: string) => void;
  destroy: () => void;
};
type IEventHandler = (e: IMessage) => void;
type IWatchFn = (newVal: any, oldVal: any, component: any) => void;

export type IWatchSetting = { [key: string]: IWatchFn[] };
export type IEventHandlersEventName = `on${keyof GlobalEventHandlersEventMap}`;
export type IDOMEventMeta = { [key in IEventHandlersEventName]: IEventHandler[] };
export type IMessageMeta = { [key: string]: IEventHandler[] };

/**
 * 元件类型
 */
export enum EComponentType {
  TEXT = "文本",
  FROM = "表单",
  MEDIA = "媒体",
  CONTAINER = "容器",
  CHART = "图元",
  DATASOURCE = "数据源",
  PLUGIN = "插件",
  CUSTOM = "自定义",
}

/**
 * 元件分组
 */
export enum EComponentGroup {
  BASIC = "UIB原子元件",
  CHART = "图表元件",
  DIBUSINESS = "DI业务元件",
}

type IComponentType = keyof typeof EComponentType;
type IComponentGroup = keyof typeof EComponentGroup;

export interface IIOVSchema {
  // 组件名称
  get componentName(): string;

  // 组件类型
  get type(): IComponentType;

  // 组件文本
  get text(): string;

  // 组件分组
  get group(): IComponentGroup[];

  // 组件创建时间
  get createTime(): Date;

  // 组件缺省图片
  get image(): string;

  // 组件描述文本
  get description(): string;

  // 组件特性 ["all","attribute","style","event","moveable"]
  get changeSetter(): string;

  // 版本号
  get version(): string;

  // 事件规范
  eventSpecification: {
    // 输入事件
    inputMessage: IEventSpecificationEvent[];
    // 输出事件
    outputMessage: IEventSpecificationEvent[];
  };
  optionsView: {
    // 输入选项
    model: Customype;
  };
}

// 基础的类型接口，包含 type 和 description 属性
interface BaseType {
  type: string;
  description: string;
  format?: "text" | "textarea" | "date" | "date-time" | "code" | "style" | "custom";
}

// 字符串类型接口，继承基础类型接口，并添加 maxLength, format 和 enum 属性
interface StringType extends BaseType {
  type: "string";
  maxLength?: number;
  enum?: string[];
}

// 数字类型接口，继承基础类型接口
interface NumberType extends BaseType {
  type: "number";
  maximum?: number;
  minimum?: number;
  enum?: number[];
}

// 布尔类型接口，继承基础类型接口
interface BooleanType extends BaseType {
  type: "boolean";
}

// 数组类型接口，继承基础类型接口，并添加 items 属性
interface ArrayType extends BaseType {
  type: "array";
  items: ComponentType;
}

// 对象类型接口，继承基础类型接口，并添加 properties 属性
interface ObjectType extends BaseType {
  type: "object";
  properties: Record<string, ComponentType>;
}

interface Customype extends BaseType {
  type: "object";
  properties: Record<string, ComponentType>;
  setter: string
}

// 元件类型
type ComponentType = StringType | NumberType | BooleanType | ArrayType | ObjectType | Customype;

export interface IEventSpecificationEvent {
  // 显示文本
  text: string;
  // 时间类型
  eventType: string;
  // 时间schema
  messageSchema: string;
  // 示例
  messageDemo: string;
}

type IDragDrop = {
  // 拖拽前触发
  dragstart: (el: string | HTMLElement) => void;
  // 拖拽前、拖拽结束之间，连续触发
  drag: (e: DragEvent, el: HTMLElement) => void;
  // 拖拽结束触发
  dragend: (e: DragEvent, el: HTMLElement) => void;
  // 进入目|标元素触发，相当于mouseover
  dragenter: (e: DragEvent, el: HTMLElement) => void;
  // 进入目|标、离开目|标之间，连续触发
  dragover: (e: DragEvent, el: HTMLElement) => void;
  // 离开目|标元素触发，，相当于mouseout
  dragleave: (e: DragEvent, el: HTMLElement) => void;
  // 在目|标元素上释放鼠标触发
  dropStart: (el: string | HTMLElement) => void;
  // 在目|标元素上释放鼠标触发
  drop: (e: DragEvent, el: HTMLElement) => void;
};

type IMoveable = {
  // 拖拽单目|标前触发
  dragStart: (e: DragEvent) => void;
  // 拖拽单目|标前、拖拽结束之间，连续触发
  drag: (e: DragEvent) => void;
  // 拖拽单目|标结束触发
  dragEnd: (e: DragEvent) => void;
  // 拖拽多目|标前触发
  dragGroupStart: (e: DragEvent) => void;
  // 拖拽多目|标前、拖拽结束之间，连续触发
  dragGroup: (e: DragEvent) => void;
  // 拖拽多目|标后触发
  dragGroupEnd: (e: DragEvent) => void;
  // 调整单目|标大小前触发
  resizeStart: (e: DragEvent) => void;
  // 调整单目|标大小过程中触发
  resize: (e: DragEvent) => void;
  // 调整单目|标大小后触发
  resizeEnd: (e: DragEvent) => void;
  // 调整多目|标大小前触发
  resizeGroupStart: (e: DragEvent) => void;
  // 调整多目|标大小过程中触发
  resizeGroup: (e: DragEvent) => void;
  // 调整多目|标大小后触发
  resizeGroupEnd: (e: DragEvent) => void;
  // 点击单目|标触发
  click: (e: DragEvent) => void;
  // 点击多目|标触发
  clickGroup: (e: DragEvent) => void;
  // 设置moveable可拖拽的target
  setMoveableTarget: (argum: IArguments) => void;
  // 设置Top的target
  setTopTarget: (argum: IArguments) => void;
  // 设置Bottom的target
  setBottomTarget: (argum: IArguments) => void;
  // 获取拖拽时的起始坐标，防止位置闪烁
  getStartCoordinate: (argum: IArguments) => void;
  // 拖拽监听
  dragMoveListener: (argum: IArguments) => void;
  // 单组件拖拽
  dragMove: (argum: IArguments) => void;
  // 多组件拖拽
  dragGroupMove: (argum: IArguments) => void;
  // 调整大小
  resizableListener: (argum: IArguments) => void;
  // 调整单组件大小
  updateResize: (argum: IArguments) => void;
  // 调整多组件大小
  updateResizeGroup: (argum: IArguments) => void;
  // 点击拖拽对象
  clickMoveable: (argum: IArguments) => void;
  // 点击拖拽组
  clickMoveableGroup: (argum: IArguments) => void;
  // 设置被选中组件和可被吸附的组件
  // setElementGuidelines: (argum: IArguments) => void;
  // 对拖拽操作进行前置条件校验
  checkMoveTarget: (argum: IArguments) => void;
  // 对调整大小操作进行前置条件校验
  checkResizeTarget: (argum: IArguments) => void;
  // 有组件通过非直接操作更变大小和位置时，更新辅助矩阵
  // updateMoveable: (argum: IArguments) => void;
};

type IPublicAPI = {
  moveableOptions: MoveableOptions; // 组件moveable配置信息
  dragDrop: IDragDrop; // 元件从库拖拽到画布的生命周期，有问题，未实装，建议放到组件属性配置中
  moveable: IMoveable; // 元件在画布中各种事件的生命周期
};
```

> 输出产物部署

```
将输出产物部署到nginx：
dist/
    assets/
        q-my-element.js
    index.html

可参考部署模板：

server {
    listen 6079;
    server_name Designer;
    index index.html index.htm index.php;
    root /home/UIB/dist;

    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
#        root /home/UIB/designer-dist;
        expires 30d;
    }

    location ~ .*\.(js|css)?$ {
#        root /home/UIB/designer-dist;
        expires 12h;
    }
}

部署完毕后测试访问链接：
ip+prot
例子：http://192.168.21.46:6079/index.html
能正常访问则部署成功。

```

> 将链接配置到系统配置：

![/images/extension-example/1676442774827.jpg](/images/extension-example/1676442774827.jpg)

## 元件使用

![/images/extension-example/1676444182818.jpg](/images/extension-example/1676444182818.jpg)
