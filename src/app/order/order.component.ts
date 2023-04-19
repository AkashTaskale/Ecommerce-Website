import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cart, Order, Payment, PaymentMethod, User } from '../models/models';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public SelectedPaymentMethodName = '';
  public SelectedPaymentMethod = new FormControl('0');
  public Spinner = false;
  public Message = '';
  public Class = '';
  public Tracking = false;

  //PAYMENTMETHOD INTERFACE
  public PaymentMethods: PaymentMethod[] = [];

  //CART INTERFACE
  public UsersCart: Cart = {
    id: 0,
    user: this.UtilityService.getUser(),
    cartItems: [],
    ordered: false,
    orderedOn: '',
  };

  //PAYMENT INTERFACE
  public usersPaymentInfo: Payment = {
    id: 0,
    user: this.UtilityService.getUser(),
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

  constructor(
    public UtilityService: UtilityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get Payment Methods
    const paymentsubscribe = this.UtilityService
      .getPaymentMethods()
      .pipe(
        catchError((error: any) => {
          this.Spinner = false;
          this.Message = 'Something went wrong while getting payment methods';
          return throwError(() => new Error('Error'));
        })
      )
      .subscribe(
        (res) => {
          this.PaymentMethods = res;
        }
      );

    const selectpaymentsubscribe = this.SelectedPaymentMethod.valueChanges.subscribe(
      (res: any) => {
        if (res === '0') this.SelectedPaymentMethodName = '';
        else this.SelectedPaymentMethodName = res.toString();
      }
    );

    // get cart
    const activecartsubscribe = this.UtilityService
      .getActiveCartOfUser(this.UtilityService.getUser().userid)
      .pipe(
        catchError((error: any) => {
          this.Spinner = false;
          this.Message = 'Something went wrong while getting active cart of user';
          return throwError(() => new Error('Error'));
        })
      )
      .subscribe(
        (res: any) => {
          this.UsersCart = res;

          //price
          this.UtilityService.calculatePayment(res, this.usersPaymentInfo);

          //ADDING SUBSCRIBE
          this.subscriptions.add(paymentsubscribe);
          this.subscriptions.add(selectpaymentsubscribe);
          this.subscriptions.add(activecartsubscribe);
        },
      );
  }

  //PAYMENT METHOD OF USER
  public GetPaymentMethod(id: string): string {
    let x = this.PaymentMethods.find((v) => v.id == parseInt(id));
    return x?.type + ' - ' + x?.provider;
  }

  //PROCED TO PAYMENT
  public PlaceOrder(): void {
    this.Spinner = true;
    let PaymentSuccessfull = this.AmountPaid();


    if (!PaymentSuccessfull) {
      this.Spinner = false;
      this.Message = 'Something went wrong!!!! Payment not received';
      return;
    }

    let step = 0;
    let count = timer(0, 3000).subscribe((res) => {
      ++step;
      if (step == 1) {
        this.Message = 'Initailizing Payment';
        this.Class = 'text-success';
      }
      if (step == 2) {
        this.Message = 'Payment Received Successfully, Order is being placed.';
        this.Class = 'text-success';
        this.StoreOrder();
      }
      if (step == 3) {
        this.Message = 'Order Placed';
        this.Spinner = false;
        this.Tracking = true;

      }
      if (step == 4) {
        this.Message = 'THANK YOU FOR SHOPPING';
        this.Tracking = true;

      }
      if (step == 5) {
        this.router.navigateByUrl('/home');
        count.unsubscribe();
      }
    })
  }
  public AmountPaid(): boolean {
    return true;
  }
  public StoreOrder(): void {
    let payment: Payment;
    let paymentId = 0;
    if (this.SelectedPaymentMethod.value)
      paymentId = parseInt(this.SelectedPaymentMethod.value);
    payment = {
      id: 0,
      paymentMethod: {
        id: paymentId,
        type: '',
        provider: '',
        available: false,
        reason: '',
      },
      user: this.UtilityService.getUser(),
      totalAmount: this.usersPaymentInfo.totalAmount,
      amountReduced: this.usersPaymentInfo.amountReduced,
      shippingCharges: this.usersPaymentInfo.shippingCharges,
      amountPaid: this.usersPaymentInfo.amountPaid,
      createdAt: '',
    };
    console.log(payment),

      this.subscriptions = this.UtilityService.insertPayment(payment).subscribe((paymentResponse: any) => {
        payment.id = parseInt(paymentResponse);
        let order: Order = {
          id: 0,
          user: this.UtilityService.getUser(),
          cart: this.UsersCart,
          payment: payment,
          createdAt: '',
        };
        console.log(order.user.userid),
          this.subscriptions = this.UtilityService.insertOrder(order).subscribe((orderResponse) => {
            this.UtilityService.ChangeCart.next(0);
          })

      });


  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
