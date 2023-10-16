import { IPageName } from "./public";

export interface IMaterialData {
  page: IPageName;
  data: Record<string, any>;
}
