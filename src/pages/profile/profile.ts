import { Component } from '@angular/core';
import { NavController, NavParams , LoadingController } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { CreationPage } from '../creation/creation';
import { ChatPage } from '../chat/chat';
import { ServicePaymentPage } from '../service-payment/service-payment';
import {Post} from "../../models/post-model";
import {User} from "../../models/user-model";
import {SocialShareProvider} from "../../providers/social-share/social-share";
import {Storage} from "@ionic/storage";
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";


/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  userCode:any;
  user:any;
  creations:any;
  counter = Array;
  segment:any;
  view:any;
  userId: any;
  imageBaseUrl = "https://storingimagesandvideos.s3.us-east-2.amazonaws.com/";

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController,
    public dataService:DataService,private socialShare:SocialShareProvider, private storage: Storage) {

    //get usercode to load

    //view = service or user
    this.view = this.navParams.get('view');
    this.userCode = this.navParams.get('userCode');
    this.start();
  }
    ionViewWillEnter() {

        this.storage.get("branchItem").then(data => {
            if (data) {
              console.log(data)
                switch (data.type){
                    case 'Profile':
                        this.storage.remove("branchItem");
                        this.userCode = data.type_id;
                        this.start();
                        break;
                    case 'Magazine':
                        this.navCtrl.pop();
                        break;
                    case 'Item':
                        this.navCtrl.pop();
                        break;
                    default:
                      //  this.erroHandler.throwError(ErrorHandlerProvider.MESSAGES.error.branch[0].title,ErrorHandlerProvider.MESSAGES.error.branch[0].msg);
                        break;
                }

            }
        });
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  loading: any;
  start(){

    //load user and their posts from data service

    this.segment = 'work';
    console.log("in start",this.userCode)
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present().then(()=> {
      this.dataService.getUserByCode(this.userCode).subscribe((res)=> {
        this.user= res.json().data[0];
        this.dataService.getCreationByUser(this.user.id).subscribe((res)=> {
          this.creations = res.json().result;
          this.loading.dismissAll();
        })
      })
    });

    
    
    

  }

  openCreation(creation2Open){

    //open post

      console.log('open creation: ' + creation2Open);
      this.navCtrl.push(CreationPage,{
        creation : creation2Open
      });



  }

  openChat(participant, participantCode) {
    console.log(participant)
    console.log(participantCode)
    this.navCtrl.push(ChatPage,{
      userCode:participantCode,
      provider:participantCode,
      providername: participant,
      view:'service'
    });
  }

  openServicePayment(user) {
    console.log(user)
    this.navCtrl.push(ServicePaymentPage,{
      provider:user,
      view:'service'
    });
  }


    facebookShare(profile: User) {
        this.socialShare.shareProfile(profile,'Facebook');
    }
    twitterShare(profile: User){
        this.socialShare.shareProfile(profile,'Twitter');

    }
    instagramShare(profile: User){
        this.socialShare.shareProfile(profile,'Instagram');
    }
    whatsappShare(profile: User){
        this.socialShare.shareProfile(profile,'Whatsapp');
    }
    emailShare(profile: User){
        this.socialShare.shareProfile(profile,'Email');
    }



}
