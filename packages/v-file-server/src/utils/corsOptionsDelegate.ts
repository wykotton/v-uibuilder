import { Request } from 'express';
import * as _ from 'lodash';
import { getConfigJson } from './utils'
//设置允许访问的域名
const { requestConfig: { allowlist } } = getConfigJson() as any;
const corsOptionsDelegate = (req: Request, callback) => {
  let corsOptions;
  if (allowlist.some(item => { if (_.isRegExp(item)) return item.test(req.header('Origin')); else return item === req.header('Origin'); })) {
    console.log("true", req.header('Origin'))
    // 如果你不需要 Cookie 可以设置为 *
    // credentials 与前端的axios 的withCredentials（XMLHttpRequest.withCredentials）
    // 同时 origin必须设置为访问域 才能正常访问，主要是为了 凭证是 Cookie ，授权标头或 TLS 客户端证书
    corsOptions = { origin: req.header("Origin"), credentials: true };
  } else {
    console.log("false", req.header('Origin'))
    corsOptions = { origin: false }; // disable CORS for this request
  }
  console.log("result", corsOptions)
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default corsOptionsDelegate;
