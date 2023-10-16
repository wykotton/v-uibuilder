import { staticBaseUrl } from "./constants"
import { OnClick } from "moveable";
import { RoxyFilemanConf, RoxyUtils } from "./utils"
// import $ from "jquery";
const comDomName = "q-file-selector-container"
// 全局弹出消息层
const cocoMessage = window["cocoMessage"]
// const $ = jQuery
let uploadFileList:any[] = [];
// 展示待上传列表
function showUploadList(files: any[]){
  const filesPane = $('#uploadFilesList');
  filesPane.html('');
  clearFileField();
  for(let i = 0; i < files.length; i++){
    filesPane.append('<div class="fileUpload"><div class="fileName">'+files[i].name+' ('+RoxyUtils.FormatFileSize(files[i].size)+')<span class="progressPercent"></span><div class="uploadProgress"><div class="stripes"></div></div></div><a class="removeUpload" onclick="removeUpload(' + i + ')"></a></div>');
  }
  if(files.length > 0){
    // @ts-ignore
    $('#btnUpload').button('enable');
  } else{
    // @ts-ignore
    $('#btnUpload').button('disable');
  }
    
}
// 清除待上传列表
function clearFileField(selector?:any){
  if(!selector)
    selector = '#fileUploads';
  try{
    $(selector).val('');
    // $(selector).val(null);
  }
  catch(ex){}
}
// 查找上传节点
function findUploadElement(i:number){
  return $('#uploadFilesList .fileUpload:eq(' + (i)+ ')');
} 
// 更新上传进度
function updateUploadProgress(e:ProgressEvent, i:number){
  const el = findUploadElement(i);
  let percent = 99;
  if (e.lengthComputable) {
    percent = Math.floor((e.loaded / e.total) * 100);
  }
  if(percent > 99)
    percent = 99;
  el.find('.uploadProgress').css('width', percent + '%');
  el.find('.progressPercent').html(' - ' + percent + '%');
}
// 上传完成
function uploadComplete(e:ProgressEvent, i:number){
  uploadFinished(e, i, 'ok');
}
// 上传错误
function uploadError(e:ProgressEvent, i:number){
  setUploadError(i);
  uploadFinished(e, i, 'error');
}
// 设置上传错误
function setUploadError(i:number){
  const el = findUploadElement(i);
  el.find('.uploadProgress').css('width', '100%').addClass('uploadError').removeClass('uploadComplete');
  el.find('.progressPercent').html(' - <span class="error">错误</span>');
}
// 设置上传成功
function setUploadSuccess(i:number){
  const el = findUploadElement(i);
  el.find('.uploadProgress').css('width', '100%').removeClass('uploadError').addClass('uploadComplete');
  el.find('.progressPercent').html(' - 100%');
  if (i === $('#uploadFilesList .fileUpload').length - 1){
    // @ts-ignore
    $('#dlgAddFile').dialog('close');
  }  
}
// 取消上传
function uploadCanceled(e:ProgressEvent, i:number){
  uploadFinished(e, i, 'error');
}
// 上传完成
function uploadFinished(e:any, i:number, res:string){
  const el = findUploadElement(i);
  let httpRes = null as any;
  try{
    httpRes = JSON.parse(e.target.responseText);
  }
  catch(ex){}
  
  if((httpRes && httpRes.res == 'error') || res != 'ok'){
    res = 'error';
    setUploadError(i);
  }
  else{
    res = 'ok';
    setUploadSuccess(i)
  }
    
  el.attr('data-ulpoad', res);
  checkUploadResult();
}
// 检查上传结果
function checkUploadResult(){
  const all = $('#uploadFilesList .fileUpload').length;
  const completed = $('#uploadFilesList .fileUpload[data-ulpoad]').length;
  // const success = $('#uploadFilesList .fileUpload[data-ulpoad="ok"]').length;
  if(completed == all){
     //$('#uploadResult').html(success + ' files uploaded; '+(all - success)+' failed');
     uploadFileList = [];
    //  上传完成刷新列表
    //  const d = Directory.Parse($('#hdDir').val());
    //  d.ListFiles(true);
    const qfsDom = document.querySelector(comDomName) as HTMLElement
    qfsDom["getFiles"]()
    // @ts-ignore
     $('#btnUpload').button('disable');
  }
}
// 文件上传
function fileUpload(f:any, i:number){
  
  const http = new XMLHttpRequest();
  const fData = new FormData();
  const el = findUploadElement(i);
  el.find('.removeUpload').remove();
  fData.append("action", 'upload');
  fData.append("method", 'ajax');
  fData.append("filecategory", $('#filecategory').attr('value') || "");
  fData.append("filetype", $('#filetype').attr('value') || "");
  fData.append("filetag", $('#filetag').attr('value') || "");
  fData.append("file[]", f);
  http.upload.addEventListener("progress", function(e:ProgressEvent){updateUploadProgress(e, i);}, false);
  http.addEventListener("load", function(e:ProgressEvent){uploadComplete(e, i);}, false);
  http.addEventListener("error", function(e:ProgressEvent){uploadError(e, i);}, false);
  http.addEventListener("abort", function(e:ProgressEvent){uploadCanceled(e, i);}, false);
  http.open("POST", RoxyFilemanConf.UPLOAD, true);
  http.setRequestHeader("Accept", "*/*");
  // xhr.setRequestHeader('Content-Type', '值')
  http.setRequestHeader("Authorization", `Bearer ${sessionStorage.getItem('uibToken')}`)
  // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJ1c2VybmFtZSI6InJvb3QiLCJpYXQiOjE2NzUzMzkxNzIsImV4cCI6MTY3NTM2Nzk3Mn0.dv7eZEJm507qUoEWXZ_Aj-Z5PiozoUo9gGmIK66PaQg
  
  http.send(fData);
}
// 添加文件
function addFile(){

  // clickFirstOnEnter('dlgAddFile');
  $('#uploadResult').html('');
  clearFileField();
  const dialogButtons = {};
  dialogButtons["Upload"] = {id:'btnUpload', text: "上传", disabled:true, click:function(){
    if(!$('#fileUploads').val() && (!uploadFileList || uploadFileList.length == 0))
      alert("请选择文件上传");
    else{
      if(window.FormData && window.XMLHttpRequest && window.FileList && uploadFileList && uploadFileList.length > 0){
        for(let i = 0; i < uploadFileList.length; i++){
          fileUpload(uploadFileList[i], i);
        } 
      }
      else{
        document.forms['addfile'].action = RoxyFilemanConf.UPLOAD;
        document.forms['addfile'].submit();
      }
    }
  }};
  

  dialogButtons["取消"] = function(){
    // @ts-ignore
    $('#dlgAddFile').dialog('close');
  };
  // @ts-ignore
  $('#dlgAddFile').dialog({title:"上传文件",modal:true,buttons:dialogButtons,width:400});
}
// 重命名
export function renameFile(id:string, f: string){
  // var f = getSelectedFile();
  // if(!f)
  //   return;
  // clickFirstOnEnter('pnlRenameFile');
  // $('#txtFileName').val(f.name);
  // const imgexplorer = $(e.target).parents('.imgexplorer')
  // const id = imgexplorer.data('id')
  // const f = imgexplorer.find('p.link').text()
  const fArr = f.split('.')
  let fExt = ''
  let fname = f
  if (fArr.length > 1) {
    fExt = '.'+fArr.slice(-1)
    fname = fArr.slice(0,-1).join('.')
  }
  $('#txtFileName').val(fname);
  const dialogButtons = {};
  dialogButtons["修改"] = function(){
    const newName = $.trim(String($('#txtFileName').val()));
    if(!newName)
      alert("请输入文件名");
    else {
      const originalname = $('#txtFileName').val() + fExt
      filesApi.modFiles(id, { originalname }).then((res) => {
        const qfsDom = document.querySelector(comDomName) as HTMLElement
        qfsDom["getFiles"]()
        // @ts-ignore
        $('#pnlRenameFile').dialog('close');
      })
    }
  };
  // @ts-ignore
  dialogButtons["取消"] = function(){$('#pnlRenameFile').dialog('close');};
  // @ts-ignore
  $('#pnlRenameFile').dialog({title:"修改文件名",modal:true,buttons:dialogButtons});
  // if(f.name.lastIndexOf('.') > 0)
  //   RoxyUtils.SelectText('txtFileName', 0, f.name.lastIndexOf('.'));
}
// 上传文件列表
export function listUploadFiles(files: FileList){
  if(!window.FileList) {
    // @ts-ignore
    $('#btnUpload').button('enable');
  }
  else if(files.length > 0) {
    uploadFileList = [];
    addUploadFiles(files);
  }
}
// 添加上传文件
function addUploadFiles(files: FileList){
  for(let i = 0; i < files.length; i++)
    uploadFileList.push(files[i]);
  showUploadList(uploadFileList);
}
// 删除上传
export function removeUpload(i:number){
  const el = findUploadElement(i);
  el.remove();
  try{
    uploadFileList.splice(i, 1);
    showUploadList(uploadFileList);
  }
  catch(ex){
    //alert(ex); 
  }
}
// 重置上传列表
function ResizeLists(){
  const wdom = $(window) as any
  const fileActions = $('#fileActions .actions') as any
  const bottomLine = $('.bottomLine') as any
  const tmp = wdom.innerHeight() - fileActions.outerHeight() - bottomLine.outerHeight();
  $('.scrollPane').css('height', tmp);
}
// 切换显示容器
function switchView(t:string){

}
// 禁止删除操作
function removeDisabledActions(){
  if(RoxyFilemanConf.CREATEDIR == ''){
    $('#mnuCreateDir').next().remove();
    $('#mnuCreateDir').remove();
    $('#btnAddDir').remove();
  }
  if(RoxyFilemanConf.DELETEDIR == ''){
    $('#mnuDeleteDir').prev().remove();
    $('#mnuDeleteDir').remove();
    $('#btnDeleteDir').remove();
  }
  if(RoxyFilemanConf.MOVEDIR == ''){
    $('#mnuDirCut').next().remove();
    $('#mnuDirCut').remove();
  }
  if(RoxyFilemanConf.COPYDIR == ''){
    $('#mnuDirCopy').next().remove();
    $('#mnuDirCopy').remove();
  }
  if(RoxyFilemanConf.COPYDIR == '' && RoxyFilemanConf.MOVEDIR == ''){
    $('#mnuDirPaste').next().remove();
    $('#mnuDirPaste').remove();
  }
  if(RoxyFilemanConf.RENAMEDIR == ''){
    $('#mnuRenameDir').next().remove();
    $('#mnuRenameDir').remove();
    $('#btnRenameDir').remove();
  }
  if(RoxyFilemanConf.UPLOAD == ''){
    $('#btnAddFile').remove();
  }
  if(RoxyFilemanConf.DOWNLOAD == ''){
    $('#mnuDownload').next().remove();
    $('#mnuDownload').remove();
  }
  if(RoxyFilemanConf.DOWNLOADDIR == ''){
    $('#mnuDownloadDir').next().remove();
    $('#mnuDownloadDir').remove();
  }
  if(RoxyFilemanConf.DELETEFILE == ''){
    $('#mnuDeleteFile').prev().remove();
    $('#mnuDeleteFile').remove();
    $('#btnDeleteFile').remove();
  }
  if(RoxyFilemanConf.MOVEFILE == ''){
    $('#mnuFileCut').next().remove();
    $('#mnuFileCut').remove();
  }
  if(RoxyFilemanConf.COPYFILE == ''){
    $('#mnuFileCopy').next().remove();
    $('#mnuFileCopy').remove();
  }
  if(RoxyFilemanConf.COPYFILE == '' && RoxyFilemanConf.MOVEFILE == ''){
    $('#mnuFilePaste').next().remove();
    $('#mnuFilePaste').remove();
  }
  if(RoxyFilemanConf.RENAMEFILE == ''){
    $('#mnuRenameFile').next().remove();
    $('#mnuRenameFile').remove();
    $('#btnRenameFile').remove();
  }
}
// 拖拽文件
function dropFiles(e:DragEvent, append?: boolean){
  if(e && e.dataTransfer && e.dataTransfer.files){
    addFile();
    if(append)
      addUploadFiles(e.dataTransfer.files);
    else
      listUploadFiles(e.dataTransfer.files);
  }
  else
    addFile();
}
// 关闭菜单
function closeMenus(el?:any){
  if(!el || el == 'dir')
    $('#menuDir').fadeOut();
  if(!el || el == 'file')
    $('#menuFile').fadeOut();
}
// function initSelection(filePath:string){
//   let hasSelection = false, fileSelected = true;
//   if(!filePath)
//     filePath = getPreselectedFile();
//   if(!filePath && RoxyUtils.ToBool(RoxyFilemanConf.OPEN_LAST_DIR)){
//     filePath = getLastDir();
//     fileSelected = false;
//   }
//   if(filePath){
//     var p = (fileSelected? RoxyUtils.GetPath(filePath): filePath);
//     var d = tmp = Directory.Parse(p);
//     do{
//       if(tmp){
//         tmp.Expand(true);
//         hasSelection = true; 
//       }
//       tmp = Directory.Parse(tmp.path);
//     }while(tmp);
    
