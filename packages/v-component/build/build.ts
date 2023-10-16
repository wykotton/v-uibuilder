import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

export function useBuildComponent(componentPath) {
    function componentsLoder(componentPath, dirname = __dirname) {
        const dirArr = readdirSync(componentPath);
        const components: string[] = [];

        return dirArr.map((fileName) => {
            const fillPath = componentPath + "/" + fileName;
            const file = statSync(fillPath);

            if (file.isDirectory()) {
                return componentsLoder(fillPath, dirname);
            }
            // 读取每个文件为buffer存到zip中
            const code = readFileSync(fillPath, { encoding: "utf-8" });

            if (code.includes("customElement")||code.includes("customHasElement")) {
                components.push(fillPath);
            }
            return components;
        }).flat().map((current) => {
            if (typeof current === "object") return current;
            const rootDir = dirname.replace(/\\/g, "/"); 
            const replaceValue = "./" + current.replace(/\\\//g, "/").replace(/\\/g, "/").replace(rootDir, "");
            const lastIndex = replaceValue.lastIndexOf("/");
            const [name] = replaceValue.substring(lastIndex + 1).split(".");

            return { [name]: replaceValue };
        });
    } 

    return componentsLoder(componentPath, join(__dirname, "../")).reduce((pre, cur) => {
        const obj = { ...pre, ...cur };
        return obj;
    }, {})
}