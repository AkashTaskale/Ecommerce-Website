import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  repeatpass = 'none';
  displayMsg = '';
  isAccountCreated = false;
  private registerSubscription = new Subscription();


  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.registerSubscription.unsubscribe();
  }

  public registerForm = new FormGroup({
    firstname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern("[a-zA-Z].*")
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern("[a-zA-Z].*")
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    mobile: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("[0-9]*")
    ]),
    gender: new FormControl("", [
      Validators.required,
    ]),
    pwd: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(15),
    ]),
    rpwd: new FormControl(""),
  });

  public registerSubmitted() {
    if (this.PWD.value === this.RPWD.value) {
      console.log(this.registerForm.valid);

      this.registerSubscription = this.authService.registerUser([
        this.registerForm.value.firstname,
        this.registerForm.value.lastname,
        this.registerForm.value.email,
        this.registerForm.value.mobile,
        this.registerForm.value.gender,
        this.registerForm.value.pwd
      ]).subscribe({
        next: res => {
          if (res === 'Success') {
            this.displayMsg = 'Account Created Successfully';
            this.isAccountCreated = true;
          }
          else if (res === 'Already Exists') {
            this.displayMsg = 'Account Already exist ';
            this.isAccountCreated = false;
          }
          else {
            this.displayMsg = 'Something went wrong';
            this.isAccountCreated = false;
          }
          console.log(res);
        },
        error: err => {
          console.error(err);
          this.displayMsg = 'Something went wrong';
          this.isAccountCreated = false;
        }
      });
    }
    else {
      this.displayMsg = 'Repeat password do not matched with password';
    }
  }

  public get FirstName(): FormControl {
    return this.registerForm.get("firstname") as FormControl;
  }

  public get LastName(): FormControl {
    return this.registerForm.get("lastname") as FormControl;
  }

  public get Email(): FormControl {
    return this.registerForm.get("email") as FormControl;
  }

  public get Mobile(): FormControl {
    return this.registerForm.get("mobile") as FormControl;
  }

  public get Gender(): FormControl {
    return this.registerForm.get("gender") as FormControl;
  }

  public get PWD(): FormControl {
    return this.registerForm.get("pwd") as FormControl;
  }
  public get RPWD(): FormControl {
    return this.registerForm.get("rpwd") as FormControl;
  }

}