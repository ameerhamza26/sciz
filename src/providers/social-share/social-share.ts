import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SocialSharing } from '@ionic-native/social-sharing';
import {User} from "../../models/user-model";
import {Post} from "../../models/post-model";
import {Creation} from "../../models/creation-model";
import { DataService } from '../../providers/data-service';
import {AlertController} from "ionic-angular";


/*
  Generated class for the SocialShareProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.

  Profiles would generate a link like “You can see __’s work on here on Scizzor App” with an image of the profile picture.

Magazines would generate a link like “You can view ___’s fashion magazine here on Scizzor App” with an image on the cover.

Items would generate a link like “You can shop (name of item seller)’s (name of item) here on Scizzor App” with an image of the item being sold.

*/
const SHARE_MSGS = {
   profile:{prefix:'You can see ',sufix:'\'s work on here on Scizzor App'},
   magazine:{prefix:'You can view ',sufix:'\'s fashion magazine here on Scizzor App'},
   item:{prefix:'You can shop ',seller:'\'s ',sufix:' here on Scizzor App'},
};


@Injectable()
export class SocialShareProvider {

  socialShare;
  constructor(public http: Http,private socialSharing: SocialSharing,private dataService:DataService, private alertCtrl: AlertController) {
    console.log('Hello SocialShareProvider Provider');
    this.socialShare = socialSharing;
  }

  share(){
      //this.shareFacebook();
      /*this.socialShare.shareViaFacebook("Testing ionic social share :)","","www.google.com").then(()=>{
            console.log("SHARE");
      }).catch((err)=>{
          console.log("ERROR ON SHARE", err);
      });*/
  }

  private shareFacebook(shareType,message:string,model:any) {
      console.log(message);
      this.dataService.createBranchLink(shareType,model.code,model.image,"Facebook").subscribe(data => {
          this.socialSharing.shareViaFacebookWithPasteMessageHint(message,"",data.url,message).then(()=>{

          }).catch(()=>{
              this.showAlert('Error', 'Cannot share with facebook. Check if you have facebook installed or try again later');
          });
      })
  }

  private shareTwitter(shareType,message:string,model:any) {
      console.log(message);
      this.dataService.createBranchLink(shareType,model.code,model.image,"Twitter").subscribe(data => {
          this.socialSharing.shareViaTwitter(message,model.image,data.url).then(()=>{

          }).catch(()=>{
              this.showAlert('Error', 'Cannot share with twitter. Check if you have twitter installed or try again later');
          });
      });

  }

    private shareInstagram(shareType,message:string,model:any) {
        console.log(message);
        this.dataService.createBranchLink(shareType,model.code,model.image,"Twitter").subscribe(data => {
            message = message + ' ' + data.url;
            this.socialSharing.shareViaInstagram(message,model.image).then(()=>{

            }).catch(()=>{
                this.showAlert('Error', 'Cannot share with instagram. Check if you have instagram installed or try again later');

            });
        });

    }

    // email
    private shareWithEmail(shareType,message:string,model:any){
      console.log(message);
        this.dataService.createBranchLink(shareType,model.code,model.image,"Twitter").subscribe(data => {
            message = message + '. Visit this link '+ data.url;
            this.socialSharing.shareViaEmail(message,"Scizzor app",['Scizzorapp@gmail.com']);
        });

    }
    // Whatsapp
    private shareWhatsapp(shareType,message:string,model:any){
        console.log(message);
        this.dataService.createBranchLink(shareType,model.code,model.image,"Twitter").subscribe(data => {
            this.socialSharing.shareViaWhatsApp(message,model.image,data.url).then(()=>{

            }).catch(()=>{
                this.showAlert('Error', 'Cannot share with whatsapp. Check if you have whatsapp installed or try again later');

            });
        });


    }

  public shareProfile(profile:User,shareType:string) {
      console.log("Share magazine", profile);
      switch (shareType){
          case 'Facebook':
              this.shareFacebook(shareType,this.buildShareMessage('Profile',profile),profile);
              break;
          case 'Twitter':
              this.shareTwitter(shareType,this.buildShareMessage('Profile',profile),profile);
              break;
          case 'Instagram':
              this.shareInstagram(shareType,this.buildShareMessage('Profile',profile),profile);
              break;
          case 'Whatsapp':
              this.shareWhatsapp(shareType,this.buildShareMessage('Profile',profile),profile);
              break;
          case 'Email':
              this.shareWithEmail(shareType,this.buildShareMessage('Profile',profile),profile);
              break;
      }
  }

  public shareMagazine(magazine: Post,shareType:string) {
      console.log("Share magazine", magazine);
      switch (shareType){
          case 'Facebook':
              this.shareFacebook(shareType,this.buildShareMessage('Magazine',magazine),magazine);
              break;
          case 'Twitter':
              this.shareTwitter(shareType,this.buildShareMessage('Magazine',magazine),magazine);
              break;
          case 'Instagram':
              this.shareInstagram(shareType,this.buildShareMessage('Magazine',magazine),magazine);
              break;
          case 'Whatsapp':
              this.shareWhatsapp(shareType,this.buildShareMessage('Magazine',magazine),magazine);
              break;
          case 'Email':
              this.shareWithEmail(shareType,this.buildShareMessage('Magazine',magazine),magazine);
              break;
      }
  }

  public shareItem(item: Creation,shareType:string) {
      switch (shareType){
          case 'Facebook':
              this.shareFacebook(shareType,this.buildShareMessage('Item',item),item);
              break;
          case 'Twitter':
              this.shareTwitter(shareType,this.buildShareMessage('Item',item),item);
              break;
          case 'Instagram':
              this.shareInstagram(shareType,this.buildShareMessage('Item',item),item);
              break;
          case 'Whatsapp':
              this.shareWhatsapp(shareType,this.buildShareMessage('Item',item),item);
              break;
          case 'Email':
              this.shareWithEmail(shareType,this.buildShareMessage('Item',item),item);
              break;
      }
      console.log("Share item",item);
  }

  private buildShareMessage(modelType:string,model:any){
      var message = "";
      switch (modelType){
          case 'Item':
              message = SHARE_MSGS.item.prefix +  this.dataService.users.filter(item => item.code == model.userCode)[0].name + SHARE_MSGS.item.seller + model.name + SHARE_MSGS.item.sufix;
              break;
          case 'Magazine':
              message = SHARE_MSGS.magazine.prefix + model.title + SHARE_MSGS.magazine.sufix;
              break;
          case 'Profile':
              message = SHARE_MSGS.profile.prefix + model.name + SHARE_MSGS.profile.sufix;
              break;
      }
      return message;
  }


    showAlert(title, message) {

        let alert = this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: ['Dismiss']
        });
        alert.present();
    }


}
