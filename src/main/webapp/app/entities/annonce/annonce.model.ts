import * as dayjs from 'dayjs';
import { ICommentaire } from 'app/entities/commentaire/commentaire.model';
import { IImage } from 'app/entities/image/image.model';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { IUser } from 'app/entities/user/user.model';
import { Ville } from 'app/entities/enumerations/ville.model';
import { Type } from 'app/entities/enumerations/type.model';
import { EtatAnnone } from 'app/entities/enumerations/etat-annone.model';

export interface IAnnonce {
  id?: number;
  titre?: string;
  description?: string | null;
  ville?: Ville | null;
  type?: Type | null;
  etat?: EtatAnnone | null;
  dateAnnonce?: dayjs.Dayjs;
  commentaires?: ICommentaire[] | null;
  images?: IImage[] | null;
  categorie?: ICategorie | null;
  user?: IUser | null;
}

export class Annonce implements IAnnonce {
  constructor(
    public id?: number,
    public titre?: string,
    public description?: string | null,
    public ville?: Ville | null,
    public type?: Type | null,
    public etat?: EtatAnnone | null,
    public dateAnnonce?: dayjs.Dayjs,
    public commentaires?: ICommentaire[] | null,
    public images?: IImage[] | null,
    public categorie?: ICategorie | null
  ) {}
}

export function getAnnonceIdentifier(annonce: IAnnonce): number | undefined {
  return annonce.id;
}
