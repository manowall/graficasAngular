import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private baseURL = "https://pomber.github.io/covid19/timeseries.json";

  constructor(private httpClient:HttpClient) { }

  public getAll():Observable<any>{
    return this.httpClient.get<any>(this.baseURL);
  }

  public fromCountry(country:string):Observable<any[]>{
    return this.getAll().pipe(map(data => data[country]));
  }

  public twoDates(country:string, dateFrom: Date, dateTo:Date):Observable<any[]>{
    return this.fromCountry(country)
    .pipe(map(res => res.filter(val => new Date(val.date) >= dateFrom && new Date(val.date) <= dateTo)));
  }
}
