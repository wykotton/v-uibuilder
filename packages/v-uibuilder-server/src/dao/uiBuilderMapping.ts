export const uiBuilderMapping = {
  queryNavigation: "SELECT * FROM t_navigation ?;",
  saveInfo: `INSERT INTO t_ui_builder (custom_model,create_time,update_time,theme,user_id,project_id,page_name)VALUES(?,?,?,?,?,?,?);`,
  findInfo: `SELECT * FROM t_ui_builder WHERE id=?;`,
  updateInfo: `UPDATE t_ui_builder SET custom_model=?,update_time=?,theme=?,page_name=? WHERE id=? AND user_id=?;`,
  pageInfo: `SELECT * FROM t_ui_builder ? ORDER BY create_time DESC LIMIT ?,?;SELECT count(id) as total FROM t_ui_builder ?;`,
  deleteInfo: `DELETE FROM t_ui_builder WHERE id=? AND user_id=?;`,
  configInfo: `SELECT * FROM t_config;`,
  updateConfig: `UPDATE t_config SET website_name=?, app_publish_path=?, app_pic_path=?, app_all_pel_path=?, used=?, copyright=?, deepinsight_path=?, app_publish_ip=?, app_theme_color=?, app_cavans_color=?  WHERE id=?;`,
  updateComponent: `UPDATE t_navigation SET name=?, width=?, height=?, options=?, description=? WHERE id=?;`,
  registerSQL: ``,
  loginSQL: `SELECT * FROM sys_user WHERE user_name=? AND password=?`,
  updatePageName: `UPDATE t_ui_builder SET page_name=? WHERE id=? AND user_id=?;`,

  // combination
  saveCombination:
    "INSERT INTO t_my_component (user_id,component_name,create_time,update_time,text,type,`group`,`options`,children,router,attr_bind)VALUES(?,?,?,?,?,?,?,?,?,?,?);",
  updateCombination:
    "UPDATE t_my_component SET user_id=?,component_name=?,update_time=?,text=?,type=?,`group`=?,`options`=?,children=?,router=?,attr_bind=? WHERE id=?;",
  updateCombinationName: `UPDATE t_my_component SET text=? WHERE id=? AND user_id=?;`,
  findCombination: `SELECT * FROM t_my_component WHERE id = ?;`,
  searchCombination: `SELECT * FROM t_my_component WHERE user_id=? and text=?;`,
  searchCombinationById: `SELECT * FROM t_my_component WHERE id=?;`,
  getCombination: `SELECT * FROM t_my_component WHERE user_id=?;`,
  deleteCombination: `DELETE FROM t_my_component WHERE id=? AND user_id=?;`,

  // project
  getProject: `SELECT * FROM t_project ? ORDER BY create_time DESC LIMIT ?,?;SELECT count(id) as total FROM t_project ?;`,
  getAllProject: `SELECT * FROM t_project ? ORDER BY create_time DESC;SELECT count(id) as total FROM t_project ?;`,
  findProject: `SELECT * FROM t_project WHERE id=? AND user_id=?;`,
  previewProject: `SELECT * FROM t_project WHERE id=?;`,
  findProjectPage: `SELECT * FROM t_ui_builder WHERE project_id=?;`,
  saveProject: `INSERT INTO t_project (project_name,create_time,update_time,user_id)VALUES(?,?,?,?);`,
  updateProject: `UPDATE t_project SET data=?,update_time=? WHERE id=?;`,
  updateProjectName: `UPDATE t_project SET project_name=?,update_time=? WHERE id=? AND user_id=?;`,
  deleteProject: `DELETE FROM t_project WHERE id=? AND user_id=?;`,
  updateProjectChildPage: `UPDATE t_project SET child_page=?,update_time=? WHERE id=?;`,
  importProject: `INSERT INTO t_project (project_name,create_time,update_time,user_id,data,child_page)VALUES(?,?,?,?,?,?);`,

  // warehouse
  savePageWarehouse:
    "INSERT INTO t_my_warehouse (user_id,custom_model,theme,create_time,update_time,name,type,`group`)VALUES(?,?,?,?,?,?,?,?);",
  updatePageWarehouse:
    "UPDATE t_my_warehouse SET custom_model=?,theme=?,update_time=?,name=?,type=?,`group`=? WHERE id=?;",
  updatePageWarehouseName: `UPDATE t_my_warehouse SET name=? WHERE id=? AND user_id=?;`,
  findPageWarehouse: `SELECT * FROM t_my_warehouse WHERE id = ?;`,
  searchPageWarehouse: `SELECT * FROM t_my_warehouse WHERE user_id=? and name=?;`,
  searchPageWarehouseById: `SELECT * FROM t_my_warehouse WHERE id=?;`,
  getPageWarehouse: `SELECT * FROM t_my_warehouse WHERE user_id=?;`,
  deletePageWarehouse: `DELETE FROM t_my_warehouse WHERE id=? AND user_id=?;`,
  loadPageWarehouse: `UPDATE t_ui_builder SET custom_model=?,update_time=?,theme=? WHERE id=? AND user_id=?;`,

  // website
  getWebsite: `SELECT * FROM t_website ? ORDER BY create_time DESC LIMIT ?,?;SELECT count(id) as total FROM t_website ?;`,
  getAllWebsite: `SELECT * FROM t_website ? ORDER BY create_time DESC;SELECT count(id) as total FROM t_website ?;`,
  findWebsite: `SELECT * FROM t_website WHERE id=?;`,
  saveWebsite: `INSERT INTO t_website (website_name,config,create_time,update_time,user_id)VALUES(?,?,?,?,?);`,
  updateWebsite: `UPDATE t_website SET website_name=?,config=?,update_time=? WHERE id=? AND user_id=?;`,
  updateWebsiteName: `UPDATE t_website SET website_name=?,update_time=? WHERE id=? AND user_id=?;`,
  deleteWebsite: `DELETE FROM t_website WHERE id=? AND user_id=?;`,

  // auth
  getUserInfo: `SELECT * FROM t_user WHERE id=?;`,
  getUIBUserInfo: `SELECT * FROM t_user WHERE is_sso=? AND username=?;`,
  getSSOUserInfo: `SELECT * FROM t_user WHERE is_sso=? AND sso_user_id=?;`,
  saveUserInfo:
    "INSERT INTO t_user (username,password,password_salt,create_time,update_time,is_deleted,is_sso,sso_user_id)VALUES(?,?,?,?,?,?,?,?);",
  updateUserTheme: `UPDATE t_user SET theme=?,update_time=? WHERE id=?;`,
  updateLastLogin: `UPDATE t_user SET last_login=? WHERE id=?;`,
  deleteUserInfo: `DELETE FROM t_user WHERE id=?;`,
};
