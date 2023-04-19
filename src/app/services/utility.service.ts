import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { Cart, Order, Payment, PaymentMethod, ProductDetail, User } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})


export class UtilityService implements OnInit {
  // CREATED NEW 
  ChangeCart =new Subject();

  //URL
  baseurl ='https://localhost:44361/Product/';

  constructor(
    private http:HttpClient,
    public jwt:JwtHelperService,
    public auth:AuthService
    ) { }


  ngOnInit(): void {}

  // Get user for getting User's Id
  getUser(): User {
    let token = this.jwt.decodeToken();
    let user: User = {
      userid: token.id,
      firstName: token.firstName,
      lastName: token.lastName,
      mobile: token.mobile,
      email: token.email,
      pwd: '',
      gender: token.gender,
      membersince : token.membersince,
    };
      return user;
    }

  //Add to cart method Applied on button

  addToCart (product : ProductDetail){
    let productid=product.id;
    let userid = this.getUser().userid;
    console.log(userid);
    console.log(productid);
    this.addToCart2(userid,productid).subscribe((res : any)=>
    {
      if(res.toString() =='inserted') this.ChangeCart.next(1);
    })
  }

  //FUNCATION FOR BACKEND
  addToCart2 (userid : number, productid: number){
    let url=this.baseurl + 'InsertCartItem/' + userid + '/' + productid;
    return this.http.post(url,null,{responseType: 'text'});
 }



//ACTIVE CART DETAILS
public getActiveCartOfUser(userid: number): Observable<Cart> {
  const url = this.baseurl + 'GetActiveCartOfUser/' + userid;
  return this.http.get<Cart>(url);
}

//PAYMENT CALCULATION OF CURRENT CART
public calculatePayment(cart: Cart, payment: Payment): void {
  payment.totalAmount = 0;
  payment.amountPaid = 0;
  payment.amountReduced = 0;
  for (let Cartitem of cart.cartItems) {
    payment.totalAmount += Number(Cartitem.productDetail.price);
    payment.amountPaid = payment.totalAmount;
  }
  if (payment.amountPaid < 1000) {
    payment.shippingCharges = 200;
    payment.amountPaid = payment.totalAmount + payment.shippingCharges;
  } else {
    payment.shippingCharges = 0;
    payment.amountPaid = payment.totalAmount;
  }
}

//PREVIOUS CART FUNCTION
public getAllPreviousCarts(userid: number): Observable<Cart[]> {
  const url = this.baseurl + 'GetAllPreviousCartsOfUser/' + userid;
  return this.http.get<Cart[]>(url);
}

//PAYMENT METHOD TYPE CALLING
public getPaymentMethods(): Observable<PaymentMethod[]> {
  const url = this.baseurl + 'GetPaymentMethods';
  return this.http.get<PaymentMethod[]>(url);
}

//PAYMENT INSERTION
public insertPayment(payment: Payment): Observable<any> {
  return this.http.post<any>(this.baseurl + 'InsertPayment', payment, { responseType: 'json' });
}

//ORDERED INSERTION
public insertOrder(order: Order): Observable<any> {
  return this.http.post<any>(this.baseurl + 'InsertOrder', order);
}

removeCartItem(userId: number, cartItemId: number) {
  const url = `${this.baseurl}RemoveCartItem/${userId}/${cartItemId}`;
  return this.http.delete(url);
}

}
