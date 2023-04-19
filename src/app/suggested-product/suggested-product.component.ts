import { Component, Input, OnInit } from '@angular/core';
import { ProductDetail } from '../models/models';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-suggested-product',
  templateUrl: './suggested-product.component.html',
  styleUrls: ['./suggested-product.component.css']
})
export class SuggestedProductComponent implements OnInit{



  constructor(private adminService:AdminService) {}

  ngOnInit(): void {
}
}
