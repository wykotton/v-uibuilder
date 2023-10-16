interface IDataSource {
  // 请求类型
  requestType: string;
  // 数据源ID
  sourceId: string;
  // 名称
  title: string;
  // 自动请求
  autoRequest: {
    value: boolean | string;
    type: string;
  };
  // 是否轮询
  polling: {
    value: boolean | string;
    type: string;
  };
  // 轮询间隔时长
  pollingInterval: {
    value: number | string;
    type: string;
  };
  // 请求超时时间
  timeout: {
    value: number | string;
    type: string;
  };
  // 处理函数
  eventHandler: IRequestEvent[];
  // 轮询定时器对象
  timer: any;
  // 是否开启缓存
  hasCatch: boolean;
  // loading
  loading: {
    value: Array<{ key: string }>;
  };
}

export interface IApiSource extends IDataSource {
  // 请求地址
  requestUrl: {
    value: string;
    type: string;
  };
  // 请求参数
  requestParam: {
    value: IRequestInfo[] | string;
    type: string;
  };
  // 自定义请求头
  requestHeader: {
    value: IRequestInfo[] | string;
    type: string;
  };
  // 请求方式
  requestMethod: {
    value: string;
    type: string;
  };
  // 是否可以跨域
  crossDomain: {
    value: boolean | string;
    type: string;
  };
  // 参数类型
  paramsType: string;
  // raw参数字符
  paramsCode: string;
}

export interface IRequestInfo {
  key: string;
  value: string | boolean;
  type: string;
}

export interface IRequestEvent {
  title: string;
  key: string;
  value: string;
}

export interface IDatabase extends IDataSource {
  // 数据库类型
  databaseType: string;
  // 数据库地址
  host: string;
  // 数据库端口号
  port: number;
  // 数据库用户名
  username: string;
  // 数据库密码
  password: string;
  // 数据库名称
  database: string;
  // 数据库表名
  tableName: string;
  // 是否开启分页
  pagination: boolean;
  // 页数
  page: number;
  // 数据条数
  limit: number;
}
