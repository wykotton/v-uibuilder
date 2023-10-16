import { navigationEnum } from "@/enums/websiteEnum";

export interface websiteOptions {
  projectId: string;
  navigation: navigationEnum;
  theme: string;
  logo: string;
  mainTitle: string;
  showSubheading: boolean;
  subheading: string;
  showFooter: boolean;
  footerText: string;
  fullDisplayTitle: boolean;
  menuCache: boolean;
  treeData: Array<treeDataOptions>;
  openKeys: Array<string>;
  selectedKeys: Array<string>;
  homePage: string;
}

export interface treeDataOptions {
  key: string;
  title: string;
  showIcon: boolean;
  icon: string;
  isNull: boolean;
  contentType: string;
  pageId: string;
  src: string;
  openMode: string;
  children: treeDataOptions[];
}
