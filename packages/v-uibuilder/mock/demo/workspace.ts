import { MockMethod } from "vite-plugin-mock";
import { Random } from "mockjs";
import { resultPageSuccess } from "../_util";
const list = (() => {
  const result: any[] = [];
  for (let index = 0; index < 60; index++) {
    const title = Random.ctitle()
    result.push({
      id: `${index}`,
      title: title,
      createdAt: "@datetime",
      updatedAt: "@datetime",
      preview: Random.image("400x400", Random.color(), Random.color(), title),
    });
  }
  return result;
})();
export default [
  {
    url: "/basic-api/workspace/projects",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    },
  },
  {
    url: "/basic-api/workspace/pages",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    },
  },
  {
    url: "/basic-api/workspace/components",
    timeout: 200,
    method: "get",
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, list);
    },
  },
] as MockMethod[];
