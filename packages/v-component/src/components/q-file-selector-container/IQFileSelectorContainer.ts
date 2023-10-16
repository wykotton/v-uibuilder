export type FilePage = {
  page: number;
  size: number;
  type: string;
  keywords: string;
  tag: string;
  mime: string;
  order: string;
}

export type FileData = {
  query: FilePage;
  totle: number;
  list: Array<any>;
}

export interface Filelist {
  my: FileData;
  sys: FileData;
}