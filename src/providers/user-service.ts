import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions   } from '@angular/http';
import 'rxjs/add/operator/map';

import {AppSettings} from './app-settings';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserService {

  apiUrl = this.appSettings.getApiURl();
  user:any;

  constructor(public http: Http,public appSettings:AppSettings) {
    console.log('Hello UserServiceProvider Provider');
  }

  /*
  * set user as user from login
  *
  *
  *
  * */


  public setUser(user){

    console.log("set user", user);
    this.user = user;
    console.log("user!!",user.type);

  }


  checkEmail(email){

    var parameters:any = JSON.stringify({email:email});

    console.log(parameters);


    let body:string = parameters,
      type:string = "application/json",
      headers:any = new Headers({'Content-Type': type}),
      options:any = new RequestOptions({headers: headers}),
      url:any = this.apiUrl + 'checkEmail';


    return this.http.post(url, body, options).map(response => response.json());

  }

  saveUser(newUser){

    var parameters:any = JSON.stringify(newUser);

    console.log(parameters);


    let body:string = parameters,
      type:string = "application/json",
      headers:any = new Headers({'Content-Type': type}),
      options:any = new RequestOptions({headers: headers}),
      url:any = this.apiUrl + 'saveUser';


    return this.http.post(url, body, options).map(response => response.json());

  }

  getPermission(user){

    return user.type;

  }



}
