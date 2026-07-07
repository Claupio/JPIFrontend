

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
