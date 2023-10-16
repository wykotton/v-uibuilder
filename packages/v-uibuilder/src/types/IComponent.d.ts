import { IMessage } from "./IMessage";
import { ISchema } from "./IModelSchema";


export interface IComponent extends Element{
    componentModel: ISchema,
    model?: ISchema,
    onMessage(message: IMessage): void;
    sendMessage(message: IMessage): Promise<any>;
    [key: string]: any;
}


