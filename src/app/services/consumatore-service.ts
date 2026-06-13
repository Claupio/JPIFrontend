import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConsumatoreService {
  constructor(private httpClient: HttpClient) {}

  private baseURL: string = "http://localhost:3000"
}
