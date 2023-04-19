import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  cartItems: number = 0;
  private cartSubscription: Subscription = new Subscription();

  constructor(
    public Auth: AuthService,
    private router: Router,
    public UtilityService: UtilityService
  ) { }

  ngOnInit(): void {
    if (this.Auth.IsLoggedin()) {
      this.cartSubscription = this.UtilityService.getActiveCartOfUser(this.UtilityService.getUser().userid)
        .subscribe((res: any) => {
          this.cartItems = res.Cartitems.length
        });
    }
    this.UtilityService.ChangeCart.subscribe((res: any) => {
      if (parseInt(res) === 0) {this.cartItems = 0}
      else {this.cartItems += parseInt(res)};
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}