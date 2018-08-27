import { Injectable } from '@angular/core';
import {AlertController} from "ionic-angular";

/*
  Generated class for the ErrorHandlerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class ErrorHandlerProvider {

    static MESSAGES =
    {
        validation:
        {
            login:
            [
                {title:'Incorrect data',msg:'Invalid Email or Password.<br> Check lengths of Email and Password'}
            ],
            signup:
            [
                {title:'Validation error',msg:"Please select type"},
                {title:'Validation error',msg:"Enter Valid Email"},
                {title:'Validation error',msg:"Enter Full Name"},
                {title:'Validation error',msg:"Please select your gender"},
                {title:'Validation error',msg:"Enter City"},
                {title:'Validation error',msg:"Passwords do not match"},
                {title:'Validation error',msg:"Password must be at least 7 characters long"},
                {title:'Validation error',msg:"Invalid Email"},
            ]
        }
        ,
        success:
        {
            signup:
            [
                {title:"Sign up",msg:"Successful. Welcome to the Scizzor"},
            ]
        },
        error:
        {
            signup:
            [
                {title: "Unable to confirm",msg:"Unable to confirm email, please try again later"},
                {title: "Oops",msg:"Please try again"},
            ],
            branch:
            [
                {title: "Deeplink",msg:"No matching links"},
            ],
            like:
            [
                {title: "Save like",msg:"Oops. Please try again later"},
                {title: "Get likes",msg:"Oops. Please try again later"},

            ],
            availability:
            [
                {title: "Save availability",msg:"Oops. Please try again later"},
            ],
            file:
            [
                {title: "File size",msg:"Oops. Please try again later"},
                {title: "Size save",msg:"Oops. Please try again later"},
                {title: "Size update",msg:"Oops. Please try again later"},
            ],
            inspiration:
            [
                {title: "Delete inspiration",msg:"Oops. Please try again later"},
                {title: "Save inspiration",msg:"Oops. Please try again later"},
                {title: "Update inspiration",msg:"Oops. Please try again later"},
            ],
            image:
            [
                {title: "Upload image",msg:"Oops. Please try again later"},
                {title: "Update image",msg:"Oops. Please try again later"},
                {title: "Save profile image",msg:"Oops. Please try again later"},
            ],
            creation:
            [
                {title: "Save creation",msg:"Oops. Please try again later"},
                {title: "Get creations",msg:"Oops. Please try again later"},
                {title: "Update creation",msg:"Oops. Please try again later"},
            ],
            tag:
            [
                {title: "Save tag",msg:"Oops. Please try again later"},
            ],
            profile:
            [
                {title: "Update service profile",msg:"Oops. Please try again later"},
            ]
        },
        warning:
        {
            login:
            [
                {title:'Login data',msg:'Incorrect Email or Password'}
            ],
            signup:
            [
                {title:'Email',msg:"Email already exists"}
            ]
        }
        ,
        serviceStatus:
        {
            login:
            [
                {title:'Login',msg:'Login service not available. Please try again later'}
            ],
            signup:
            [

            ],
            dataUser:
            [
                {title: "Users",msg:"Users data service not available. Please try again later"},
            ],
            dataInspiration:
            [
                {title: "Inspirations",msg:"Inspiration data service not available. Please try again later"},
                {title: "Inspiration tags",msg:"Inspiration tag data service not available. Please try again later"},
            ],
            dataPage:
            [
                {title: "Pages",msg:"Page data service not available. Please try again later"},
            ],
            dataCreation:
            [
                {title: "Creation",msg:"Creation data service not available. Please try again later"},

            ],
            dataLike:
            [
                {title: "Like",msg:"Like data service not available. Please try again later"},
            ]
        }
    };

  alert:any;
  constructor(private alertCtrl: AlertController) {
    console.log('Error handler initialized');
  }

  public throwWarning(title:string,msg:string){
    this.presentAlert(title,msg);
  }

  public throwError(title:string,msg:string){
      this.presentAlert(title,msg);
  }

  public throwValideWarning(title:string,msg:string){
      this.presentAlert(title,msg);
  }

  public throwSuccess(title:string,msg:string){
      this.presentSuccess(title,msg);
  }

  private presentAlert(title:string,msg:string){
      this.alert = this.alertCtrl.create({
          title: title,
          subTitle: msg,
          buttons: ['Dismiss']
      });
      this.alert.present();
  }

  private presentSuccess(title:string,msg:string){
      this.alert = this.alertCtrl.create({
          title: title,
          subTitle: msg,
          buttons: ['Continue']
      });
      this.alert.present();
  }



}
