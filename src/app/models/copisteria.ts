export interface Copisteria {
  copisteria_id: number;
  nome: string;
  nickname: string
  indirizzo: string;
  latitudine: number;
  longitudine: number;
  password_hash?: string;
  numero_giorni_conservazione: number;
  prezzi_formati_carta: any,
  prezzi_metodi_stampa: any,
  prezzi_add_on: any
};
