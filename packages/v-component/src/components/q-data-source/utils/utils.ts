import { message } from "ant-design-vue";

/**
 * 打印网络请求测试信息
 * @param results
 */
export function logTestInfo(results: any) {
  console.log(
    `%c数据源网络请求测试`,
    "text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 4px 0 #aaa,0 5px 1px rgba(0,0,0,.1),0 0 3px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 2px 3px rgba(0,0,0,.2),0 3px 5px rgba(0,0,0,.25),0 6px 6px rgba(0,0,0,.2),0 10px 10px rgba(0,0,0,.15);font-size:14px;background-color: #8BC2FF;color: #fff;padding: 5px 10px;border-radius: 6px;font-weight: 600"
  );
  console.log(results);
  message.destroy();
  message.info("请在浏览器控制台或网络中查看请求结果");
}

/**
 * 是否为json
 * @param str
 */
export function isJson(str: string) {
  let flag = false;
  try {
    if (typeof JSON.parse(str) === "object") flag = true;
  } catch (e) {
    flag = false;
  }
  return flag;
}
export function findMod(objectStr: any, path: string, val: any) {
  const props = path.split(".");
  let th = "";
  for (let i = 0; i < props.length; i++) {
    th += "['" + props[i] + "']";
  }
  //判断是对象还是字符串
  // const isObj = new Function("objectStr",`return objectStr${th}`);
  let e = new Function();
  e = new Function("{objectStr, val}", `return objectStr${th}=val`);
  // if (typeof isObj(objectStr) == "object") {
  //   e = new Function("{objectStr, val}", `return objectStr${th}=val`);
  // }
  // else if (typeof isObj(objectStr) == "string") {
  //   // e = new Function(objectStr + th + '="' + val + '"');
  //   e = new Function("{objectStr, val}", `return objectStr${th}=val`);
  // }
  e({ objectStr, val });
}
