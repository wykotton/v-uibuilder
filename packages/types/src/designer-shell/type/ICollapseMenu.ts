export interface CollapseMenuData {
  title: string;
  key: string;
  children?: CollapseMenuData[];
  icon?: string;
  moreChildren?: CollapseMenuData[];
}
