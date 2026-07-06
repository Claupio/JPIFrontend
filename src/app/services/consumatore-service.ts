import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConsumatoreService {
  constructor(private httpClient: HttpClient) {}

  private baseURL: string = "http://localhost:3000"

  setToken(token: string) {
    localStorage.setItem("ConsumatoreToken", token)
  }

  getToken() {
    return localStorage.getItem("ConsumatoreToken")
  }

  verificaMail(tokenVerifica: string) : Observable<any> {
    return this.httpClient.post(this.baseURL + "/register/" + tokenVerifica, {})
  }

  register(email: string, password: string): Observable<any> {
    return this.httpClient.post(this.baseURL + "/register", {email: email, password: password})
  }

  recuperaPassword(email: string) {
    const headers = new HttpHeaders({});
    const params = new HttpParams().set("email", email);

    return this.httpClient.get<any>(`${this.baseURL}/recover_password`, {headers, params})
  }

  modificaPasswordDaMail(token: string, new_password: string) : Observable<any> {
    return this.httpClient.post(this.baseURL + "/recover_password", {token, new_password})
  }

  getOrdiniConsumatore(filtri: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(filtri)) {
      params = params.set(key, JSON.stringify(value))
    }

    return this.httpClient.get<any>(`${this.baseURL}/consumatore/ordini`, { headers, params});
  }

  cancellaOrdine(ordineId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.put<any>(`${this.baseURL}/consumatore/ordini/cancel`, {ordine_id: ordineId}, { headers });
  }

  eliminaOrdine(ordineId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    const params = new HttpParams().set("ordine_id", ordineId)

    return this.httpClient.delete<any>(`${this.baseURL}/consumatore/ordini`, { headers, params });
  }

  modificaOrdine(copisteria_id: number, ordine_id: number, formato_carta: string, metodo_di_stampa: string, inizio_fascia: string, fine_fascia: string, add_on: string[]) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.put<any>(`${this.baseURL}/consumatore/ordini`, {copisteria_id, ordine_id, formato_carta, metodo_di_stampa, inizio_fascia, fine_fascia, add_on}, { headers });
  }

  getCopisterie(filtri: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(filtri)) {
      params = params.set(key, JSON.stringify(value))
    }

    return this.httpClient.get<any>(`${this.baseURL}/public/copisterie`, { headers, params});
  }

  getFasceOrarie(filtri: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(filtri)) {
      params = params.set(key, JSON.stringify(value))
    }

    return this.httpClient.get<any>(`${this.baseURL}/public/fasce_orarie`, { headers, params});
  }

  creaOrdine(formData: FormData): Observable<any> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.post(`${this.baseURL}/consumatore/ordini`, formData, {headers});
  }

  segnalaCopisteria(copisteria_id: number, motivazione: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.post(`${this.baseURL}/consumatore/segnalazioni`, {copisteria_id, motivazione}, {headers});
  }

  modificaPassword(vecchia_password: string, nuova_password: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.httpClient.put(`${this.baseURL}/consumatore/password`, {vecchia_password, password: nuova_password}, {headers});
  }

  richiediPreventivo(caratteristiche: any) {
    let params = new HttpParams()
    for(const [key, value] of Object.entries(caratteristiche)) {
      params = params.set(key, JSON.stringify(value))
    }

    return this.httpClient.get<any>(`${this.baseURL}/public/preventivo`, {params});
  }
}
