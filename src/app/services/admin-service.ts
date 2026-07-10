import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Copisteria } from '@models/copisteria';
import { Segnalazione } from '@models/segnalazione';
import { Consumatore } from '@models/consumatore';
import { switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {

  }

  private baseURL: string = "http://localhost:3000"

  setToken(token: string) {
    localStorage.setItem("AdminToken", token)
  }

  getToken() {
    return localStorage.getItem("AdminToken")
  }

  copisterie: Copisteria[] = [];
  filtri_copisterie: any = {};

  refreshCopisterie() {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(this.filtri_copisterie)) {
      params = params.set(key, JSON.stringify(value))
    }

    this.httpClient.get(this.baseURL + "/admin/copisterie", {headers, params}).subscribe({
      error: err => console.log(err),
      next: (value) => {
        this.copisterie = value as Copisteria[];
      },
    })
  }

  eliminaCopisteria(copisteria_id: number) {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });
    return this.httpClient.delete(this.baseURL + "/admin/copisterie", {headers, body: { copisteria_id }}).pipe(
      tap(() => {
        this.copisterie = this.copisterie.filter(c => c.copisteria_id !== copisteria_id)
      })
    )
  }

  creaCopisteria(copisteria: Copisteria, password: string) {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });
    return this.httpClient.post(this.baseURL + "/admin/copisterie", {...copisteria, password}, { headers })
  }

  modificaCopisteria(copisteria: Copisteria, password: string) {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });

    return this.httpClient.put(this.baseURL + "/admin/copisterie", password ? {...copisteria, password} : copisteria, {headers})
  }

  segnalazioni: Segnalazione[] = [];
  filtri_segnalazioni: any = {};

  refreshSegnalazioni() {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(this.filtri_segnalazioni)) {
      params = params.set(key, JSON.stringify(value))
    }

    this.httpClient.get(this.baseURL + "/admin/segnalazioni", {headers, params}).subscribe({
      error: err => console.log(err),
      next: (value) => {
        this.segnalazioni = value as Segnalazione[];
      },
    })
  }

  consumatori: Consumatore[] = [];
  filtri_consumatori: any = {};

  refreshConsumatori() {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });

    let params = new HttpParams();

    for(const [key, value] of Object.entries(this.filtri_consumatori)) {
      params = params.set(key, JSON.stringify(value))
    }

    this.httpClient.get(this.baseURL + "/admin/consumatori", {headers, params}).subscribe({
      error: err => console.log(err),
      next: (value) => {
        this.consumatori = value as Consumatore[];
      },
    })
  }

  eliminaConsumatore(consumatore_id: number, motivazione: string) {
    const headers = new HttpHeaders({
      authorization: "Bare " + this.getToken()!
    });
    return this.httpClient.delete(this.baseURL + "/admin/consumatori", {headers, body: { consumatore_id, motivazione }}).pipe(
      tap(() => {
        this.consumatori = this.consumatori.filter(c => c.consumatore_id !== consumatore_id)
      })
    )
  }


}
