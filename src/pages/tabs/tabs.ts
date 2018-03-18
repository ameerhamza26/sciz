import { Component } from '@angular/core';

import { MessengerPage } from '../messenger/messenger';
import { InspirationPage } from '../inspiration/inspiration';
import { CreateNewPage } from '../create-new/create-new';
import { UserProfilePage } from '../user-profile/user-profile';
import { ScizzorPage } from '../scizzor/scizzor';

import {DataService} from '../../providers/data-service';
import {UserService} from '../../providers/user-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {


  tab1Root = InspirationPage;
  tab2Root = ScizzorPage;
  tab3Root = UserProfilePage;
  tab4Root = MessengerPage;
  tab5Root = CreateNewPage; //admin tab

  constructor(public dataService:DataService,public userService:UserService) {

  }
}
