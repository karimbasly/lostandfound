import { IAnnonce } from 'app/entities/annonce/annonce.model';

export interface IImage {
  id?: number;
  imageContentType?: string;
  image?: string;
  description?: string | null;
  annonce?: IAnnonce | null;
}

export class Image implements IImage {
  constructor(
    public id?: number,
    public imageContentType?: string,
    public image?: string,
    public description?: string | null,
    public annonce?: IAnnonce | null
  ) {}
}

export function getImageIdentifier(image: IImage): number | undefined {
  return image.id;
}
