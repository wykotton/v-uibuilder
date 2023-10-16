import { createPool, PoolConfig } from "mysql";
import { networkInterfaces } from "os";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import * as _ from 'lodash';
const fs = require("fs");
const { port, dbConfig } = getConfigJson('./conf/config.json') as IConfig;

export interface IConfig {
  port: number;
  wsPort: number;
  dbConfig: {
    host: string,
    port: string,
    user: string,
    password: string,
    database: string,
  },
  logConfig: {
    name: string,
    streams: []
  }
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
};

// 动态获取配置
function setConfigJson(pathURL = "./conf/config.json", newVal = {}) {
  try {
    writeFileSync(
      join(process.cwd(), './conf/ui-config.json'),
      JSON.stringify(newVal, null, 2),
    )
  } catch (error) {
    console.log(error);
    return false
  }
  return true;
};

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
        multipleStatements: true
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

/**
* @description: 获取任意长度的随机数字字母组合字符串
* @param {*} len 随机字符串的长度
* @return {*}
*/

function randomString(len: number):string {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return _.sampleSize(charSet, len).toString().replace(/,/g, '');
}
/**
 * 获取文件内容
 * @param  {string} fileName 文件名 file.mtl
 */
 function getFileContent (fileName, encoding) {
  　　 // 指定encoding会返回一个string，否则返回一个Buffer
      return fs.readFileSync(getFullFileName(fileName), { encoding });
  }
/**
 * 获取完整文件路径
 * @param  {string} fileName 文件名 file.mtl
 */
 function getFullFileName (fileName) {
  return join(process.cwd(), fileName)
}

/**
* 删除文件
* @param  {string} fileName 文件名 file.mtl
*/
function delFile (fileName) {
  fs.unlink(fileName, function (err) {
      if (!!err) {
          console.log('删除文件失败：' + fileName);
      }
  });
}
/**
* 删除目录
* @param  {string} fileName 文件名 file.mtl
*/
// async function rmdirasync(filepath) {
//   const stat = await fs.stat(filepath)
//   if (stat.isfile()) {
//     await delFile(filepath)
//   } else {
//     let dirs = await fs.readdir(filepath)
//     dirs = dirs.map(dir => join(filepath, dir))
//     let index = 0;
//     (async function next() {
//       if (index === dirs.length) {
//         await fs.rmdir(filepath)
//       } else {
//         await rmdirasync(dirs[index++])
//         await next()
//       }
//     })()
//   }
// }

async function rmdirasync(filepath) {
  const stat = await fs.stat(filepath)
  if(stat.isfile()) {
    await fs.unlink(filepath)
  }else {
    let dirs = await fs.readdir(filepath)
    dirs = dirs.map(dir => rmdirasync(join(filepath, dir)))
    await Promise.all(dirs)
    await fs.rmdir(filepath)
  }
}

function rmdirpromise(filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, function (err, stats) {
      if (err) reject(err)
      if (stats.isFile()) {
        fs.unlink(filepath, function (err) {
          if (err) reject(err)
          resolve(null)
        })
      } else {
        fs.readdir(filepath, function (err, dirs) {
          if (err) reject(err)
          dirs = dirs.map(dir => join(filepath, dir))
          dirs = dirs.map(dir => rmdirpromise(dir))
          Promise.all(dirs).then(() => {
            fs.rmdir(filepath, resolve)
          })
        })
      }
    })
  })
}


function copy(src, dst){
  const paths = fs.readdirSync(src); //同步读取当前目录
  paths.forEach(function(path){
    const _src = src+'/'+path;
    const _dst = dst+'/'+path;
    fs.stat(_src,function(err, stats){ //stats 该对象 包含文件属性
      if(err)throw err;
      if(stats.isFile()){ //如果是个文件则拷贝
        const readable = fs.createReadStream(_src);//创建读取流
        const writable = fs.createWriteStream(_dst);//创建写入流
        readable.pipe(writable);
      }
    });
  });
}

export { searchSql, setSqlDate, getLocalIP, getConfigJson, getImagesPath, linkDb, setConfigJson, randomString, delFile, rmdirasync, rmdirpromise, copy };