//     if(d){
//       d.Select(filePath);
//       hasSelection = true; 
//     }
//   }
//   if(!hasSelection)
//     selectFirst();
// }
// 初始化
export function fsInit() {
  $(function(){
    // 加载文件LIST
    // let d = new Directory();
    // d.LoadAll();
    $('#wraper').show();
    
    // 初始化选中
    // window.setTimeout('initSelection()', 100);
  
    // RoxyUtils.Translate();
    $('body').click(function(){
      closeMenus();
    });
    
    let viewType = RoxyUtils.GetCookie('roxyview');
    if(!viewType)
      viewType = RoxyFilemanConf.DEFAULTVIEW;
    if(viewType)
      switchView(viewType);
      
    ResizeLists();
    // @ts-ignore
    $(".actions input").tooltip({track: true});
    $( window ).resize(ResizeLists);
    
    document.oncontextmenu = function() {return false;};
    removeDisabledActions();
    $('#copyYear').html(new Date().getFullYear()+'');
    if(RoxyFilemanConf.UPLOAD && RoxyFilemanConf.UPLOAD != ''){
      // let dropZone = document.getElementById('fileActions') as HTMLElement;
      // dropZone.ondragover = function () { return false; };
      // dropZone.ondragend = function () { return false; };
      // dropZone.ondrop = function (e) {
      //   e.preventDefault();
      //   e.stopPropagation();
      //   dropFiles(e);
      // };
      
      const dropZone = document.getElementById('dlgAddFile') as HTMLElement;
      dropZone.ondragover = function () { return false; };
      dropZone.ondragend = function () { return false; };
      dropZone.ondrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropFiles(e, true);
      };
    }
    // 监听搜索回车
    // searchKeywords
    const qfsDom = document.querySelector(comDomName) as HTMLElement
    const qfsDomShadowRoot = qfsDom.shadowRoot as ShadowRoot 
    const qfsDomSearch = $(qfsDomShadowRoot.children).find('#searchKeywords')
    if (qfsDomShadowRoot) qfsDomSearch.keydown((event) => {
      const tdom = event.target as HTMLInputElement
      if (event.keyCode == 13) {
        qfsDom["getFiles"]({ ...qfsDom["filelist"][qfsDom["type"]].query, ...{
          page: 1,
          size: 10,
          keywords: tdom.value,
          tag: qfsDom["tag"]
        } })
      }
    })
    if(getFilemanIntegration() == 'tinymce3'){
      try {
        $('body').append('<script src="js/tiny_mce_popup.js"><\/script>');
      }
      catch(ex){}
    }
  });
  // filesApi.getFiles()
  window.onbeforeunload = function() {
    const d = (window.opener ? window.opener : window.parent);
    // const sFn = RoxyUtils.GetUrlParam("closed")
    const sFn = RoxyUtils.GetUrlParam("wid")
    if (sFn && typeof d["q-file-selector"][sFn]?.closed === "function") d["q-file-selector"][sFn]?.closed()
    // if (sFn && typeof d[sFn] === "function") d[sFn]("close")
  }
}
// 集成文件主体
function getFilemanIntegration(){
  let integration = RoxyUtils.GetUrlParam('integration');
  if(!integration)
    integration = RoxyFilemanConf.INTEGRATION;
    
  return integration.toLowerCase();
}
// tab点击
export function tabClick(e:OnClick) {
  // @ts-ignore
  const _this = this
  const tDom = $(e.target)
  if(tDom.hasClass('focus')) return
  else {
    _this.type = e.target.id
    const qfsDom = document.querySelector(comDomName) as HTMLElement
    qfsDom["getFiles"]()
    tDom.addClass('focus').siblings().removeClass('focus')
    tDom.parents('.wp-manage_panel_block_two').find(`#wp-${_this.type}_panel`).show().siblings().hide()
  }
}
// 点击添加文件
export function addFileClick() {
  // @ts-ignore
  const _this = this
  $('#filetype').val(_this.type)
  $('#filecategory').val(_this.category)
  $('#filetag').val(_this.tag)
  $('#uploadResult').html('');
  showUploadList([]);
  addFile();
}
// 点击删除文件
export function delFileClick(id:string) {
  // const id = $(e.target).parents('.imgexplorer').data('id')
  filesApi.delFiles({ids: [id]}).then((res) => {
    console.log(res)
    const qfsDom = document.querySelector(comDomName) as HTMLElement
    qfsDom["getFiles"]()
  })
}
// 获取选中文件
export function getSelectedFile() {
  let a = null as any;
  if ($(".imgexplorer.selected").length > 0) {
      a = $(".imgexplorer.selected").attr("data-path")
  }
  return a
}
// 单选文件
export function signleSelectPic(url:string) {
  const d = (window.opener ? window.opener : window.parent);
  const sFn = RoxyUtils.GetUrlParam("wid")
  if (sFn && typeof d["q-file-selector"][sFn]?.selected === "function") {
    // d[sFn](url)
    d["q-file-selector"][sFn]?.selected(url)
    window.close();
  }
  // const sdom = d.document.getElementById(sId)
  // if (sdom) sdom.value = $(e.target).parents('.imgexplorer').data('path');
}
// 多选文件
export function multiSelectPic(e:any) {
  console.log(e)
  const d = (window.opener ? window.opener : window.parent);
  const sdom = RoxyUtils.GetUrlParam("input")
  if (sdom) d.document.getElementById(sdom).value = getSelectedFile();
}

