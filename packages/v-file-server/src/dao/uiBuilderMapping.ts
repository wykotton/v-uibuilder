export const uiBuilderMapping = {
  // Files
  getFiles: `SELECT * FROM t_files ? ORDER BY ? LIMIT ?,?;SELECT count(id) as total FROM t_files ?;`,
  getAllFiles: `SELECT * FROM t_files ? ORDER BY create_time DESC;`,
  findFiles: `SELECT * FROM t_files WHERE id=? AND user_id=?;`,
  saveFiles: "INSERT INTO t_files (originalname,filename,`desc`,ext,mime,size,org_url,url,type,category,tag,uploader,create_time,update_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
  updateFiles: `UPDATE t_files SET ? WHERE id=? ?;`,
  deleteFiles: `DELETE FROM t_files WHERE id=? ?;`,
  existFiles: `SELECT count(id) as exist FROM t_files WHERE filename=?;`,
  // FilesCategory
  getFilesCategory: `SELECT * FROM t_files_category ? ORDER BY create_time DESC LIMIT ?,?;`,
  getAllFilesCategory: `SELECT * FROM t_files_category ? ORDER BY create_time DESC;`,
  findFilesCategory: `SELECT * FROM t_files_category WHERE id=? AND user_id=?;`,
  saveFilesCategory: "INSERT INTO t_files_category (title,pid,`desc`,create_user,update_user,create_time,update_time)VALUES(?,?,?,?,?,?,?);",
  updateFilesCategory: `UPDATE t_files_category SET data=?,update_time=? WHERE id=?;`,
  deleteFilesCategory: `DELETE FROM t_files_category WHERE id=? AND user_id=?;`,
  // FilesTag
  getFilesTag: `SELECT * FROM t_files_tag ? ORDER BY create_time DESC LIMIT ?,?;SELECT count(id) as total FROM t_files_tag ?;`,
  getAllFilesTag: `SELECT * FROM t_files_tag ? ORDER BY create_time DESC;`,
  findFilesTag: `SELECT * FROM t_files_tag WHERE title=?;`,
  saveFilesTag: "INSERT INTO t_files_tag (title,type,`desc`,create_user,update_user,create_time,update_time)VALUES(?,?,?,?,?,?,?);",
  updateFilesTag: `UPDATE t_files_tag SET data=?,update_time=? WHERE id=?;`,
  deleteFilesTag: `DELETE FROM t_files_tag WHERE id=? ?;`,
  existFilesTag: `SELECT count(id) as exist FROM t_files_tag WHERE title=?;`,

};
