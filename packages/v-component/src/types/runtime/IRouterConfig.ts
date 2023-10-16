export interface IRouterConfig {
  [key: string]: IRouterInfo[];
}

export interface IRouterInfo {
  id: string;
  type: string;
  title: string;
  src: string;
  trigger: Array<string>;
  attribute: Array<string>;
  receive: Array<IReceive>;
  _state: string;
  _srcState: string;
}

export interface IReceive {
  id: string;
  page: string;
  target: string;
  event: Array<string>;
  script: string;
  reply: boolean;
  replyEvents: Array<string>;
  replyScript: string;
  _targetState: string;
  _scriptState: string;
  _replyScriptState: string;
  _current: boolean;
}

export interface IReply {
  page: string;
  target: string;
  event: Array<string>;
  script: string;
  _targetState: string;
  _current: boolean;
}

export interface IRouterTypesSort {
  type: string;
  router: string[];
}

export interface ChangeConfigInfo {
  source: string;
  target: string;
  page: string;
}

export interface EdgeInfo {
  id: string;
  source: string;
  target: string;
}
