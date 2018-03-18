import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScizzorSearchPage } from './scizzor-search';

@NgModule({
  declarations: [
    ScizzorSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ScizzorSearchPage),
  ],
})
export class ScizzorSearchPageModule {}
