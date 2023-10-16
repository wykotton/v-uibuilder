import { isNumber, isArray } from "lodash";
// import { getConfigJson } from "../utils";
import knex from "knex";

interface InstanceListType {
  [key: string]: Array<InstanceType>;
}
interface InstanceType {
  id: string;
  instance: any;
  timeout: any;
  config: databaseConfig;
}
interface databaseConfig {
  databaseType: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database;
}

const databaseTypes = ["mysql"];

/**
 * 生成hashid
 * @param {*} hashLength
 */
function createHash(hashLength = 12) {
  // 默认长度 24
  return Array.from(Array(Number(hashLength) || 24), () => Math.floor(Math.random() * 36).toString(36)).join("");
}

class Knex {
  // 数据库实例
  databaseInstance: InstanceListType = {};

  /**
   * 查找是否已创建数据库实例
   * @param config
   */
  findInstance(config: databaseConfig) {
    const { databaseType, host, port, username, password, database } = config;
    let instance: any = null;
    if (this.databaseInstance[databaseType]?.length) {
      const instanceItem = this.databaseInstance[databaseType].find((item: InstanceType) => {
        return (
          item.config.host == host &&
          item.config.port == port &&
          item.config.username == username &&
          item.config.password == password &&
          item.config.database == database
        );
      });
      if (instanceItem?.instance) {
        instance = instanceItem.instance;
        clearTimeout(instanceItem.timeout);
        instanceItem.timeout = setTimeout(async () => {
          await instanceItem.instance.destroy();
          this.removeInstance(instanceItem.config.databaseType, instanceItem.id);
        }, 2 * 60 * 60 * 1000);
      }
    }
    return instance;
  }

  /**
   * 保存已创建数据库实例
   * @param instance
   * @param config
   */
  saveInstance(instance: any, config: databaseConfig) {
    const { databaseType } = config;
    const id = createHash();
    const timeout = setTimeout(async () => {
      await instance.destroy();
      this.removeInstance(databaseType, id);
    }, 2 * 60 * 60 * 1000);
    if (isArray(this.databaseInstance[databaseType])) {
      this.databaseInstance[databaseType].push({
        id,
        instance,
        config,
        timeout,
      });
    } else {
      this.databaseInstance[databaseType] = [
        {
          id,
          instance,
          config,
          timeout,
        },
      ];
    }
  }

  /**
   * 移除已销毁实例
   * @param type
   * @param id
   * @returns
   */
  removeInstance(type: string, id: string) {
    if (!isArray(this.databaseInstance[type])) return;
    const index = this.databaseInstance[type].findIndex((item) => item.id === id);
    if (index !== -1) {
      this.databaseInstance[type].splice(index, 1);
    }
  }

  /**
   * 获取数据库实例
   * @param config
   * @returns
   */
  getDatabaseInstance(config: databaseConfig) {
    const { databaseType } = config;
    if (!databaseType || !databaseTypes.includes(databaseType)) return null;
    // const dbConfig = getConfigJson("./src/utils/knex/db-config.json");
    let databaseInstance: any = null;
    databaseInstance = this.findInstance(config);
    if (databaseInstance) return databaseInstance;
    databaseInstance = this.createDatabaseInstance(config);
    return databaseInstance;
  }

  /**
   * 创建数据库实例
   * @param config
   * @returns
   */
  createDatabaseInstance(config: databaseConfig) {
    const { databaseType, host, port, username, password, database } = config;
    // const dbConfig = getConfigJson("./src/utils/knex/db-config.json");
    let databaseInstance: any = null;
    const knexConfig = {
      client: databaseType,
      connection: {
        host,
        port,
        user: username,
        password,
        database,
      },
    };
    switch (databaseType) {
      case "mysql":
        databaseInstance = knex(knexConfig);
        break;
      default:
        break;
    }
    return databaseInstance;
  }

  /**
   * 获取数据库表数据
   * @param instance
   * @param databaseType
   */
  async getTableData(instance: any, config: Record<string, string>) {
    const { databaseType = "", tableName = "", pagination = false, page = 1, limit = 10 } = config;
    let sqlLimit = Number(limit);
    const sqlOffset = (Number(page) - 1) * sqlLimit;
    let data: any = null;
    switch (databaseType) {
      case "mysql":
        // 限制查询1000条记录
        if (pagination && isNumber(page) && isNumber(limit)) {
          sqlLimit > 1000 ? (sqlLimit = 1000) : void 0;
          data = await instance.select("*").from(tableName).limit(sqlLimit).offset(sqlOffset);
        } else if (!pagination) {
          data = await instance.select("*").from(tableName).limit(1000).offset(0);
        }
        break;
      default:
        break;
    }
    return data;
  }
}

export const knexInstance = new Knex();
