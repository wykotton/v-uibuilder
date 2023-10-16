import * as path from 'path';
import { Injectable } from "@nestjs/common";
import * as ExcelJS from 'exceljs';
import { searchSql, delFile, rmdirpromise } from "@/utils/utils";
import { uiBuilderMapping } from "@/dao/uiBuilderMapping";
import { log } from "../../../conf/log";
import _ from 'lodash';
import { staticBaseUrl, staticPathOriginal } from './constants';
const moment = require('moment');
const mysql = require("mysql");
const fs = require("fs");
const JSZip = require("jszip");
const compressing = require('compressing');

@Injectable()
export class FilesService {
  
  /**
   * 上传文件格式化数据处理
   * @param data
   */
  async saveFiles(data) {
    try {
      const { file, fileInfo, req: { user: { userId = '', username = '' } } } = data;
      console.log(file, fileInfo, userId)
      const params = {
        originalname: file.originalname,
        filename: file.filename,
        desc: fileInfo.desc,
        ext: file.ext,
        mime: file.mimetype,
        size: file.size,
        org_url: staticPathOriginal + file.originalname,
        url: staticBaseUrl + file.filename,
        type: fileInfo.filetype === 'sys' ? 0 : 1,
        category: fileInfo.filecategory,
        tag: fileInfo.filetag,
        uploader: username,
        create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        update_time: moment().format('YYYY-MM-DD HH:mm:ss')
      }
      // file.originalname + moment().format('YYYYMMDD') + lodash.random(100000, 999999) 
      // `${Date.now()}-${file.originalname}`
      const results = await searchSql(uiBuilderMapping.saveFiles, Object.values(params));
      return { results, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `查询元件集合失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }

  /**
   * 查询单元件集合
   * @param data
   */
  async getFiles(data) {
    try {
      const { query, req: { user: { userId = '', username = '' } } } = data;
      const { keywords = "", tag = "", type = "my", mime = "image", uploader = username, page = 1, size = 10, order = "create_time DESC" } = query;
      
      let idStr = ``;
      idStr = `WHERE type="${type === 'sys' ? 0 : 1}" AND uploader="${uploader}" AND originalname LIKE '%${String(keywords)}%'`;
      if (mime === "image" ) idStr += ` AND mime LIKE 'image%'`
      else idStr += ` AND mime NOT LIKE 'image%'`
      if (tag) {
        const tagArr = tag.split(",")
        for (let i = 0; i < tagArr.length; i++) {
          const item = tagArr[i];
          idStr += ` AND tag LIKE '%,${item},%'`
        }
      }
      idStr = mysql.raw(idStr)
      const [results = [], [{ total = 0 }]] = await searchSql(uiBuilderMapping.getFiles, [
        idStr,
        mysql.raw(order),
        (Number(page) - 1) * Number(size),
        Number(size),
        idStr
      ]);
      return {
        results,
        page,
        size,
        total,
        info: { msg: `success` },
      };
    } catch (error) {
      console.log(error);
      log.info(error, `查询失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  /**
   * 删除文件
   * @param data
   */
   async deleteFiles(data) {
    try {
      const { body, req: { user: { userId = '', username = '' } } } = data;
      const { ids = [] } = body;
      if (!Array.isArray(ids) || !ids.length) {
        return { info: { msg: `fail: 文件id不能为空` } };
      }
      let idStr = mysql.raw(``);
      if (username !== "root") idStr = mysql.raw(`AND uploader="${username}"`);
      for (const id of ids) {
        await searchSql(uiBuilderMapping.deleteFiles, [id, idStr]);
      }
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除文件失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  /**
   * 更新文件
   * @param data
   */
   async updateFiles(data) {
    try {
      const { id, body, req: { user: { userId = '', username = '' } } } = data;
      const { originalname, tag } = body;
      // if (!originalname) return { results: '文件名不能为空', info: { msg: `fail` } }; 
      let idStr = mysql.raw(``);
      if (username !== "root") idStr = mysql.raw(`AND uploader="${username}"`);
      let setStr = `update_time="${moment().format('YYYY-MM-DD HH:mm:ss')}"`;
      if (originalname) setStr += `,originalname="${originalname}"`;
      if (tag) setStr += `,tag="${tag}"`;
      await searchSql(uiBuilderMapping.updateFiles, [mysql.raw(setStr), id, idStr]);
      return { info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `删除文件失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
  
  /**
   * 导出文件
   * @param data
   */
  async exportFiles(data) {
    try {
      const { body, req: { user: { userId = '', username = '' } } } = data;
      // const { originalname, tag } = body;
      const tempDir = path.join(process.cwd(), 'upload/temp')
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      const timestamp = Date.now()
      const fileName = `fileList_${timestamp}.xlsx`
      const tagName = `tagList_${timestamp}.xlsx`
      const zipName = `zzjz_res_${timestamp}.zip`
      const filePath = tempDir + `/${fileName}`
      const tagPath = tempDir + `/${tagName}`
      const zipPath = tempDir + `/${zipName}`
      // 导出excel
      const fileWB = new ExcelJS.Workbook();
      const tagWB = new ExcelJS.Workbook();
      const fileSheet = fileWB.addWorksheet('文件表');
      const tagSheet = tagWB.addWorksheet('标签表');
      fileSheet.columns = [
        { header: 'ID', key: 'id' },
        { header: '文件原名称', key: 'originalname', width: 32 },
        { header: '文件名称', key: 'filename' },
        { header: '描述', key: 'desc' },
        { header: '后缀名', key: 'ext' },
        { header: '文件类型', key: 'mime' },
        { header: '文件大小', key: 'size' },
        { header: '原始文件地址', key: 'org_url' },
        { header: '文件地址', key: 'url' },
        { header: '所属类型', key: 'type' },
        { header: '分类', key: 'category' },
        { header: '标签', key: 'tag' },
        { header: '上传者', key: 'uploader' },
        { header: '创建时间', key: 'create_time' },
        { header: '更新时间', key: 'update_time' },
      ];
      tagSheet.columns = [
        { header: 'ID', key: 'id' },
        { header: '标签名称', key: 'title', width: 32 },
        { header: '类型', key: 'type' },
        { header: '描述', key: 'desc' },
        { header: '创建人', key: 'create_user' },
        { header: '更新人', key: 'update_user' },
        { header: '上传时间', key: 'create_time' },
        { header: '更新时间', key: 'update_time' },
      ];
      const fileResults = await searchSql(uiBuilderMapping.getAllFiles, [mysql.raw(``)]);
      fileSheet.addRows(fileResults);
      const fileBuffer = await fileWB.xlsx.writeBuffer();
      await fs.writeFileSync(filePath, fileBuffer, function (err) {
        if (err) console.log(err, "写入excel出错");
      });

      const tagResults = await searchSql(uiBuilderMapping.getAllFilesTag, [mysql.raw(``)]);
      tagSheet.addRows(tagResults);
      const tagBuffer = await tagWB.xlsx.writeBuffer();
      await fs.writeFileSync(tagPath, tagBuffer, function (err) {
        if (err) console.log(err, "写入excel出错");
      });
      //创建一个JSZip实例
      const zip = new JSZip();
      zip.file(fileName, await fs.readFileSync(filePath));
      zip.file(tagName, await fs.readFileSync(tagPath));
      const upload = zip.folder("upload");
      // 遍历上传目录
      const uploadDir = path.join(process.cwd(), 'upload')
      const uploadList = fs.readdirSync(path.join(process.cwd(), 'upload'));
      for (let i = 0; i < uploadList.length; i++) {
        const itempath = uploadList[i];
        const uploadFilePath = `${uploadDir}/${itempath}`
        if (itempath !== 'temp') upload.file(itempath, await fs.readFileSync(uploadFilePath));
      }
      await zip.generateAsync({
        // 压缩类型选择nodebuffer，在回调函数中会返回zip压缩包的Buffer的值，再利用fs保存至本地
        type: "nodebuffer",
        // 压缩算法
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
      }).then(async function(content) {
        await fs.writeFile(zipPath, content, function (err) {
          if (!err) {
            delFile(filePath);
            delFile(tagPath);
          } else {
              console.log(zip + '压缩失败');
          }
        });
      });
      return { results: { path: `${staticBaseUrl}temp/${zipName}` }, info: { msg: `success` } };
    } catch (error) {
      console.log(error);
      log.info(error, `导出文件失败`);
      return { results: error, info: { msg: `fail` } };
    }
  }
/**
   * 导入文件
   * @param data
   */
 async importFiles(data) {
  try {
    const { file, body, req: { user: { userId = '', username = '' } } } = data;
    console.log(file)
    const { name, rename, filename } = file
    const results = { file: '', tag: '', upload: '' }
    const compDir = path.join(process.cwd(), `upload/temp/${rename}`)
    if (!fs.existsSync(compDir)) fs.mkdirSync(compDir);
    await compressing.zip.uncompress(file.path, compDir)
    .then(async (data) => {
      // Zip文件上传并解压成功！
      const tempFileDir = path.join(process.cwd(), `upload/temp/${rename}`)
      const tempFileList = fs.readdirSync(tempFileDir);
      for (let i = 0; i < tempFileList.length; i++) {
        const itempath = tempFileList[i];
        const uploadFilePath = `${tempFileDir}/${itempath}`
        if (itempath === 'upload') {

        } // todo: 导入图片目录逻辑
        if (itempath.indexOf('file') === 0) {
          const fileBuffer = await fs.readFileSync(path.join(process.cwd(), `upload/temp/${rename}/${itempath}`)); // file为前端上传的excel
          const fileWB = new ExcelJS.Workbook();
          await fileWB.xlsx.load(fileBuffer); // 加载buffer文件
          const worksheet = fileWB.getWorksheet(1); // 获取excel表格的第一个sheet
          const fileResult = [];
          worksheet.eachRow((row, rowNumber) => {
            // 第一行是表头，故从第二行获取数据
            if (rowNumber > 1) {
              const target = {};
              const key = ['id','originalname','filename','desc','ext','mime','size','org_url','url','type','category','tag','uploader','create_time','update_time']
              key.map((v) => target[v] = '')
              row.eachCell((cell, colNumber) => {
                target[key[colNumber - 1]] = cell.value;
              });
              fileResult.push(target);
            }
          });
          for (let i = 0; i < fileResult.length; i++) {
            console.log(fileResult[i])
            const filename = fileResult[i]['filename']
            const [{ exist = 0 }] = await searchSql(uiBuilderMapping.existFiles, [filename]);
            if (!exist) {
              await searchSql(uiBuilderMapping.saveFiles, Object.values(fileResult[i]).slice(1));
              const readable=fs.createReadStream(path.join(process.cwd(), `upload/temp/${rename}/upload/${filename}`));//创建读取流
              const writable=fs.createWriteStream(path.join(process.cwd(), `upload/${filename}`));//创建写入流
              readable.pipe(writable);
            }
          }
          results.file = 'ok'
        }
        if (itempath.indexOf('tag') === 0) {
          const tagBuffer = await fs.readFileSync(path.join(process.cwd(), `upload/temp/${rename}/${itempath}`)); // file为前端上传的excel
          const tagWB = new ExcelJS.Workbook();
          await tagWB.xlsx.load(tagBuffer); // 加载buffer文件
          const worksheet = tagWB.getWorksheet(1); // 获取excel表格的第一个sheet
          const tagResult = [];
          worksheet.eachRow((row, rowNumber) => {
            // 第一行是表头，故从第二行获取数据
            if (rowNumber > 1) {
              const target = {};
              const key = ['id','title','type','desc','create_user','update_user','create_time','update_time']
              key.map((v) => target[v] = '')
              row.eachCell((cell, colNumber) => {
                target[key[colNumber - 1]] = cell.value;
              });
              tagResult.push(target);
            }
          });
          for (let i = 0; i < tagResult.length; i++) {
            const [{ exist = 0 }] = await searchSql(uiBuilderMapping.existFilesTag, [tagResult[i]['title']]);
            if (!exist) await searchSql(uiBuilderMapping.saveFilesTag, Object.values(tagResult[i]).slice(1));
          }
          results.tag = 'ok'
        }
      }

      // 删除缓存文件
      rmdirpromise(compDir);
      delFile(file.path);

    }).catch(err => {
        // let message = "Zip文件上传并解压失败！"
        // res.json({ code: 500, message });
        // console.log(message)
        console.log(err);
    })
    return { results, info: { msg: `success` } };
  } catch (error) {
    console.log(error);
    log.info(error, `导出文件失败`);
    return { results: error, info: { msg: `fail` } };
  }
 }
  
}
