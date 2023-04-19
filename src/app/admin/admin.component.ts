import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  productForm!: FormGroup;
  productList: any[] = [];
  productid: number | null = null;

  //BUTTON NAME
  btnName = 'Save';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private adminservice: AdminService
  ) { }

  ngOnInit(): void {
    //FORMGROUP
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      author: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });

    //CALLED GETPRODUCTDATA
    this.getProductData();
  }

  //SUBMIT FUNCTION
  public onSubmit(): void {
    if (this.productid && this.productid > 0) {

      const productdataforupdate = {
        id: this.productid,
        title: this.productForm.controls.title.value,
        quantity: this.productForm.controls.quantity.value,
        description: this.productForm.controls.description.value,
        author: this.productForm.controls.author.value,
        price: this.productForm.controls.price.value,
        image: this.productForm.controls.image.value,
      };

      // UPDATE IF EXISTING PRODUCT
      this.subscriptions.add(this.adminservice.UpdateProduct(productdataforupdate)
        .subscribe((data: any) => {
          this.getProductData();
          this.productForm.reset();
          this.btnName = 'Save';
        })
      );
    }

    //ADD IF NEW PRODUCT
    else {
      this.subscriptions.add(this.adminservice.SaveProduct(this.productForm.value)
        .subscribe((data: any) => {
          this.getProductData();
          this.productForm.reset();
        })
      );
    }
  }

  //ALL PRODUCT DATA
  public getProductData(): void {
    this.subscriptions.add(this.adminservice.GetAllProduct()
      .pipe(
        map((data: any) => data ?? [])
      )
      .subscribe((data: any) => {
        this.productList = data;
      })
    );
  }

  //EDIT PRODUCT
  public editProduct(id: number): void {
    this.subscriptions.add(this.adminservice.GetProductById(id)
      .subscribe((data: any) => {
        this.productid = data?.id;
        this.btnName = 'Update';
        this.productForm.patchValue(data);
      })
    );
  }

  // DELETE PRODUCT
  public deleteProduct(id: number): void {
    this.subscriptions.add(this.adminservice.DeleteProductById(id)
      .subscribe(() => {
        this.getProductData();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}