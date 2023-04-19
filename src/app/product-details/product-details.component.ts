import { Component, Input ,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetail } from '../models/models';
import { AdminService } from '../services/admin.service';
import { UtilityService } from '../services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  @Input() product: ProductDetail = {
    id: 0,
    title: '',
    description: '',
    price: '',
    quantity: '',
    author:'',
    image:''
  }

ProductData :any | undefined;
title ='products';
productList : any;
private subscriptions: Subscription = new Subscription();


constructor(
  private activeRoute:ActivatedRoute, 
  private adminservice:AdminService,
  public utilityService :UtilityService
  ){}
  
ngOnInit(): void {
  this.GetProductData();
  // GEETING PRODUCT ID FROM THE IMAGE WHEN CLICKED 
  let productId = this.activeRoute.snapshot.paramMap.get('productId');
  console.log(productId);
  productId && this.adminservice.GetProductById(productId).subscribe(data =>{
    this.ProductData= data;
  })

  
}

// GEETING ALL PRODUCT DETAILS
GetProductData(){
 this.subscriptions= this.adminservice.GetAllProduct().subscribe( data => {
 this.productList = data;
  })
}
ngOnDestroy(): void {
  this.subscriptions.unsubscribe();
}
}
