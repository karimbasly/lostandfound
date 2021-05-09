import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IAnnonce } from 'app/entities/annonce/annonce.model';

export interface ICommentaire {
  id?: number;
  text?: string;
  dateCreation?: dayjs.Dayjs;
  user?: IUser | null;
  annonce?: IAnnonce | null;
}

export class Commentaire implements ICommentaire {
  constructor(
    public id?: number,
    public text?: string,
    public dateCreation?: dayjs.Dayjs,
    public user?: IUser | null,
    public annonce?: IAnnonce | null
  ) {}
}

export function getCommentaireIdentifier(commentaire: ICommentaire): number | undefined {
  return commentaire.id;
}
