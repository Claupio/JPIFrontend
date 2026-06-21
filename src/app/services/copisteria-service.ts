import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fileTrayFull } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CopisteriaService {
  constructor(private httpClient: HttpClient) {}

  private baseURL: string = "http://localhost:3000"

  setToken(token: string) {
    localStorage.setItem("CopisteriaToken", token)
  }

  getToken() {
    return localStorage.getItem("CopisteriaToken")
  }

  getOrdini(filtri: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(filtri)) {
      params = params.set(key, JSON.stringify(value))
    }

    return this.httpClient.get<any>(`${this.baseURL}/copisteria/ordini`, { headers, params});
  }

  cambiaStato(ordine: number, nuovoStato: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    console.log(nuovoStato)

    return this.httpClient.put<any>(`${this.baseURL}/copisteria/ordini`, {stato: nuovoStato, ordine_id: ordine}, { headers });
  }

  cancellaOrdine(ordine: number, motivazione: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.put<any>(`${this.baseURL}/copisteria/ordini`, {stato: "CANCELLATO", ordine_id: ordine, motivazione: motivazione}, { headers });
  }

  scaricaOrdinePDF(ordine_id: number){

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams().set("ordine_id", ordine_id);

    return this.httpClient.get<any>(`${this.baseURL}/copisteria/ordini/pdf`,{responseType: 'arraybuffer' as 'json', headers: headers, params: params})
  }


  getOpzioniOrdini(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams();
    return this.httpClient.get<any>(`${this.baseURL}/copisteria/opzioni_ordini/`, { headers, params});
  }

  setOpzioniOrdini(opzioniOrdini: any): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let opzioniOrdini2: any = {};

    for(const [key, value] of Object.entries(opzioniOrdini)) {
      opzioniOrdini2[key] = JSON.stringify(value);
    }


    return this.httpClient.put(`${this.baseURL}/copisteria/opzioni_ordini/`, opzioniOrdini, { headers: headers });
  }

  addFormato(nuovoFormato: any) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.post(`${this.baseURL}/copisteria/opzioni_ordini/`, nuovoFormato, { headers: headers });
  }

  deleteFormato(id: number) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.delete(`${this.baseURL}/copisteria/opzioni_ordini/formati/${id}`, { headers: headers });
  }

  getFasceOrarie(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.get<any>(`${this.baseURL}/copisteria/fasce_orarie`, { headers });
  }

  addFasciaOraria(nuovaFascia: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.httpClient.post<any>(`${this.baseURL}/copisteria/fasce_orarie`, nuovaFascia, { headers });
  }

  deleteFasciaOraria(inizio_fascia: string, fine_fascia: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    
    console.log(inizio_fascia)
    console.log(fine_fascia)
    // Il backend si aspetta i dati nei query parameters (req.query)
    let params = new HttpParams()
      .set('inizio_fascia', inizio_fascia)
      .set('fine_fascia', fine_fascia);

    return this.httpClient.delete<any>(`${this.baseURL}/copisteria/fasce_orarie`, { headers, params });
  }
}
