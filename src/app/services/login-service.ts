import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  baseUrl= "http://localhost:3000";
  constructor(private http_Client: HttpClient){}

  login(nome: string, password: string): Observable<any>{
    const params = new HttpParams().set("nome", nome).set("password", password);
    return this.http_Client.get(this.baseUrl + "/login",{params})
  }
}
