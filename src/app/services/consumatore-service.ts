import { HttpClient, HttpParams } from '@angular/common/http';
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
    let params = new HttpParams().set("email", email);

    return this.httpClient.get<any>(`${this.baseURL}/copisteria/ordini`, { params})
  }

  modificaPasswordDaMail(token: string, new_password: string) : Observable<any> {
    return this.httpClient.post(this.baseURL + "/recover_password", {token, new_password})
  }
}
