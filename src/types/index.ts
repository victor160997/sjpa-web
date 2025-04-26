
// Enums
export enum TipoAnimal {
  CACHORRO = 1,
  GATO = 2,
}

export enum Genero {
  MASCULINO = 1,
  FEMININO = 2,
}

export enum StatusChecagem {
  NAO_INICIADO = "não iniciado",
  EM_ANDAMENTO = "em andamento",
  CONCLUIDO = "concluído",
}

// Interfaces
export interface Animal {
  id?: string;
  idBaia?: string | null;
  idSetor: string;
  idade: number;
  lastCheck?: string | null;
  nome: string;
  observacao?: string | null;
  raca: string;
  tipo: TipoAnimal;
  gender: Genero;
  isChecked?: boolean;
}

export interface Baia {
  id?: string;
  animais: Animal[];
  idSetor: string;
  numeroBaia: number;
  observacao?: string | null;
  tipo: TipoAnimal;
  isChecked?: boolean;
}

export interface Setor {
  id?: string;
  animais: Animal[];
  baias: Baia[];
  nome: string;
  observacao?: string | null;
  isChecked?: boolean;
}

export interface Check {
  id?: string;
  check: string;
  status: StatusChecagem;
}

export interface User {
  id: string;
  email: string;
  displayName?: string | null;
}
