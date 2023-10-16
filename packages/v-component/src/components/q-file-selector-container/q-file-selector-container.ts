import { css, html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
// import { changeProperty, DOMEmit } from "../../types/runtime/decorators/decorators";
// import { booleanTransform, getInnerDropzone } from "../../util/utils";
import { isEqual } from "lodash-es";
import cssIndex from "./index.scss?inline";
import "../q-container-mask/q-container-mask";
import { ComponentModel } from "../../types/runtime/ComponentModel";
import { customHasElement } from "../../types/runtime/decorators/decorators";
import { ISchema, EComponentType, EComponentGroup } from "../../types/runtime/IModelSchema";
// import { IMessage } from "../../types/runtime/IMessage";
// import { enumFilter } from "../../util/dict";
// import { createVueComponent } from "./component";
// import "../q-tree/q-tree";
// import "../q-tablely/q-tablely";
import { fsInit, addFileClick, removeUpload, renameFile, tagMake, delFileClick, tabClick, signleSelectPic, listUploadFiles, filesApi, tagManage, imAndex } from "./file";
import { FilePage, Filelist } from "./IQFileSelectorContainer"
import { staticBaseUrl } from "./constants"
import "../q-button/q-button";
import "../q-input/q-input";
import "../q-select/q-select";
import "../q-pagination/q-pagination";
import "../q-tag/q-tag";
@customHasElement("q-file-selector-container")
export class qFileSelectorContainer extends LitElement {
  static styles = [css`${unsafeCSS(cssIndex)}`];
  /**
   * 挂载节点.
   */
  // @query("#container")
  // container!: HTMLElement;
  /**
     * 数据模型
     */
  componentModel!: ComponentModel;

  /**
   * 组件实例
   */
  // componentInstance: any = null;

  constructor() {
    super();
    this.initModel();
  }

  // 初始化用户
  @property({ type: String })
  public userid = "";

  public orderArr = [
    { label: "↑按名字升序", value: "name" },
    { label: "↑按大小升序", value: "size" },
    { label: "↑按时间升序", value: "time" },
    { label: "↓按名字降序", value: "name_desc" },
    { label: "↓按大小降序", value: "size_desc" },
    { label: "↓按时间降序", value: "time_desc" },   
  ];

  // 文件目录
  @property({ type: String })
  public type = "my"; // my: 我的 | sys:系统的 | other: 其他人的
  // 所属类型
  @property({ type: String })
  public category = "0"; // '0'表示主目录
  // 所属标签
  @property({ type: String })
  public tag = ""; // ''表示无标签
  // 所属类型
  @property({ type: String })
  public mime = "image"; 
  
  /**
   * 数据 filelist
   */
   @property({
    type: Object,
    attribute: false
  })
   filelist:Filelist = {
     my: {
      query: {
        page: 1,
        size: 10,
        type: 'my',
        keywords: '',
        tag: "",
        mime: "image",
        order: "create_time DESC"
      },
      totle: 0,
      list: []
     },
     sys: {
      query: {
        page: 1,
        size: 10,
        type: 'sys',
        keywords: '',
        tag: "",
        mime: "image",
        order: "create_time DESC"
      },
      totle: 0,
      list: []
     }
   }
  @property({ type: Array, attribute: false })
  taglist:any = []
  @property({ type: Array, attribute: false })
  mimelist:any = [{
    actived: true,
    title: "图片",
    key: "image"
  }, {
    actived: false,
    title: "其他",
    key: "other"
  }]
  // 排序变更
  public orderChange(type: string, value: any) {
    console.log(value)
    const order = {
      name: "originalname ASC",
      size: "size ASC",
      time: "create_time ASC",
      name_desc: "originalname DESC",
      size_desc: "size DESC",
      time_desc: "create_time DESC"
    }
    Object.assign(this.filelist[this.type].query, { page: 1, order: order[value] } )
    this.getFiles()
  }
  // 更新列表
  public listUploadFiles(files: FileList) {
    listUploadFiles(files)
  }
  // 分页变更
  pageChange(val:any) {
    this.filelist[this.type].query.page = val.detail.current
    this.getFiles()
  }
  // 获取文件
  getFiles(query: FilePage = this.filelist[this.type].query) {
    Object.assign(query, { tag: this.tag, mime: this.mime } )
    filesApi.getFiles(query).then((res: any) => {
      this.filelist[query.type].list = res.results
      this.filelist[query.type].totle = res.total
      this.requestUpdate("filelist")
    })
  }
  // 获取标签
  getTag(query: {page:number; size: number}) {
    filesApi.getTag(query).then((res: any) => {
      this.taglist = res.results
      this.requestUpdate("taglist")
    })
  }
  // 点击标签
  onClickTag(item:any) {
    console.log(item.actived)
    if (item.actived) item.actived = false
    else item.actived = true
    this.tag = this.taglist.filter((v:any) => v.actived).map((v:any) => v.title).join()
    this.filelist[this.type].query.page = 1
    this.filelist[this.type].query.tag = this.tag
    this.getFiles()
  }
  // 点击后缀
  onClickMime(item:any) {
    if (!item.actived) {
      this.mimelist.map((v:any) => {
        v.actived = false
      })
      item.actived = true
      this.mime = item.key
      this.filelist[this.type].query.page = 1
      this.filelist[this.type].query.mime = this.mime
      this.getFiles()
    }    
  }
  // 搜索
  onSearchKeywords(e: any) {
    console.log(e)
  }
  
  @property({ type: Function })
  removeUpload = removeUpload
  
  @property({ type: Object })
  onFilesApi = filesApi
  @property({ type: Object })
  onTagManage = tagManage
  @property({ type: Object })
  onTagMake = tagMake
  


  // disconnectedCallback(): void {
  //   this.componentInstance.unmount();
  //   super.disconnectedCallback();
  // }

  connectedCallback(): void {
    fsInit()
    super.connectedCallback();
    // @ts-ignore
    this.onload()
    this.getFiles(this.filelist["my"].query)
    // this.getFiles(this.filelist["sys"].query)
    this.getTag({page:1, size: 20})
  }

  // protected updated(): void {
  //   createVueComponent(this);
  // }

  render() {
    // let pageMyHtml = '<span class="current">1</span>'
    // const pageSize
    // for (let i = 0; i < this.filelist[this.type].totle / this.filelist[this.type].query.size; i++) {
    //   const element = array[i];
      
    // }
    console.log(this.taglist)
    return html`
        <div class="q-file-selector_wrapper">
          <div id="fileQueue_chooser"></div>
          <div class="wp-picture-panel-c wp-manage-panel-material-right">
            <div class="wp-manage_panel_block_two overz">
              <div id="pic-manage-tab" class="wp-manage_panel_tab">
                <h2 class="piclibtabs_1 focus" id="my" @click="${tabClick}">我的图片</h2>
                <h2 class="piclibtabs_2" id="sys" @click="${tabClick}">系统图片</h2>
              </div>
              <div class="wp-manage_panel_block_two_c" style="clear:both;overflow:hidden;">
                <div class="wp-picture-panel-top overz">
                  <div class="wp-picture-search">
                    <div class="search_wrapper">
                      <q-button class="add-btn" @click=${addFileClick}>上传</q-button>
                      <q-input id="searchKeywords" value="${this.filelist[this.type].query.keywords}" class="search-ipt" name="keywords" placeholder="搜索：输入文件名，按下回车"></q-input>
                    </div>
                    <div class="sort_by_div">
                      <span>排序：</span>
                      <q-select
                        class="row-item-content"
                        placeholder="选择排序"
                        options=${JSON.stringify(this.orderArr)}
                        value=""
                        @onChange=${(e: any) => {
                          this.orderChange("order", e.detail.value);
                        }}
                      ></q-select>
                    </div>
                    <div class="import_export_div">
                      <span title="导入" class="anticon anticon-import">
                        <input type="file" name="files[]" id="fileImport" @change="${imAndex.importFileClick}" />
                        <svg focusable="false" class="" data-icon="import" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.4 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.3-3.5-7.7-7.7-7.7zM902 476H588v-76c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-76h314c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg></span>
                      <span @click=${imAndex.exportFileClick} title="导出" class="anticon anticon-export"><svg focusable="false" class="" data-icon="export" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.4 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.3-3.5-7.7-7.7-7.7zm18.6-251.7L765 393.7c-5.3-4.2-13-.4-13 6.3v76H438c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112a8 8 0 000-12.6z"></path></svg></span>
                    </div>
                  </div>
                  <div class="mime-list">
                    类型：
                    ${this.mimelist.map((item:any) => {
                      return html`<span class="ant-tag ${item.actived?'ant-tag-has-color':''}" @click="${() => { return this.onClickMime(item) }}">${item.title}</span>`
                    })}
                  </div>
                  <div class="tag-list">
                    标签：
                    <!-- <q-tag text="全部"></q-tag>
                    <q-tag text="全部" color="rgb(64, 158, 255)" effect="dark"></q-tag>
                    <q-tag text="全部"></q-tag> -->
                    ${this.taglist.map((item:any) => {
                      return html`<span class="ant-tag ${item.actived?'ant-tag-has-color':''}" @click="${() => { return this.onClickTag(item) }}">${item.title}</span>`
                    })}
                    <span class="ant-tag" style="background: rgb(255, 255, 255); border-style: dashed;" @click=${tagManage.init}>
                      <span role="img" aria-label="plus" class="anticon anticon-plus">
                      <svg focusable="false" class="" data-icon="tags" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M483.2 790.3L861.4 412c1.7-1.7 2.5-4 2.3-6.3l-25.5-301.4c-.7-7.8-6.8-13.9-14.6-14.6L522.2 64.3c-2.3-.2-4.7.6-6.3 2.3L137.7 444.8a8.03 8.03 0 000 11.3l334.2 334.2c3.1 3.2 8.2 3.2 11.3 0zm62.6-651.7l224.6 19 19 224.6L477.5 694 233.9 450.5l311.9-311.9zm60.16 186.23a48 48 0 1067.88-67.89 48 48 0 10-67.88 67.89zM889.7 539.8l-39.6-39.5a8.03 8.03 0 00-11.3 0l-362 361.3-237.6-237a8.03 8.03 0 00-11.3 0l-39.6 39.5a8.03 8.03 0 000 11.3l243.2 242.8 39.6 39.5c3.1 3.1 8.2 3.1 11.3 0l407.3-406.6c3.1-3.1 3.1-8.2 0-11.3z"></path></svg>
                      </span> 标签管理</span>
                  </div>
                  <!-- <span id="batchSel">
                    按住Ctrl或Shift可多选图片<button disabled="" class="ml10"
                      onclick="javascript:multiSelectPic($('.wp-manage-panel-picture.selected').find('img'))">批量选择</button>
                  </span> -->
                </div>
                <div class="wp-manage_panel_block_two_c_list">
                  <div id="wp-my_panel" style="display: block;">
                    <input type="hidden" name="cur_sortfield" value="ftime">
                    <input type="hidden" name="cur_searchword" value="">
                    <input type="hidden" name="cur_filetype" value="pic">
                    <input type="hidden" name="cur_sortmethod" value="desc">
                    <div>
                      <div class="wp-manage-panel-picture-list overz ${this.filelist[this.type].query.mime+'_mode'}">
                        ${this.filelist[this.type].list.map((item:any) => {
                          return html`
                          <div class="wp-manage-panel-picture imgexplorer" data-path="${staticBaseUrl}${item.url}" data-id="${item.id}" data-name="${item.originalname}">
                            <div class="img">
                              <span class="selectblock"><a href="javascript:;" @click="${(e: Event) => { return signleSelectPic(staticBaseUrl+item.url) }}">选择使用</a></span>
                              <div class="transparent-block">
                                <a href="#" class="img-onlineEdit onlineEdit" title="编辑图片" @click="${() => { return renameFile(item.id, item.originalname) }}">
                                  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M16 512c0 273.932 222.066 496 496 496s496-222.068 496-496S785.932 16 512 16 16 238.066 16 512z m496 368V144c203.41 0 368 164.622 368 368 0 203.41-164.622 368-368 368z"></path></svg>
                                </a>
                                <a href="#" class="img-edit" title="设置分类" @click="${() => { return tagMake.init(item.id) }}">
                                  <svg focusable="false" class="" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path></svg>
                                </a>
                                <a href="#" class="img-delete delete_extra_img" title="删除" @click=${() => { return delFileClick(item.id) }}>
                                  <svg focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                                </a>
                              </div>
                              <img
                                data="${staticBaseUrl}${item.url}"
                                cate="" size="26|34"
                                src="${staticBaseUrl}${item.url}"
                                name="${item.originalname}"
                                title="类型: ${item.ext} 大小: ${item.size} 尺寸: 26 X 34 PX 修改日期: ${item.update_time}">
                            </div>
                            <p class="link" title="鼠标双击修改文件名称">${item.originalname}</p>
                          </div>
                          `
                        })}
                        
                      </div>

                      <div class="wp-manage-panel-picture-page">
                        <q-pagination current="${this.filelist[this.type].query.page}" total="${this.filelist[this.type].totle}" pageSize="${this.filelist[this.type].query.size}" @pageChange="${this.pageChange}"></q-pagination>
                      </div>
                    </div>
                  </div>
                  <div id="wp-sys_panel" style="display: none;"> 
                    <input type="hidden" name="cur_sortfield" value="ftime"> 
                    <input type="hidden" name="cur_searchword" value=""> 
                    <input type="hidden" name="cur_filetype" value="pic"> 
                    <input type="hidden" name="cur_sortmethod" value="desc">
                    <div>
                      <div class="wp-manage-panel-picture-list overz ${this.filelist[this.type].query.mime+'_mode'}">
                      ${this.filelist[this.type].list.map((item:any) => {
                          return html`
                          <div class="wp-manage-panel-picture imgexplorer" data-path="${staticBaseUrl}${item.url}" data-id="${item.id}" data-name="${item.originalname}">
                            <div class="img">
                              <span class="selectblock"><a href="javascript:;" @click="${(e: Event) => { return signleSelectPic(staticBaseUrl+item.url) }}">选择使用</a></span>
                              <div class="transparent-block">
                                <a href="#" class="img-onlineEdit onlineEdit" title="编辑图片" @click="${() => { return renameFile(item.id, item.originalname) }}">
                                  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M16 512c0 273.932 222.066 496 496 496s496-222.068 496-496S785.932 16 512 16 16 238.066 16 512z m496 368V144c203.41 0 368 164.622 368 368 0 203.41-164.622 368-368 368z"></path></svg>
                                </a>
                                <a href="#" class="img-edit" title="设置分类" @click="${() => { return tagMake.init(item.id) }}">
                                  <svg focusable="false" class="" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path></svg>
                                </a>
                                <a href="#" class="img-delete delete_extra_img" title="删除" @click=${() => { return delFileClick(item.id) }}>
                                  <svg focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg>
                                </a>
                              </div>
                              <img
                                data="${staticBaseUrl}${item.url}"
                                cate="" size="26|34"
                                src="${staticBaseUrl}${item.url}"
                                name="${item.originalname}"
                                title="类型: ${item.ext} 大小: ${item.size} 尺寸: 26 X 34 PX 修改日期: ${item.update_time}">
                            </div>
                            <p class="link" title="鼠标双击修改文件名称">${item.originalname}</p>
                          </div>
                          `
                        })}
                      </div>
                      <div class="wp-manage-panel-picture-page">
                        <q-pagination current="${this.filelist[this.type].query.page}" total="${this.filelist[this.type].totle}" pageSize="${this.filelist[this.type].query.size}" @pageChange="${this.pageChange}"></q-pagination>
                      </div>
                    </div>

                  </div>                  
                </div>
              </div>
            </div>

          </div>
        </div>
        `;
  }
  // render() {
  //   // 初始化数据
  //   const div = document.createElement("div");
  //   div.id = "container";
  //   div.className = "q-file-selector-container";
  //   return div;
  // }

  initModel(): void {
    const self = this;
    this.componentModel = new ComponentModel({
      el: this as unknown as HTMLElement,
      model: {
        _iovSchema: {
          get componentName() {
            return "q-file-selector-container";
          },
          get type() {
            return EComponentType.CONTAINER;
          },
          get text() {
            return "文件选择器";
          },
          get group() {
            return [EComponentGroup.BASIC];
          },
          get image() {
            return "";
          },
          get description() {
            return "文件选择器,用于选择和管理文件资源";
          },
          eventSpecification: {
            inputMessage: [],
            outputMessage: []
          },
          optionsView: {
            model: {
              description: "组件model",
              type: "object",
              properties: {
                userid: {
                  type: "string",
                  description: "用户"
                }
              }
            }
          }
        },
        get iovSchema() {
          return this["_iovSchema"];
        },
        set iovSchema(value) {
          if (value === this["_iovSchema"] || isEqual(value, this["_iovSchema"])) {
            return;
          }
          this["_iovSchema"] = value;
        },
        _onMessageMeta: {},
        _onDOMEvent: {},
        _initStyle: "width:680px;height:400px;",
        _onWatchSetting: {},
        _lifeCycle: {
          created: function () {
          },
          updated: function () {
          },
          destroy: function () {
          }
        },
        get userid() {
          return self.userid;
        },
        set userid(value) {
          self.userid = value;
        },
        // get filelist() {
        //   return self.filelist;
        // },
        // set filelist(value) {
        //   self.filelist = value;
        //   self.requestUpdate("filelist")
        // },
        
      } as unknown as ISchema
    });
  }
}
