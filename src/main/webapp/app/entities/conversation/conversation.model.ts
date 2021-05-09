import * as dayjs from 'dayjs';
import { IMessage } from 'app/entities/message/message.model';
import { IUser } from 'app/entities/user/user.model';

export interface IConversation {
  id?: number;
  title?: string | null;
  creationDate?: dayjs.Dayjs;
  logoContentType?: string | null;
  logo?: string | null;
  color?: string | null;
  messages?: IMessage[] | null;
  users?: IUser[] | null;
}

export class Conversation implements IConversation {
  constructor(
    public id?: number,
    public title?: string | null,
    public creationDate?: dayjs.Dayjs,
    public logoContentType?: string | null,
    public logo?: string | null,
    public color?: string | null,
    public messages?: IMessage[] | null,
    public users?: IUser[] | null
  ) {}
}

export function getConversationIdentifier(conversation: IConversation): number | undefined {
  return conversation.id;
}
