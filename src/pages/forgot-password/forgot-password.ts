import { Component } from '@angular/core';
import { DataService} from "../../providers/data-service"
import { LoadingController, ToastController , NavController } from 'ionic-angular'
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
import {Md5} from 'ts-md5/dist/md5';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html',
  })
export class ForgotPassword {

    constructor(private dataService: DataService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private errorHandlerProvider: ErrorHandlerProvider) {

    }

    email: Text;
    code: Text;
    password: any;
    confirmPassword: Text;

    showForgotPassword = true;
    showVerifyToken = false;
    showResetPassword = false;
    next() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait..'
          });
        loading.present();
        this.dataService.forgotPassword(this.email).subscribe((res)=> {
            console.log(res.json())
            loading.dismissAll();
            this.presentToast(res.json().meta.message);
            this.showForgotPassword =false;
            this.showVerifyToken = true;
            this.showResetPassword = false;
        },(err)=> {
            console.log(err.json())
            loading.dismissAll();
            this.presentToast(err.json().meta.message);
        })
    }

    verify() {
        let loading = this.loadingCtrl.create({
            content: 'Please wait..'
          });
        loading.present();
        this.dataService.verifyToken(this.code).subscribe((res)=> {
            console.log(res.json())
            loading.dismissAll();
            this.presentToast("Code verified successfully");
            this.showForgotPassword =false;
            this.showVerifyToken = false;
            this.showResetPassword = true;
        },(err)=> {
            console.log(err.json())
            loading.dismissAll();
            this.presentToast(err.json().meta.message);
        })
    }

    resetPassword() {

        if(this.password != this.confirmPassword){
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[5].title, ErrorHandlerProvider.MESSAGES.validation.signup[5].msg);
            }else if(this.password.length < 7 ){
            this.errorHandlerProvider.throwValideWarning(ErrorHandlerProvider.MESSAGES.validation.signup[6].title, ErrorHandlerProvider.MESSAGES.validation.signup[6].msg);

        } else {
            let loading = this.loadingCtrl.create({
                content: 'Please wait..'
              });
            loading.present();
            this.dataService.resetPassword(this.code,Md5.hashStr(this.password)).subscribe((res)=> {
                console.log(res.json())
                loading.dismissAll();
                this.presentToast("Password is reset successfully");
                this.navCtrl.pop();
            },(err)=> {
                console.log(err.json())
                loading.dismissAll();
                this.presentToast(err.json().meta.message);
            })
        }
    }

    presentToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }
}