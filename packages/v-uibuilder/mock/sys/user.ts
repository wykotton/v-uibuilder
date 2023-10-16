import { MockMethod } from "vite-plugin-mock";
import { resultError, resultSuccess, getRequestToken, requestParams } from "../_util";
import axios from "axios";

export function createFakeUserList() {
  return [
    {
      userId: "1",
      username: "UIBuilder",
      realName: "UIBuilder",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640",
      desc: "manager",
      password: "123456",
      token: "fakeToken1",
      homePath: "/dashboard/analysis",
      roles: [
        {
          roleName: "Super Admin",
          value: "super",
        },
      ],
    },
    {
      userId: "2",
      username: "test",
      password: "123456",
      realName: "test user",
      avatar: "https://q1.qlogo.cn/g?b=qq&nk=339449197&s=640",
      desc: "tester",
      token: "fakeToken2",
      homePath: "/dashboard/workbench",
      roles: [
        {
          roleName: "Tester",
          value: "test",
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  "1": ["1000", "3000", "5000"],

  "2": ["2000", "4000", "6000"],
};
export default [
  // mock user login
  {
    url: "/login",
    timeout: 200,
    method: "post",
    response: ({ body }) => {
      const { username, password } = body;
      const checkUser = createFakeUserList().find((item) => item.username === username && password === item.password);
      if (!checkUser) {
        return resultError("Incorrect account or password！");
      }
      const { userId, username: _username, token, realName, desc, roles } = checkUser;
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc,
      });
    },
  },
  {
    url: "/getUserInfo",
    method: "get",
    rawResponse: async (request: requestParams & any, res) => {
      const {
        headers: { referer = "" },
      } = request;
      // console.log(request.headers);
      const token = getRequestToken(request);
      if (!token) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(resultError("The corresponding user information was not obtained!")));
        return token;
      }

      let checkUser = createFakeUserList().find((item) => item.token === token) || {};
      if (Object.keys(checkUser).length) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify(resultSuccess(checkUser)));
        return;
      }

      await axios
        .get(`${referer}rest/sso/userinfo?access_token=${token}`)
        .then((response) => {
          checkUser = response.data;
        })
        .catch((err) => {
          checkUser = err.response.data;
        });
      // console.log(checkUser);

      if (Reflect.has(checkUser, "access_token_able") || Reflect.has(checkUser, "refresh_token_able")) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 500;
        res.end(JSON.stringify(resultError("The corresponding user information was not obtained!")));
        return;
      }

      res.setHeader("Content-Type", "application/json");
      res.statusCode = 200;
      res.end(JSON.stringify(resultSuccess(checkUser)));
      return;
    },
  },
  {
    url: "/basic-api/getPermCode",
    timeout: 200,
    method: "get",
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError("Invalid token");
      const checkUser = createFakeUserList().find((item) => item.token === token);
      if (!checkUser) {
        return resultError("Invalid token!");
      }
      const codeList = fakeCodeList[checkUser.userId];

      return resultSuccess(codeList);
    },
  },
  {
    url: "/logout",
    timeout: 200,
    method: "get",
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError("Invalid token");
      const checkUser = createFakeUserList().find((item) => item.token === token);
      // if (!checkUser) {
      //   return resultError('Invalid token!');
      // }
      return resultSuccess(undefined, { message: "Token has been destroyed" });
    },
  },
] as MockMethod[];
