import { createPool, PoolConfig } from "mysql";
import { networkInterfaces } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
const { port, dbConfig } = getConfigJson("./conf/config.json") as IConfig;

export interface IConfig {
  port: number;
  wsPort: number;
  dbConfig: {
    host: string;
    port: string;
    user: string;
    password: string;
    database: string;
  };
  logConfig: {
    name: string;
    streams: [];
  };
}

/**
 * win本地开发
 * 根据本地地址切换数据库
 */

let pool = null;
console.log(`START`);
console.log(`当前数据库：`, dbConfig, `http://${getLocalIP()}:${port}/`);
async function searchSql($sql, params): Promise<any> {
  const MYSQL_TYPE: PoolConfig = dbConfig as any;
  if (!pool) {
    pool = createPool(MYSQL_TYPE);
  }
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
        return;
      }
      try {
        const queryInfo = connection.query($sql, params, (error, result) => {
          connection.release();
          if (error) {
            console.log(error, `sql`);
            reject(error);
          }
          if (result && result.insertId) result.id = result.insertId;
          resolve(result);
        });
        // console.log(queryInfo.sql);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

/**
 * sql事务
 * @param sqlArr
 * @returns
 */
export function execTransaction(sqlArr): Promise<any> {
  const MYSQL_TYPE: PoolConfig = dbConfig as any;
  if (!pool) {
    pool = createPool(MYSQL_TYPE);
  }
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        return reject(err);
      }
      connection.beginTransaction((err) => {
        if (err) {
          connection.release(); // 释放链接
          return reject("开启事务失败");
        }
        // 将所有需要执行的sql封装为数组
        const promiseArr = sqlArr.map(({ sql, values }) => {
          return new Promise((sqlResolve, sqlReject) => {
            connection.query(sql, values, (sqlErr, result) => {
              if (sqlErr) {
                return sqlReject(sqlErr);
              }
              sqlResolve(result);
            });
          });
        });
        // Promise调用所有sql，一旦出错，回滚，否则，提交事务并释放链接
        Promise.all(promiseArr)
          .then((arrResult) => {
            // 所有sql语句都执行成功，进行事务提交
            connection.commit((commitErr) => {
              if (commitErr) {
                console.log("提交事务失败:" + commitErr);
                // 事务回滚
                connection.rollback(function (err) {
                  if (err) console.log("回滚失败：" + err);
                  connection.release();
                });
                return reject(commitErr);
              }
              connection.release();
              resolve(arrResult);
            });
          })
          .catch((err) => {
            connection.rollback(() => {
              console.log("sql运行失败, 进行事务回滚: " + err);
              connection.release();
            });
            reject(err);
          });
      });
    });
  });
}

/**
 * 设置sql日期
 */

function setSqlDate(dateTime) {
  if (!dateTime) return 0;
  return Math.floor(dateTime / 1000);
}
/**
 * 获取ip
 */
function getLocalIP() {
  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (const item of iface) {
      if (item.family === "IPv4" && item.address !== "127.0.0.1" && !item.internal) {
        return item.address;
      }
    }
  }
  return "";
}

// 动态获取配置
function getConfigJson(pathURL = "./conf/config.json") {
  const configPath = join(process.cwd(), pathURL);
  const isConfigExist = existsSync(configPath);
  let jsonConfig = {};
  if (isConfigExist) {
    const fileInfo = readFileSync(configPath, "utf8");
    jsonConfig = JSON.parse(fileInfo);
  }
  return jsonConfig;
}

// 动态获取配置
function setConfigJson(pathURL = "./conf/config.json", newVal = {}) {
  try {
    writeFileSync(join(process.cwd(), "./conf/ui-config.json"), JSON.stringify(newVal, null, 2));
  } catch (error) {
    console.log(error);
    return false;
  }
  return true;
}

/**
 * 获取图片
 * @returns json
 */
const getImagesPath = async (name = "") => {
  const imagePath = join(process.cwd(), `./public/images/${name}`);
  console.log(imagePath);
  const isConfigExist = existsSync(imagePath);
  let jsonConfig = {};
  if (isConfigExist) {
    jsonConfig = await readFileSync(imagePath);
  }
  return jsonConfig;
};

class Deferred {
  promise: any = null;
  resolve: any = null;
  reject: any = null;
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

let connection;

function createConnection(sqlConf) {
  connection = createConnection(sqlConf);
}

function queryTable(tablename, fn) {
  const userModSql = `SELECT * from ${tablename}`;
  connection.query(userModSql, fn);
}

/**
 * mysql连接是否在线
 */
function iSconnect() {
  if (connection && !connection._connectCalled) {
    connection.connect();
  }
}

/**
 * 关闭当前mysql连接
 */
function connectionEnd() {
  if (connection && connection._connectCalled) {
    connection.end();
  }
}
function linkDb(data) {
  const defer = new Deferred();
  if (data.host && data.port && data.user && data.password && data.database && data.tablename) {
    try {
      const sqlParam = {
        ...data,
        multipleStatements: true,
      };
      let schema;
      createConnection(sqlParam);
      iSconnect();
      queryTable(data.tablename, function (err, res) {
        if (err) {
          defer.reject("error");
          return;
        } else {
          schema = res;
          defer.resolve({ schema });
          connectionEnd();
        }
      });
    } catch (e) {
      defer.reject("error");
    }
  } else {
    defer.reject("paramError");
  }
  return defer.promise;
}

export { searchSql, setSqlDate, getLocalIP, getConfigJson, getImagesPath, linkDb, setConfigJson };
