import { knexInstance } from "@/utils/knex";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SettingService {
  constructor(private readonly httpService: HttpService) {}
  /**
   * 代理中转接口
   * 用于请求其它跨域接口
   * @param body
   * @returns
   */
  async httpProxy(body): Promise<any> {
    const { config } = body;
    try {
      const results = this.httpService.axiosRef(config);
      return (await results).data;
    } catch (error) {
      return error;
    }
  }

  /**
   * 用于前端请求数据库需求
   * @param body
   * @returns
   */
  async queryDatabaseData(body): Promise<any> {
    const { config } = body;
    try {
      const databaseInstance = knexInstance.getDatabaseInstance(config);
      // console.log("Connection has been established successfully.");
      const data = await knexInstance.getTableData(databaseInstance, config);
      return { code: 200, results: data, info: { msg: `success` } };
    } catch (error) {
      // console.error("Unable to connect to the database: \n", error);
      return { code: 500, results: error, info: { msg: `无法连接到数据库!` } };
    }
  }
}
