import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtilityService } from '../services/utility.service';
import { Cart, Payment, ProductDetail } from '../models/models';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  public displayMsg: string ='';
  // CART INTERFACE
  public usersCart: Cart = {
    id: 0,
    user: this.utilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: '',
  };


  //PAYMENT INTERFACE
  public usersPaymentInfo: Payment = {
    id: 0,
    user: this.utilityService.getUser(),
    paymentMethod: {
      id: 0,
      type: '',
      provider: '',
      available: false,
      reason: '',
    },
    totalAmount: 0,
    shippingCharges: 0,
    amountReduced: 0,
    amountPaid: 0,
    createdAt: '',
  };

  //INTIALIZE CART INTERFACE
  public usersPreviousCarts: Cart[] = [];

  constructor(
    private adminService: AdminService,
    public utilityService: UtilityService,
  ) { }

  ngOnInit(): void {
    //cart
    const cartSubscription = this.utilityService.getActiveCartOfUser(this.utilityService.getUser().userid)
      .pipe(
        catchError((error: any) => {
          console.log('Error occurred while fetching user cart:', error);
          return [];
        })
      )
      .subscribe((res: any) => {
        this.usersCart = res;
        console.log(this.usersCart.cartItems);
        this.shippingCharges();

        //payment
        this.utilityService.calculatePayment(
          this.usersCart,
          this.usersPaymentInfo
        );

        //previous cart
        const previousCartSubscription = this.utilityService.getAllPreviousCarts(this.utilityService.getUser().userid)
          .pipe(
            catchError((error: any) => {
              console.log('Error occurred while fetching user previous carts:', error);
              return [];
            })
          )
          .subscribe((res: any) => {
            this.usersPreviousCarts = res;
          });

        this.subscriptions.add(previousCartSubscription);
      });

    this.subscriptions.add(cartSubscription);
  }
  
  public shippingCharges(): void {
    if(this.usersPaymentInfo.totalAmount < 1000) {
      this.displayMsg = '₹200 for Orders less than ₹1000';
      this.usersPaymentInfo.shippingCharges = 200;
    } else {
      this.usersPaymentInfo.shippingCharges = 0;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}



