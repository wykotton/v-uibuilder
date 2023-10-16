import { getConfigJson, IConfig } from '@/utils/utils';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
const { wsPort = 6088 } = getConfigJson('./conf/config.json')  as IConfig;
const wsPortComp = process.argv[2] ? Number(process.argv[2]) + 1 : wsPort
@WebSocketGateway(wsPortComp, {
  path: "/page-subscribe",
  cors: {
    origin: '*',
  },
})
export class EventsGateway {

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('page-subscribe')
  handleMessage(@MessageBody() data: any): WsResponse<any> {

    const event = `parent-eventBus`;
    return { event, data };
  }
}