// 获取列表
export const filesApi = {
  getFiles(query: {page:number; size: number; keywords:string; tag:string;}) {
    return new Promise((resolve, reject) => {
      $.get(RoxyFilemanConf.FILESLIST, query).then((res) => {
        console.log(res)
        resolve(res.data)
      })
    })
  },
  delFiles(params: {ids:string[];}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : RoxyFilemanConf.DELETEFILE,
        type : "DELETE",
        data :  params,
        success : function(res) {
          cocoMessage.success("删除成功！", 2000);
          resolve(res.data)
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("删除失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  modFiles(id:string, params: {originalname?:string;tag?:string}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : `${RoxyFilemanConf.RENAMEFILE}/${id}`,
        type : "PATCH",
        data :  params,
        success : function(res) {
          cocoMessage.success("修改成功！", 2000);
          resolve(res.data)
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("修改失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  addTag( params: {title:string;}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : RoxyFilemanConf.ADDTAG,
        type : "POST",
        data :  params,
        success : function(res) {
          if (res.data.info.msg === "fail") {
            reject(res)
            cocoMessage.error(res.data.results, 2000);
          } else {
            resolve(res.data)
            cocoMessage.success("添加成功！", 2000);
          }
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("添加失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  getTag(query: {page:number; size: number;}) {
    return new Promise((resolve, reject) => {
      $.get(RoxyFilemanConf.TAGLIST, query).then((res) => {
        console.log(res)
        resolve(res.data)
      })
    })
  },
  modTag(id:string, params: {originalname:string;}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : `${RoxyFilemanConf.MODTAG}/${id}`,
        type : "PATCH",
        data :  params,
        success : function(res) {
          cocoMessage.success("修改成功！", 2000);
          resolve(res.data)
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("修改失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  delTag(params: {ids:string[];}) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : RoxyFilemanConf.DELETETAG,
        type : "DELETE",
        data :  params,
        success : function(res) {
          cocoMessage.success("删除成功！", 2000);
          resolve(res.data)
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("删除失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  importFiles(e: any) {
    console.log(e)
    const fielDom = $(e.target)
    const files = fielDom[0].files
    if(files.length <= 0) {
      return alert('请选择文件后再上传')
    }
    console.log('ok')
    const fd = new FormData()
    fd.append('file[]',files[0])
    return new Promise((resolve, reject) => {
      $.ajax({
        method: 'POST',
        url: RoxyFilemanConf.IMPORT,
        data: fd,
        processData: false,
        contentType: false,
        success: (res) => {
          cocoMessage.success("导入成功！", 2000);
          fielDom.val('')
          const qfsDom = document.querySelector(comDomName) as HTMLElement
          qfsDom["getFiles"]()
          resolve(res.data)
        },
        error : (xhr, textStatus, errorThrown ) => {
          cocoMessage.error("导入失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
  exportFiles(params: any) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url : RoxyFilemanConf.EXPORT,
        type : "POST",
        data :  params,
        success : function(res) {
          cocoMessage.success("导出成功！", 2000);
          resolve(res.data)
        },
        error : function(xhr, textStatus, errorThrown ) {
          cocoMessage.error("导出失败！", 2000);
          reject(textStatus)
        }
      })
    })
  },
}
// 标签管理
export const tagManage = {
  init() {
    tagManage["query"] = {
      page: 1,
      size: 20
    }
    tagManage.getTag()
    const dialogButtons = {};
    // @ts-ignore
    dialogButtons["关闭"] = function(){$('#dlgManageTag').dialog('close');};
    // @ts-ignore
    $('#dlgManageTag').dialog({title:"标签管理",modal:true,buttons:dialogButtons});
  },
  getTag() {
    filesApi.getTag(tagManage["query"]).then((res:any) => {
      $("#filesTagList").find(".tag-item").remove()
      if (res.results && res.results.length) {
        res.results.map((v:any) => {
          $("#filesTagList").children(".tag-start").after(`<span class="ant-tag tag-item" title="${v.title}" data-id="${v.id}">${v.title}<span class="anticon anticon-close ant-tag-close-icon"><svg focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></span></span>`)
        })
        
      }
    })
  },
  addTag(e:Event) {
    console.log(this,e)
    $(e).hide().next().show().focus().blur(function(){
      $(this).hide().prev().show()
    });
  },
  delTag(ids: string[]) {
    filesApi.delTag({ids}).then((res:any) => {

    })
  }
}
// 打标签
export const tagMake = {
  init(id:string) {
    $('#selectedFileId').val(id)
    tagMake["selectedTag"] = []
    let selectedTagHtml = ''
    $('#selectedTagList').html(selectedTagHtml)
    if (tagMake["selectedTag"].length) {
      selectedTagHtml = '<span class="tag-start">已选标签：</span>'
      tagMake["selectedTag"].map((v:any) => {
        selectedTagHtml += `<span class="ant-tag tag-item" title="${v.title}" data-id="${v.id}">${v.title}</span>`
      })
      $('#selectedTagList').html(selectedTagHtml)
    }
    const tagListDom = $('#makeTagList').find('.tag-item')
    for (let i = 0; i < tagListDom.length; i++) {
      const element = tagListDom[i];
      const title = element.getAttribute('title')
      if (tagMake["selectedTag"].filter((v:any) => v.title === title).length) $(element)["addClass"]("ant-tag-has-color")
    }
    tagMake["query"] = {
      page: 1,
      size: 20
    }
    tagMake.getTag()
    const dialogButtons = {};
    dialogButtons["确定"] = function(){
      console.log(tagMake["selectedTag"])
      const tag = `,${tagMake["selectedTag"].map((v:any) => v.title).join()},`
      filesApi.modFiles(id, { tag }).then((res) => {
        const qfsDom = document.querySelector(comDomName) as HTMLElement
        qfsDom["getFiles"]()
        // @ts-ignore
        $('#dlgMakeTag').dialog('close');
      })
    };
    // @ts-ignore
    dialogButtons["关闭"] = function(){$('#dlgMakeTag').dialog('close');};
    // @ts-ignore
    $('#dlgMakeTag').dialog({title:"请选择标签",modal:true,buttons:dialogButtons});
  },
  getTag() {
    filesApi.getTag(tagMake["query"]).then((res:any) => {
      $("#makeTagList").find(".tag-item").remove()
      if (res.results && res.results.length) {
        res.results.map((v:any) => {
          $("#makeTagList").children(".tag-start").after(`<span class="ant-tag tag-item" title="${v.title}" data-id="${v.id}">${v.title}</span>`)
        })
      }
    })
  },
  addTag(e:Event) {
    console.log(this,e)
    $(e).hide().next().show().focus().blur(function(){
      $(this).hide().prev().show()
    });
  },
  delTag(ids: string[]) {
    filesApi.delTag({ids}).then((res:any) => {

    })
  }
}
// 导入导出
export const imAndex = {
  importFileClick(e:Event) {
    filesApi.importFiles(e)
  },
  exportFileClick() {
    filesApi.exportFiles({}).then((res:any) => {
      console.log(res)
      // window.open(staticBaseUrl + res.results.path)
      // @ts-ignore
      window.location.href = staticBaseUrl + res.results.path;
    })
  },
}