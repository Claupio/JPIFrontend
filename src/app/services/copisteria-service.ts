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

  private token: string = "";

  setToken(token: string) {
    this.token = token;
  }

  getOrdini(filtri: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(filtri)) {
      params = params.set(key, JSON.stringify(value))
    }

    console.log(this.token)

    return this.httpClient.get<any>(`${this.baseURL}/copisteria/ordini`, { headers, params});
  }

  cambiaStato(ordine: number, nuovoStato: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    console.log(nuovoStato)

    return this.httpClient.put<any>(`${this.baseURL}/copisteria/ordini`, {stato: nuovoStato, ordine_id: ordine}, { headers });
  }

  cancellaOrdine(ordine: number, motivazione: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.put<any>(`${this.baseURL}/copisteria/ordini`, {stato: "CANCELLATO", ordine_id: ordine, motivazione: motivazione}, { headers });
  }

  scaricaOrdinePDF(ordine_id: number){

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    let params = new HttpParams().set("ordine_id", ordine_id);

    return this.httpClient.get<any>(`${this.baseURL}/copisteria/ordini/pdf`,{responseType: 'arraybuffer' as 'json', headers: headers, params: params})
  }


  getOpzioniOrdini(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    let params = new HttpParams();
    return this.httpClient.get<any>(`${this.baseURL}/copisteria/opzioni_ordini`, { headers, params});
  }

  addFormato(nuovoFormato: any) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.post(`${this.baseURL}/copisteria/opzioni_ordini/formati`, nuovoFormato, { headers: headers });
  }

  deleteFormato(id: number) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.httpClient.delete(`${this.baseURL}/copisteria/opzioni_ordini/formati/${id}`, { headers: headers });
  }
}
