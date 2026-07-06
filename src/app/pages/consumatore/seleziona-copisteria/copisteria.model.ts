// Rispecchia lo schema reale della tabella `copisteria` (vedi copisteria-table.js).
// Le mappe prezzi_* sono `nome_opzione -> prezzo`; SQLite le restituisce come
// stringa JSON, quindi vanno parsate se non lo sono già lato backend.
// export interface Copisteria {
//   copisteria_id: number;
//   nickname?: string;
//   nome: string;
//   indirizzo: string;
//   latitudine: number;
//   longitudine: number;
//   numero_giorni_conservazione?: number;
//   prezzi_formati_carta: Record<string, number> | string;
//   prezzi_metodi_stampa: Record<string, number> | string;
//   prezzi_add_on: Record<string, number> | string;
// }

// Fascia oraria di ritiro offerta da una copisteria (vedi fascia_oraria-table.js).
// NOTA: non esiste ancora un endpoint pubblico per recuperarle lato consumatore;
// CopisteriaService.getFasceOrarie() usa il token del gestore, non adatto qui.

// Payload richiesto da POST /preventivo (vedi preventivo.js)
export interface RichiestaPreventivo {
  copisteria_id: number;
  formato_carta: string;
  metodo_di_stampa: string;
  numero_pagine: number;
  add_on: string;
  inizio_fascia_minima: string;
}

export interface RispostaPreventivo {
  prezzo: number;
  tempo_massimo_ritiro: string;
}
