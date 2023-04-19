import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  
  private subscriptions: Subscription[] = [];

  constructor (
    public router: Router,
    private AuthService: AuthService
  ) {}

  // ROUTING TO REGISTER PAGE
  public CreateNew(): void {  
    this.router.navigate(['/register']);  
  }    

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  // VALIDATION FOR LOGIN PAGE
  public LoginForm: FormGroup = new FormGroup({
    email: new FormControl('',
      [
        Validators.required, 
        Validators.email
      ]
    ),
    pwd: new FormControl('',
      [
        Validators.required ,  
        Validators.minLength(6),
        Validators.maxLength(15),
      ]
    )
  });

  private ValidUser = false;

  // FUNCTION CALLED AFTER CLICKING LOGIN BUTTON
  public LoginSubmitted(): void {
    const LoginSub: Subscription = this.AuthService.LoginUser([
      this.LoginForm.value.email,
      this.LoginForm.value.pwd
    ])
    .pipe(
      catchError((error) => {
        console.error(error);
        alert('There was an error logging in. Please try again.');
        return throwError(() => new Error('Error logging in'));
      })
    )
    .subscribe(res => {
      this.ValidUser = true;
      this.AuthService.setToken(res);
      this.router.navigate(['/home']);
    });

    this.subscriptions.push(LoginSub);
  }

  // FORM CONTROL
  public get Email(): FormControl {
    return this.LoginForm.get("email") as FormControl;
  }

  public get PWD(): FormControl {
    return this.LoginForm.get("pwd") as FormControl;
  }
}