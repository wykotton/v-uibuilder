//命令行参数 ：
// -group 组名称
interface TagDefinition {
    componentName:string,
    componentPath:string,
    options:any,
    group:string[],
    text:string,
    type:string
}
const path = require("path")
const fs = require("fs")

const pathPrefix = path.resolve(__dirname,"../dist2/assets/")
const sourcePath = path.resolve(__dirname,"../src/components/")
const getTag = (name:string) => {

}
const parse = () => {
    const components = fs.readdirSync(sourcePath)
    components.forEach(c => {

    })
}

