import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Cart, Payment, ProductDetail } from '../models/models';
import { AdminService } from '../services/admin.service';
import { UtilityService } from '../services/utility.service';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {
  @Input() view: 'grid' | 'currentcartitem' | 'previouscart' = 'grid';
  @Input() product: ProductDetail = {
    id: 0,
    title: '',
    description: '',
    price: '',
    quantity: '',
    author: '',
    image: ''
  }
  @Input()   productList: any;
  title = 'products';
  products: ProductDetail[] = [];
  searchText: string = '';
  private subscriptions: Subscription = new Subscription();


  constructor(
    private adminService: AdminService,
    public utilityService: UtilityService
  ) { }


  ngOnInit(): void {
    this.GetProductData();
  }

  // GET ALL PRODUCT DETAILS CALLED FROM ADMIN SERVICE
  GetProductData() : void {
    const subscription = this.adminService.GetAllProduct().pipe(
      catchError((error) => {
        console.error('Error occurred while fetching product data: ', error);
        return throwError(() => new Error('Error'));        
      })
    ).subscribe(
      (data) => {
        this.productList = data;
      }
    );

    // Add the subscription to the subscriptions object
    this.subscriptions.add(subscription);
  }

  // SEARCH FUNCTIONALITY 
  OnSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
    console.log(this.searchText);
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions when the component is destroyed
    this.subscriptions.unsubscribe();
  }
}
