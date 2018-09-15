import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';
import {UserService} from '../../providers/user-service';
import {DataService} from '../../providers/data-service';
import {User} from '../../models/user-model';
import {Size} from '../../models/size-model';
import {Md5} from 'ts-md5/dist/md5';
import { FormControl } from '@angular/forms';
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";


/**
 * Generated class for the SignUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 *
 * start() set up sign up variables
 * handleStage() set question for each stage of sign up
 * validate() validation for each stage of sign up
 * checkEmail() check for duplicate email in system
 * processUser() send user to database and save
 * next() if validStage then go to next stage of sign up
 * back() go back 1 stage in sign up <--
 * done() finish
 *
 * showAlert (title,message)

 */

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {

question:any;
  stage:any;
  validStage:any = false;
  isNewEmail:any = false;

  code:any;
  type:any;
  serviceType:any;
  name:any;
  gender:any;
  city:any;
  phone:any;
  email:any;
  sizeCode:any;
  password:any;
  confirmPassword:any;
  savedUser:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private errorHandlerProvider: ErrorHandlerProvider,public userService:UserService,public dataService:DataService) {
    this.start();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  start(){

    //new user variables

    this.stage = 0;
    this.question = "";
    this.code = this.generateCode();
    this.type= "";
    this.name = "";
    this.gender = "";
    this.city = "";
    this.phone = "";
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    this.serviceType = "";
    this.sizeCode = this.generateCode();

    this.handleStage(); //begin sign up
  }

  generateCode(){

  //new user code

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 50; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    text = 'user' + text;

    return text;


  }


//handle stage of sign up
  handleStage(){
    switch(this.stage){
      case 0:
        this.question = "Account Type:";
        break;
      case 1:
        this.question = "What's your email?";
        break;
      case 2:
        this.question = "What's your Name?";
        break;
      case 3:
        this.question = "What's your gender?";
        break;
      case 4:
        this.question = "What city are you in?";
        break;
     /* case 5:
        this.question = "What's your phone number?";
        break;*/
      case 5:
        this.question = "Enter Password:";
        break;
      case 6:
        this.question = "Thank You.";
        break;
    }
  }

  validate(){

    //validation for each stage of sign up

    let valid = false;

    switch(this.stage){
      case 0:
        if(this.type == "customer"  ){
          valid = true;
        }else if(this.type == "service" && this.serviceType.length > 0){
          valid = true;
        }else{
          this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[0].title, ErrorHandlerProvider.MESSAGES.validation.signup[0].msg);
        }
        break;
      case 1:
        if(this.email != "" ){
          //check email address
          if(this.isNewEmail){
            valid = true;

          }else{
            //validate email format
            this.checkEmail();
          }

        }else{
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[1].title, ErrorHandlerProvider.MESSAGES.validation.signup[1].msg);
        }
        break;
      case 2:

        if(this.name != ""){
          valid = true;
        }else{
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[2].title,   ErrorHandlerProvider.MESSAGES.validation.signup[2].msg);
        }
        break;

      case 3:
        if(this.gender.length > 0 ){
          valid = true;
        }else{
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[3].title, ErrorHandlerProvider.MESSAGES.validation.signup[3].msg);
        }
        break;

      case 4:
        if(this.city != "" ){
          valid = true;
        }else{
            this.errorHandlerProvider.throwValideWarning( ErrorHandlerProvider.MESSAGES.validation.signup[4].title, ErrorHandlerProvider.MESSAGES.validation.signup[4].msg);
        }
        break;

     /* case 5:
        let re = /^[0-9]*$/;
        if((this.phone != "") && (re.test(this.phone))) {
          valid = true;

        }else{
          this.showAlert('Validation Error','Invalid Phone Number');
        }

        break;*/

      case 5:
        if(this.password != this.confirmPassword){
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[5].title, ErrorHandlerProvider.MESSAGES.validation.signup[5].msg);
            }else if(this.password.length < 7 ){
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[6].title, ErrorHandlerProvider.MESSAGES.validation.signup[6].msg);

        }else{
          this.processUser();
        }
        break;
    }

    return valid;
  }


  checkEmail(){

    //check for duplicate email in system
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.isNewEmail = false;

    this.userService.checkEmail(this.email).subscribe(data =>{

      console.log(data);

      if (re.test(this.email)){

        if (data.message == 0){
          console.log('new email');
          this.stage = this.stage + 1 ;
          this.handleStage();
        }
        else{
          console.log('email exists');
            this.errorHandlerProvider.throwWarning(ErrorHandlerProvider.MESSAGES.warning.signup[0].title, ErrorHandlerProvider.MESSAGES.warning.signup[0].msg);
        }
      }
      else{
        console.log("")
          this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[7].title, ErrorHandlerProvider.MESSAGES.validation.signup[7].msg);
          }



    },
    err => {
        this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.error.signup[0].title, ErrorHandlerProvider.MESSAGES.error.signup[0].msg);
        }

  );

  }

  processUser(){

    //send user to database and save
    let newUser = new User('',this.code,this.type,this.serviceType,'','','','','',this.name,this.gender,this.email,this.city,true,'short description','@username','@username','@username','http://www.sczr.co.uk',this.sizeCode,0,Md5.hashStr(this.password));
    this.userService.saveUser(newUser).subscribe(data =>{

        if(data.message == "Successful"){
          this.errorHandlerProvider.throwSuccess(ErrorHandlerProvider.MESSAGES.success.signup[0].title, ErrorHandlerProvider.MESSAGES.success.signup[0].msg);
          newUser.id = data.insertID;
          if(this.type == 'customer'){
              let sizeFile = new Size('', this.sizeCode, newUser.id,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
              this.dataService.saveSize(sizeFile);
          }
          this.savedUser = newUser;
          this.question = "Thank You.";
          this.stage = this.stage + 1 ;
          this.handleStage();

        }else{
            this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.error.signup[1].title, ErrorHandlerProvider.MESSAGES.error.signup[1].msg);
        }

    },
    err => {
        this.errorHandlerProvider.throwError(ErrorHandlerProvider.MESSAGES.error.signup[1].title, ErrorHandlerProvider.MESSAGES.error.signup[1].msg);
    });
  }

  next(){
    //next
    //if validStage then go to next stage of sign up

    this.validStage = this.validate();

    if(this.validStage){
      this.stage = this.stage + 1 ;
      this.handleStage();
      }

    //need to validate before next

  }

  back(){

    //back

    if(this.stage == 0){
      this.navCtrl.setRoot(LoginPage);
    }else{
      this.stage = this.stage - 1 ;
      this.handleStage();
    }

  }

  done(){

    this.savedUser.image = this.dataService.apiUrl + "images/" +  this.savedUser.image;
    this.userService.setUser(this.savedUser);
    this.dataService.permission = this.userService.getPermission(this.savedUser);
    this.dataService.me = this.savedUser;
    this.dataService.getLikes();

    if(this.savedUser.type == "customer"){
      this.dataService.getSizeFile();
    }

    this.navCtrl.setRoot(TabsPage);
    console.log('done- segue now');
  }

}
