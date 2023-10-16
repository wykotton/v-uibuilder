import { IQTable } from "./IQTable";

export const component: IQTable = {
  id: "",
  componentName: "q-table",
  type: "表格",
  text: "table",
  group: ["容器"],
  createTime: new Date(),
  image: "",
  initStyle: "",
  description: "",
  eventSpecification: {
    inputEvent: [
      { text: "更改组件数据", eventType: "changeInfo", messageSchema: "", messageDemo: "" }
    ],
    outputEvent: [
      { text: "编辑", eventType: "edit", messageSchema: "", messageDemo: "" },
      { text: "删除", eventType: "delete", messageSchema: "", messageDemo: "" }
    ]
  },
  options: {
    columns: [
      { title: "列名1", dataIndex: "address", key: "1", width: 150 },
      {
        title: "操作",
        key: "operation",
        dataIndex: "operation",
        fixed: "right",
        width: 200,
        name: "编辑"
      }
    ],
    dataSource: [
      { key: 0, name: "表格1", age: 1, address: "表格1" }
    ]
  },
  optionsView: {
    // @ts-ignore
    list: [
      {
        type: "input",
        label: "输入框",
        options: {
          type: "text",
          width: "100%",
          defaultValue: "",
          placeholder: "请输入",
          clearable: false,
          maxLength: 0,
          prepend: "",
          append: "",
          tooptip: "",
          hidden: false,
          disabled: false,
          dynamicHide: false,
          dynamicHideValue: ""
        },
        model: "columns",
        key: "columns",
        rules: [
          {
            required: false,
            message: "必填项",
            trigger: ["blur"]
          }
        ]
      },
      {
        type: "textarea",
        label: "文本框",
        options: {
          width: "100%",
          maxLength: 0,
          defaultValue: "",
          rows: 4,
          clearable: false,
          tooptip: "",
          hidden: false,
          disabled: false,
          placeholder: "请输入",
          dynamicHide: false,
          dynamicHideValue: ""
        },
        model: "dataSource",
        key: "dataSource",
        rules: [
          {
            required: false,
            message: "必填项",
            trigger: ["blur"]
          }
        ]
      },
      {
        type: "textarea",
        label: "文本框",
        options: {
          width: "100%",
          maxLength: 0,
          defaultValue: "",
          rows: 4,
          clearable: false,
          tooptip: "",
          hidden: false,
          disabled: false,
          placeholder: "请输入",
          dynamicHide: false,
          dynamicHideValue: ""
        },
        model: "operation",
        key: "operation",
        rules: [
          {
            required: false,
            message: "必填项",
            trigger: ["blur"]
          }
        ]
      },
      {
        type: "textarea",
        label: "文本框",
        options: {
          width: "100%",
          maxLength: 0,
          defaultValue: "",
          rows: 4,
          clearable: false,
          tooptip: "",
          hidden: false,
          disabled: false,
          placeholder: "请输入",
          dynamicHide: false,
          dynamicHideValue: ""
        },
        model: "pagination",
        key: "pagination",
        rules: [
          {
            required: false,
            message: "必填项",
            trigger: ["blur"]
          }
        ]
      },
      {
        type: "textarea",
        label: "文本框",
        options: {
          width: "100%",
          maxLength: 0,
          defaultValue: "",
          rows: 4,
          clearable: false,
          tooptip: "",
          hidden: false,
          disabled: false,
          placeholder: "请输入",
          dynamicHide: false,
          dynamicHideValue: ""
        },
        model: "scroll",
        key: "scroll",
        rules: [
          {
            required: false,
            message: "必填项",
            trigger: ["blur"]
          }
        ]
      }
    ]
  }
};