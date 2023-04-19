import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  baseUrl ='https://localhost:44361/Product';

  //ADDING NEW PRODUCT
  SaveProduct(ProductData : any): Observable<any> {
    return this.http.post<any>(this.baseUrl, ProductData);
  }

  //UPDATING/EDITING THE PRODUCT DEATILS
  UpdateProduct(ProductData : any): Observable<any> {
    return this.http.put<any>(this.baseUrl, ProductData);
  }

  //GET ALL PRODUCT DETAILS
  GetAllProduct(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  //GETTING SINGLE PRODUCT BY ID
  GetProductById(Id : any): Observable<any> {
    return this.http.get<any>('https://localhost:44361/Product/' + Id);
  }

  //DELETING SINGLE PRODUCT BY ID
  DeleteProductById(Id : any): Observable<any> {
    return this.http.delete<any>('https://localhost:44361/Product/' + Id);
  }
}