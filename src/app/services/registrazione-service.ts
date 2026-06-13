import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistrazioneService {
  constructor(private httpClient: HttpClient) {}

  private baseURL: string = "http://localhost:3000"

  register(email: string, password: string): Observable<any> {
    return this.httpClient.post(this.baseURL + "/register", {email: email, password: password})
  }
}
