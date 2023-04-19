import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  baseurl ="https://localhost:44361/api/Details/";

  constructor(private http : HttpClient) { }

  
  getProducts(category: string,subcategory: string,count: number){
    return this.http.get<any[]>(this.baseurl + 'GetProducts', {
      params: new HttpParams()
      .set('category', category)
      .set('subcategory', subcategory)
      .set('count',count)
    })
  }
}
