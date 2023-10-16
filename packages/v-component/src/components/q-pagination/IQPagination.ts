import { IComponent } from "../../types/runtime/IComponent"
export interface IQPagination extends IComponent {
    options: IQPaginationOptions,
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

export interface IQPaginationOptions {
    current: number
    pageSize: number
    total: number
    numDisplay: number
    numEdge: number
    ellipseText: string
    simplePage?: []
    [key: string]: number | string | Array<string> | undefined
}
