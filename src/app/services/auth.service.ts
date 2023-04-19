import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router:Router
    ) { }

  currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  dataf : any;

  jwtHelperService =new JwtHelperService();
  baseServerURl = "https://localhost:44361/api/"

  //CREATING NEW USER
  registerUser(user : Array<any>){
    return this.http.post(this.baseServerURl + "User/CreateUser" ,{
      FirstName : user[0],
      LastName : user[1],
      Email : user[2],
      Mobile : user[3],
      Gender : user[4],
      Pwd : user[5]
    },
     {responseType: 'text'});
  }

  //LOGIN FUNCTION IS CALLED FROM BACKEND
  LoginUser(loginInfo: Array<any>)
  {
    return this.http.post(this.baseServerURl + 'User/UserLogin' ,
    {
      Email: loginInfo[0],
      Pwd: loginInfo[1]
    },
    {
      responseType:'text',
    });
  }

  //"access_token" token is set 
  setToken(token: string){
    localStorage.setItem("access_token", token);
    this.loadCurrentUser();
  }

  //
  loadCurrentUser(){
    const token = localStorage.getItem("access_token");
    const userInfo= token !=null ? this.jwtHelperService.decodeToken(token) : null;
    const data=userInfo ?{
      id: userInfo.id,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      email: userInfo.email,
      mobile: userInfo.mobile,
      gender: userInfo.gender
    } : null;
    this.currentUser.next(data);
  }
  getproduct(){
    var dataf = this.loadCurrentUser()
    console.log(dataf);
  }
  IsLoggedin() : boolean{
    return localStorage.getItem("access_token") ? true : false;
  }

  
  loggedin(){
    return !!localStorage.getItem("access_token");
  }

  //REMOVING THE TOKEN
  LogOut(){
    localStorage.removeItem("access_token")
    this.router.navigate(['login'])
  }
}
