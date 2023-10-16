export interface IAttributeConfig {
  [key: string]: IAttributeInfo[];
}
export interface IAttributeInfo {
  id: string;
  type: string;
  title: string;
  target: string;
  attribute: string;
  bound: IBound;
  _state: string;
  _targetState: string;
}
export interface IBound {
  id: string;
  target: string;
  attribute: string;
  script: string;
  _targetState: string;
}
export interface IRelationship {
  selectedKey: string;
  src: string;
  target: string;
  bindKey: string;
  handleFn: string;
}
