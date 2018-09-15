import {Component, ViewChild} from '@angular/core';

import { MessengerPage } from '../messenger/messenger';
import { InspirationPage } from '../inspiration/inspiration';
import { CreateNewPage } from '../create-new/create-new';
import { UserProfilePage } from '../user-profile/user-profile';
import { ScizzorPage } from '../scizzor/scizzor';

import { DataService } from '../../providers/data-service';
import { UserService } from '../../providers/user-service';
import {ProfilePage} from "../profile/profile";
import {ErrorHandlerProvider} from "../../providers/error-handler/error-handler";
import {NavController, Platform, Tabs} from "ionic-angular";
import {Storage} from "@ionic/storage";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

    @ViewChild('tabs') tabRef: Tabs;
    activeTab;
  Branch;
  branchUniversalObj;
  tab1Root = InspirationPage;
  tab2Root = ScizzorPage;
  tab3Root = UserProfilePage;
  tab4Root = MessengerPage;
  tab5Root = CreateNewPage; //admin tab

  constructor(public dataService: DataService, public userService: UserService,private platform: Platform,public navCtrl: NavController,private erroHandler: ErrorHandlerProvider,private storage: Storage) {

      //this.activeTab = 0; // Inspiration page

  }

    ionViewWillEnter() {

        const branchInit = () => {
            // only on devices
            if (!this.platform.is("cordova")) {
                return;
            }
            const Branch = window["Branch"];
            this.branchUniversalObj = null;

            Branch.initSession().then(data => {
                if (data["+clicked_branch_link"]) {
                    console.log("BRANCH LINK DATA");
                    console.log(JSON.stringify(data));
                    console.log(data);
                    if(this.dataService.me){
                        switch (data.type){
                            case 'Profile':
                                this.storage.set("branchItem",data);
                                this.navCtrl.push(ProfilePage);
                                break;
                            case 'Magazine':
                                this.storage.set("branchItem",data);
                                this.tabRef.select(0);
                                break;
                            case 'Item':
                                this.storage.set("branchItem",data);
                                this.tabRef.select(1);
                                break;
                            default:
                                this.erroHandler.throwError(ErrorHandlerProvider.MESSAGES.error.branch[0].title,ErrorHandlerProvider.MESSAGES.error.branch[0].msg);
                                break;
                        }
                    }
                }
            });

        };

        this.storage.get("branchItem").then(data => { // logged in users
            if(!data)
                branchInit();
        });
        // Branch init in resume to always keep it listening for events
        this.platform.resume.subscribe(() => {
            console.log("READY from tabs");
            branchInit();
        });
    }

}
