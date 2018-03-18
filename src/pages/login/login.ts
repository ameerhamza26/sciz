import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { SignUpPage } from '../sign-up/sign-up';
import { TabsPage } from '../tabs/tabs';
import {Md5} from 'ts-md5/dist/md5';
import { AlertController } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';


/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 *
 * login() get username ,password and send to server for verification
 * signUp() segue sign up  page
 * showAlert(title,message)
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loading:any;
  username:any = "";
  password:any = "";
  permission:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private alertCtrl: AlertController,public dataService:DataService,public userService:UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){

    if((this.password.length > 6 && this.username.length > 3) || this.username == 'admin' ){

      this.showLoading('Logging In...');

      let hash = Md5.hashStr(this.password);

      this.dataService.login(this.username,hash).subscribe(data =>{


        try{

          this.loading.dismissAll();

          if(data.message == "Successful" &&(data.result[0].type == "customer" || data.result[0].type == "service" || data.result[0].type == "admin")){

            this.setUser(this.username);

            this.dataService.getLikes();

            console.log(this.dataService.me);

            if(data.result[0].type == "customer"){
              this.dataService.getSizeFile();
            }else if(data.result[0].type == "admin" ||this.dataService.me.type2 == 'Illustrator' ){
              this.dataService.loadIllustratorPosts();
            }

            this.navCtrl.setRoot(TabsPage);



          }else{
            this.showAlert('Error','Incorrect Email or Password');
          }
        } catch(error){
          this.showAlert('Oops','Please try again');
        }



      });

    }else{
   console.log('will not log in');
    }






  }

  setUser(userName){

   let user =  this.dataService.users.filter(item => item.email == userName)[0];

   // let newUser = new User('0','testCode',this.permission,'Manufacturer','','images/profile.jpg','Delz','scizzorapp@gmail.com','Auckland','02105976881',true,'short description','@username','@username','@username','http://www.sczr.co.uk','sizeCode',3,'hashTest');
   this.userService.setUser(user);
   // this.dataService.users.push(newUser);
    this.dataService.permission = this.userService.getPermission(user);
    this.dataService.me = user;


  }

  signUp(){
    console.log('Sign Up');
    this.navCtrl.setRoot(SignUpPage);
  }

  showLoading(message){

    this.loading = this.loadingCtrl.create({
      content: message
    });
    this.loading.present();

    setTimeout(() => {
      this.loading.dismiss();
    }, 10000);


  }

  showAlert(title,message){

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
