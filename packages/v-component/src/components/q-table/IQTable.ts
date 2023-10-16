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

// export interface IQTableOptions {
//     columns: Array<ColumnType>
//     dataSource: Array<{ [key: string]: any }>
//     customHeaderStyle?: string
//     customRowStyle?: string
//     rowClassName?: (_record: object, index: number) => any
//     toolbar?: {
//         toolbarStyle?: string
//         toolbarHtml: () => TemplateResult
//     }
// }

export type Key = number | string;
export type AlignType = "left" | "center" | "right";
export type FixedType = "left" | "right" | boolean;
export interface ColumnType {
    title?: any;
    key?: Key;
    class?: string;
    className?: string;
    fixed?: FixedType;
    align?: AlignType;
    customRender?: Function;
    width?: string
    [key: string]: any;
}
