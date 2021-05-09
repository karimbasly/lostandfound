export interface ICategorie {
  id?: number;
  title?: string;
  logoContentType?: string;
  logo?: string;
}

export class Categorie implements ICategorie {
  constructor(public id?: number, public title?: string, public logoContentType?: string, public logo?: string) {}
}

export function getCategorieIdentifier(categorie: ICategorie): number | undefined {
  return categorie.id;
}
