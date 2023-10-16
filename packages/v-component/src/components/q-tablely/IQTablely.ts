import { IComponent } from "../../types/runtime/IComponent"
export interface IQTable extends IComponent {
    // options: IQTableOptions,
    optionsView: {
        // 利用动态表单机制描述的options的设置设定
        // 动态表单
        list: [
        ]
    },
    eventSpecification: {
        inputEvent: [
            { text: "更改组件数据", eventType: "changeInfo", messageSchema: "", messageDemo: "" }
        ],
        outputEvent: [
            { text: "编辑", eventType: "edit", messageSchema: "", messageDemo: "" },
            { text: "删除", eventType: "delete", messageSchema: "", messageDemo: "" }
        ]
    }
}

export type Key = number | string;
export type AlignType = "left" | "center" | "right";
export type FixedType = "left" | "right" | boolean;
export type OperationBar = {
    visible: boolean;
    type: string;
    btn: Array<any>;
}
export type SearchBar = {
    visible: boolean;
    type: string;
    value: string;
    btnTitle: string;
    placeholder: string;
    func: string;
}
export type OperationCol = {
    title: string;
    enable: boolean;
    fixed: boolean;
    btn: Array<any>;
}
export type Pagination = {
    visible: boolean;
    data: {
        current: number;
        pageSize: number;
        showSizeChanger: boolean;
        showQuickJumper: boolean;
    }
}
export type Common = { // 执行指令
    openAddModal: boolean
}
export type FormData = {
    config: {
        size: string;
        layout: string; // 'horizontal'|'vertical'|'inline'
        labelCol: number;
        wrapperCol: number;
      };
      data: any;
      list: Array<any>;
}
export type Options = {
    label: string;
    value: string | number | Array<any>;
}
export type FormItemData = {
    name: string;
    prop: string;
    type: string;
    mode?: string;
    placeholder?: string;
    required?: boolean | Array<any>;
    message?: string;
    options?: Array<Options>;
}

export type Appearance = {
    striped: { // 斑马线
        enable: boolean;
        color: string;
    };
    bordered: boolean; // 线框
    hSplitline: { // 横分割线
        enable: boolean;
        color: string;
    };
    vSplitline: { // 竖分割线
        enable: boolean;
        color: string;
    };
    text: {
        headcolor: string;
        headbgcolor: string;
        bodycolor: string;
        bodybgcolor: string;
    };
    hoverbg: string; // hover背景
    size: string; // 紧凑度 default | middle | small
    bg: boolean; // 原装背景
}

export interface comData {
    columns: Array<any>;
    // tdata: Array<any>;
    operationbar: OperationBar;
    searchbar: SearchBar;
    operationcol:OperationCol;
    // pageEnable?: boolean;
    loading: false;
    // pagination: Pagination;
    // common: Common;
    selectedRowKeys?: Array<string|number>;
    appearance: Appearance;
}
