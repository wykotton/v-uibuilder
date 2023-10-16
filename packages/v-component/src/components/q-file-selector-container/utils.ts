import { staticBaseUrl } from "./constants"
const FileTypes:any[] = [];
FileTypes['image'] = ['jpg', 'jpeg', 'png', 'gif'];
FileTypes['media'] = ['avi', 'flv', 'swf', 'wmv', 'mp3', 'wma', 'mpg','mpeg'];
FileTypes['document'] = ['doc', 'docx', 'txt', 'rtf', 'pdf', 'xls', 'mdb','html','htm','db'];
// 字典定义
export const RoxyFilemanConf = {
  "FILES_ROOT":          "",
  "RETURN_URL_PREFIX":   "",
  "SESSION_PATH_KEY":    "",
  "THUMBS_VIEW_WIDTH":   "140",
  "THUMBS_VIEW_HEIGHT":  "120",
  "PREVIEW_THUMB_WIDTH": "300",
  "PREVIEW_THUMB_HEIGHT":"200",
  "MAX_IMAGE_WIDTH":     "1000",
  "MAX_IMAGE_HEIGHT":    "1000",
  "INTEGRATION":         "ckeditor",
  "DIRLIST":             `${staticBaseUrl}/fileman/dirlist`,
  "CREATEDIR":           `${staticBaseUrl}/fileman/createdir`,
  "DELETEDIR":           `${staticBaseUrl}/fileman/delete`,
  "MOVEDIR":             `${staticBaseUrl}/fileman/move`,
  "COPYDIR":             `${staticBaseUrl}/fileman/copy`,
  "RENAMEDIR":           `${staticBaseUrl}/fileman/rename`,
  "FILESLIST":           `${staticBaseUrl}/fileman/get-files`,
  "UPLOAD":              `${staticBaseUrl}/fileman/upload/file`,
  "DOWNLOAD":            `${staticBaseUrl}/fileman/download`,
  "DOWNLOADDIR":         `${staticBaseUrl}/fileman/downloaddir`,
  "DELETEFILE":          `${staticBaseUrl}/fileman/delete-files`,
  "MOVEFILE":            `${staticBaseUrl}/fileman/move`,
  "COPYFILE":            `${staticBaseUrl}/fileman/copy`,
  "RENAMEFILE":          `${staticBaseUrl}/fileman/update-files`,
  "GENERATETHUMB":       `${staticBaseUrl}/fileman/generatethumb`,
  "TAGLIST":             `${staticBaseUrl}/filetag/get-tag`,
  "ADDTAG":              `${staticBaseUrl}/filetag/add-tag`,
  "MODTAG":              `${staticBaseUrl}/filetag/update-tag`,
  "DELETETAG":           `${staticBaseUrl}/filetag/delete-tag`,
  "IMPORT":              `${staticBaseUrl}/fileman/import-files`,
  "EXPORT":              `${staticBaseUrl}/fileman/export-files`,
  "DEFAULTVIEW":         "list",
  "FORBIDDEN_UPLOADS":   "zip js jsp jsb mhtml mht xhtml xht php phtml php3 php4 php5 phps shtml jhtml pl sh py cgi exe application gadget hta cpl msc jar vb jse ws wsf wsc wsh ps1 ps2 psc1 psc2 msh msh1 msh2 inf reg scf msp scr dll msi vbs bat com pif cmd vxd cpl htpasswd htaccess",
  "ALLOWED_UPLOADS":     "",
  "FILEPERMISSIONS":     "0644",
  "DIRPERMISSIONS":      "0755",
  "LANG":                "auto",
  "DATEFORMAT":          "dd/MM/yyyy HH:mm",
  "OPEN_LAST_DIR":       "yes"
}
export function RoxyUtils(){}
// 路径处理
RoxyUtils.FixPath = function(path:string){
  if(!path)
    return '';
  let ret = path.replace(/\\/g, '');
  ret = ret.replace(/\/\//g, '/');
  ret = ret.replace(':/', '://');

  return ret;
};
// 格式化数据
RoxyUtils.FormatDate = function(date:any){
  let ret = '';
  try{
    // @ts-ignore
    ret = $.format.date(date, RoxyFilemanConf.DATEFORMAT);
  }
  catch(ex){
    //alert(ex);
    ret = date.toString();
    ret = ret.substr(0, ret.indexOf('UTC'));
  }
  return ret;
};
// 获取路径
RoxyUtils.GetPath = function(path:string){
  let ret = '';
  path = RoxyUtils.FixPath(path);
  if(path.indexOf('/') > -1)
    ret = path.substring(0, path.lastIndexOf('/'));

  return ret;
};
// 获取路径参数
RoxyUtils.GetUrlParam = function(varName:string, url?:any){
  let ret = '';
  if(!url)
    url = self.location.href;
  if(url.indexOf('?') > -1){
     url = url.substr(url.indexOf('?') + 1);
     url = url.split('&');
     for(let i = 0; i < url.length; i++){
       const tmp = url[i].split('=');
       if(tmp[0] && tmp[1] && tmp[0] == varName){
         ret = tmp[1];
         break;
       }
     }
  }

  return ret;
};
// 获取文件名
RoxyUtils.GetFilename = function(path:string){
  let ret = path;
  path = RoxyUtils.FixPath(path);
  if(path.indexOf('/') > -1){
    ret = path.substring(path.lastIndexOf('/')+1);
  }

  return ret;
};
// 处理路径
RoxyUtils.MakePath = function(){
  let ret = '';
  if(arguments && arguments.length > 0){
    for(let i = 0; i < arguments.length; i++){
      ret += ($.isArray(arguments[i])?arguments[i].join('/'):arguments[i]);
      if(i < (arguments.length - 1))
        ret += '/';
    }
    ret = RoxyUtils.FixPath(ret);
  }

  return ret;
};
// 获取文件后缀
RoxyUtils.GetFileExt = function(path:string){
  let ret = '';
  path = RoxyUtils.GetFilename(path);
  if(path.indexOf('.') > -1){
    ret = path.substring(path.lastIndexOf('.') + 1);
  }

  return ret;
};
// 判断文件是否存在
RoxyUtils.FileExists = function(path:string) {
  let ret = false;

  $.ajax({
      url: path,
      type: 'HEAD',
      async: false,
      dataType:'text',
      success:function(){ret = true;}
  });

  return ret;
};
// RoxyUtils.GetFileIcon = function(path:string){
//   let ret = 'images/filetypes/unknown.png';//'images/filetypes/file_extension_' + RoxyUtils.GetFileExt(path).toLowerCase() + '.png';
//   if(fileTypeIcons[RoxyUtils.GetFileExt(path).toLowerCase()]){
//     ret = 'images/filetypes/' + fileTypeIcons[RoxyUtils.GetFileExt(path).toLowerCase()];
//   }

//   return ret;
// };
// 获取文件尺寸
RoxyUtils.GetFileSize = function(path:string){
  let ret = 0 as any;
  $.ajax({
      url: path,
      type: 'HEAD',
      async: false,
      success:function(d,s, xhr){
        ret = xhr.getResponseHeader('Content-Length');
      }
  });
  if(!ret)
    ret = 0;

  return ret;
};
// 获取文件类型
RoxyUtils.GetFileType = function(path:string){
  let ret = RoxyUtils.GetFileExt(path).toLowerCase();
  if(ret == 'png' || ret == 'jpg' || ret == 'gif' || ret == 'jpeg')
    ret = 'image';

  return ret;
};
// 判断是否为图片
RoxyUtils.IsImage = function(path:string){
  let ret = false;
  if(RoxyUtils.GetFileType(path) == 'image')
    ret = true;

  return ret;
};
// 格式化文件大小
RoxyUtils.FormatFileSize = function(x:number){
  let suffix = 'B';
  if(!x)
    x = 0;
  if(x > 1024){
    x = x / 1024;
    suffix = 'KB';
  }
  if(x > 1024){
    x = x / 1024;
    suffix = 'MB';
  }
  x = Number(x);
  return x.toFixed(2) + ' ' + suffix;
};
// 添加参数
RoxyUtils.AddParam = function(url:string, n:string, v:string){
  url += (url.indexOf('?') > -1?'&':'?') + n + '='+encodeURIComponent(v);

  return url;
};
// 选择文字
RoxyUtils.SelectText = function(field_id:string, start:number, end:number) {
  try{
    const field = document.getElementById(field_id) as HTMLInputElement;
    // @ts-ignore
    const selRange = field.createTextRange();
    if( selRange ) {
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end-start);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
  }
  catch(ex){}
};

// RoxyUtils.LoadConfig = function(){
//   $.ajax({
//       url: 'conf.json',
//       dataType: 'json',
//       async:false,
//       success: function(data){
//         RoxyFilemanConf = data;
//       },
//       error: function(data){
//         alert(t('E_LoadingConf'));
//       }
//   });
// };
// function RoxyLang(){}
// RoxyUtils.LoadLang = function(){
//   let langUrl = '';
//   if(RoxyFilemanConf.LANG && RoxyFilemanConf.LANG.toLowerCase() == 'auto'){
//     if(RoxyUtils.GetUrlParam('langCode')){
//       langUrl = 'lang/' + RoxyUtils.GetUrlParam('langCode').substr(0, 2).toLowerCase() + '.json';
//     }
//     else {
//       const language = window.navigator.userLanguage || window.navigator.language;
//       langUrl = 'lang/' + language.substr(0, 2) + '.json';
//     }
//     if(!RoxyUtils.FileExists(langUrl))
//       langUrl = '';
//   }
//   else{
//     if(RoxyFilemanConf.LANG){
//       langUrl = 'lang/' + RoxyFilemanConf.LANG.substr(0, 2).toLowerCase() + '.json';
//       if(!RoxyUtils.FileExists(langUrl))
//         langUrl = '';
//       }
//   }
//   if(!langUrl)
//     langUrl = 'lang/en.json';

//   $.ajax({
//       url: langUrl,
//       dataType: 'json',
//       async:false,
//       success: function(data){
//         RoxyLang = data;
//       },
//       error: function(data){
//         alert('Error loading language file');
//       }
//   });
// };
// RoxyUtils.Translate = function(){
//   RoxyUtils.LoadLang();

//   $('[data-lang-t]').each(function(){
//     const key = $(this).attr('data-lang-t');
//     $(this).prop('title', t(key));
//   });
//   $('[data-lang-v]').each(function(){
//     const key = $(this).attr('data-lang-v');
//     $(this).prop('value', t(key));
//   });
//   $('[data-lang]').each(function(){
//     const key = $(this).attr('data-lang');
//     $(this).html(t(key));
//   });
// };
// 批量获取Cookie
RoxyUtils.GetCookies = function() {
  const ret = new Object();
  let tmp = document.cookie.replace(' ','') as any;
  tmp = tmp.split(';');
  for(const i in tmp){
    const s = tmp[i].split('=');
    if(s.length > 1){
      ret[$.trim(s[0].toString())] = decodeURIComponent($.trim(s[1].toString())) || '';
    }
  }

  return ret;
}
// 获取Cookie
RoxyUtils.GetCookie = function(key:string) {
  const tmp = RoxyUtils.GetCookies();

  return tmp[key] || '';
}
// 设置Cookie
RoxyUtils.SetCookie = function(key:string, val:string, hours:number, path:string) {
  const expires = new Date();
  if(hours){
    expires.setTime(expires.getTime() + (hours * 3600 * 1000));
  }
  
  if(!path){
     path = '/';
  }
  
  document.cookie = key + '=' + encodeURIComponent(val) + '; path=' + path + (hours?'; expires=' + expires['toGMTString']():'');
}
// 转换为boolean
RoxyUtils.ToBool = function(val:string){
  let ret = false;
  val = val.toString().toLowerCase();
  if(val == 'true' || val == 'on' || val == 'yes' || val == '1')
    ret = true;
  
  return ret;
}
// 清除Cookie
RoxyUtils.UnsetCookie = function(key:string) {
  document.cookie = key + "=; expires=Thu, 01 Jan 1972 00:00:00 UTC"; 
}

// function t(tag:string){
//   let ret = tag;
//   if(RoxyLang && RoxyLang[tag])
//     ret = RoxyLang[tag];
//   return ret;
// }
