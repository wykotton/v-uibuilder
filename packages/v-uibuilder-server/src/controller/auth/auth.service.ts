import { Injectable } from "@nestjs/common";
import { searchSql } from "@/utils/utils";
import { uiBuilderMapping } from "@/dao/uiBuilderMapping";
import { log } from "../../../conf/log";
import { makeSalt, encryptPassword } from "@/utils/cryptogram";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "@/utils/jwt/constants";

const moment = require("moment");

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * 统一登录接口
   * @param body
   * @returns
   */
  async login(body) {
    try {
      const { username = "", password = "", isSSO = 0, ssoUserId = "" } = body;
      if (isSSO === 0) {
        // UIB用户登录
        if (!username || !password) {
          return { info: { msg: `用户名或密码不能为空` } };
        }
        return this.validateUser(username, password);
      } else {
        // sso用户登录
        if (!ssoUserId) {
          return { info: { msg: `SSO用户id不能为空` } };
        }
        const results = await searchSql(uiBuilderMapping.getSSOUserInfo, [1, ssoUserId]);
        if (results[0]?.id) {
          return this.handleToken(results[0]);
        } else {
          // 不存在就进行自动注册
          const register = await this.register(body);
          const {
            results,
            info: { msg = "" },
          } = register;
          if (msg !== "success") {
            return { info: { msg: `登录失败` } };
          }
          if (results?.id) {
            const userInfo = await searchSql(uiBuilderMapping.getUserInfo, [results.id]);
            return this.handleToken(userInfo[0]);
          } else {
            return { info: { msg: `登录失败` } };
          }
        }
      }
    } catch (error) {
      log.info(error, `登录失败`);
      return { results: error, info: { msg: `登录失败` } };
    }
  }

  /**
   * UIB用户验证
   * @param username
   * @param password
   * @returns
   */
  async validateUser(username: string, password: string) {
    const results = await searchSql(uiBuilderMapping.getUIBUserInfo, [0, username]);
    if (results[0]?.id) {
      const salt = results[0].password_salt;
      const hashPwd = results[0].password;
      if (hashPwd === encryptPassword(password, salt)) {
        return this.handleToken(results[0]);
      } else {
        return { info: { msg: `密码错误!` } };
      }
    } else {
      return { info: { msg: `未找到此用户!` } };
    }
  }

  /**
   * 处理token
   * @param userInfo
   * @returns
   */
  handleToken(userInfo: any) {
    const { token = "", refreshToken = "", expiresIn = "" } = this.certificate(userInfo);
    if (!token || !refreshToken || !expiresIn) {
      return { info: { msg: `用户token创建失败!` } };
    }
    const tempInfo = userInfo;
    Reflect.deleteProperty(tempInfo, "password");
    Reflect.deleteProperty(tempInfo, "password_salt");
    tempInfo.token = token;
    tempInfo.refreshToken = refreshToken;
    tempInfo.expiresIn = expiresIn;
    // 更新最后登录时间
    const loginTime = moment().format("YYYY-MM-DD HH:mm:ss");
    tempInfo.last_login = loginTime;
    searchSql(uiBuilderMapping.updateLastLogin, [loginTime, tempInfo.id]);
    return { results: tempInfo, info: { msg: `success` } };
  }

  /**
   * 创建token
   * @param user
   * @returns
   */
  certificate(user: any) {
    const payload = {
      userId: user.id,
      username: user.username,
    };
    try {
      const token = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: "8h",
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: "48h",
      });
      const expiresIn = new Date(+new Date() + 8 * 60 * 60 * 1000).toISOString();
      return { token, refreshToken, expiresIn };
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  /**
   * 注册
   * @param body
   * @returns
   */
  async register(body) {
    try {
      const { username = "", password = "", isSSO = 0, ssoUserId = "" } = body;
      const createTime = moment().format("YYYY-MM-DD HH:mm:ss");
      if (isSSO === 0) {
        // UIB用户注册
        if (!username || !password) {
          return { info: { msg: `用户名或密码不能为空` } };
        }
        // 检查用户是否存在
        const checkUser = await searchSql(uiBuilderMapping.getUIBUserInfo, [0, username]);
        if (checkUser[0]?.id) {
          return { info: { msg: `用户已存在, 请直接登录!` } };
        }
        const salt = makeSalt(); // 创建密码盐
        const hashPwd = encryptPassword(password, salt); // hash加密
        const results = await searchSql(uiBuilderMapping.saveUserInfo, [
          username,
          hashPwd,
          salt,
          createTime,
          createTime,
          0,
          0,
          "",
        ]);
        if (results?.id) {
          return { info: { msg: `success` } };
        } else {
          return { info: { msg: `注册失败` } };
        }
      } else {
        // sso用户注册
        if (!username || !ssoUserId) {
          return { info: { msg: `SSO用户名或用户id不能为空` } };
        }
        const results = await searchSql(uiBuilderMapping.saveUserInfo, [
          username,
          "",
          "",
          createTime,
          createTime,
          0,
          1,
          ssoUserId,
        ]);
        if (results?.id) {
          return { results, info: { msg: `success` } };
        } else {
          return { info: { msg: `注册失败` } };
        }
      }
    } catch (error) {
      log.info(error, `注册失败`);
      return { results: error, info: { msg: `注册失败` } };
    }
  }

  /**
   * 刷新token
   * @param req
   */
  refreshToken(req) {
    try {
      const { user = {} } = req;
      const { userId = "", username = "" } = user;
      if (!userId || !username) {
        return { code: 401, info: { msg: `token信息有误` } };
      }
      const { token = "", refreshToken = "", expiresIn = "" } = this.certificate({ id: userId, username });
      if (!token || !refreshToken || !expiresIn) {
        return { info: { msg: `用户token创建失败!` } };
      }
      return {
        results: { token, refreshToken, expiresIn },
        info: { msg: `success` },
      };
    } catch (error) {
      log.info(error, `刷新token失败`);
      return { results: error, info: { msg: `刷新token失败` } };
    }
  }

  /**
   * 获取用户主题
   * @param req
   * @returns
   */
  async getTheme(req) {
    try {
      const { user = {} } = req;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `用户id不能为空` } };
      }
      const userInfo = await searchSql(uiBuilderMapping.getUserInfo, [userId]);
      return {
        results: JSON.parse(userInfo[0].theme || "{}"),
        info: { msg: `success` },
      };
    } catch (error) {
      log.info(error, `获取用户主题失败`);
      return { results: error, info: { msg: `获取用户主题失败` } };
    }
  }

  /**
   * 变更用户主题
   * @param req
   * @returns
   */
  async updateTheme(req) {
    try {
      const { user = {}, body = {} } = req;
      const { theme = {} } = body;
      const { userId = "" } = user;
      if (!userId) {
        return { code: 401, info: { msg: `用户id不能为空` } };
      }
      const updateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const results = await searchSql(uiBuilderMapping.updateUserTheme, [JSON.stringify(theme), updateTime, userId]);
      return { results, info: { msg: `success` } };
    } catch (error) {
      log.info(error, `变更用户主题失败`);
      return { results: error, info: { msg: `变更用户主题失败` } };
    }
  }
}
