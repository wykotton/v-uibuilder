export interface ProjectInfo {
  id: number;
  user_id: string | number;
  create_time: string;
  update_time: string;
  project_name: string;
  data: string;
  pageList?: PageInfo[];
}

export interface ComponentInfo {
  id: number;
  user_id: string | number;
  componentName: string;
  create_time: string;
  update_time: string;
  text: string;
  type: string;
  group: string[];
}

export interface PageWarehouseInfo {
  id: number;
  user_id: string | number;
  create_time: string;
  update_time: string;
  name: string;
  type: string;
  group: string[];
}

export interface PageInfo {
  id: number;
  user_id: string | number;
  page_name: string;
  project_id: number;
  create_time: string;
  update_time: string;
}

export interface WebsiteInfo {
  id: number;
  user_id: string | number;
  website_name: string;
  config: string;
  create_time: string;
  update_time: string;
}
