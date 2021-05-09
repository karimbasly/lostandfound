import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IConversation } from 'app/entities/conversation/conversation.model';

export interface IMessage {
  id?: number;
  text?: string;
  sendDate?: dayjs.Dayjs;
  seen?: boolean;
  user?: IUser | null;
  conversation?: IConversation | null;
}

export class Message implements IMessage {
  constructor(
    public id?: number,
    public text?: string,
    public sendDate?: dayjs.Dayjs,
    public seen?: boolean,
    public user?: IUser | null,
    public conversation?: IConversation | null
  ) {
    this.seen = this.seen ?? false;
  }
}

export function getMessageIdentifier(message: IMessage): number | undefined {
  return message.id;
}
