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

  recuperaPassword(email: string) {
    const headers = new HttpHeaders({});
    const params = new HttpParams().set("email", email);

    console.log(email)
    return this.httpClient.get<any>(`${this.baseURL}/recover_password`, {headers, params})
  }

  modificaPasswordDaMail(token: string, new_password: string) : Observable<any> {
    return this.httpClient.post(this.baseURL + "/recover_password", {token, new_password})
  }

  getOrdiniConsumatore(filtri: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });

    console.log("Token in getOrdiniConsumatore:", this.getToken());

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

  
}
