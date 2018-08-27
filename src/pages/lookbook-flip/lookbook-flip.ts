import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import {DataService} from '../../providers/data-service';
import { CreateNewPage } from '../create-new/create-new';

import { Slides } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { ViewChild } from '@angular/core';


import { AudioService } from '../../providers/audio-service';

/**
 * Generated class for the LookbookFlipPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-lookbook-flip',
  templateUrl: 'lookbook-flip.html'
})
export class LookbookFlipPage {

@ViewChild(Content) content: Content;
@ViewChild(Slides) slides: Slides;

  selected:any = false;
  temp: Array<string> = ['images/1.jpg','images/2.jpg','images/3.jpg','images/4.jpg','images/5.jpg'];
  images: Array<string> = [];
  pageCount =0;
  pageIndex=0;
  forwardTurn:any = true;
  mode:any;
  pages:any;
  post:any;
forward:any = true;
  index:any;

//  pages:Array<Page> = new Array<Page>();

  constructor(platform: Platform,public navCtrl: NavController, public navParams: NavParams,public dataService:DataService,public audioService: AudioService) {

    platform.ready().then(() => {

      audioService.preload('pageTurn', 'assets/audio/pageTurn.mp3');

    })




    this.pages = navParams.get('pages');
    this.mode = navParams.get('mode');
    this.post = navParams.get('post');

    this.start(this.mode);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LookbookFlipPage');
    this.slides.lockSwipes(true);
  }

  start(mode){


    if(mode == 'view'){
      let code = this.post.id;

     //this.dataService.lookbookPages = this.dataService.pages.filter(item => item.inspirationCode == code);
     this.dataService.lookbookPages = this.dataService.findPage("inspiration_id",code);
      this.pages =  this.dataService.lookbookPages;
    }else if(mode == 'edit'){

      this.dataService.lookbookPages = this.pages;

    }

    for(let page of this.pages) {

      this.images.push(page.image);
    }

    for(let i =0;i<this.pages.length;i++){

      if( i !=0){
        this.pages[i].show = false;
      }else{
        this.pages[i].show = true;
      }

    }

  }


  save(){

      console.log("SAVE INSPIRATION FLIP");
    if(this.mode == 'preview'){

      this.dataService.saveNewInspiration(this.post,this.pages).subscribe(data =>{

        try{
         console.log(data);
        } catch(error){
          console.log('inspiration save error');
        }

      });

    }else if(this.mode == 'edit'){

      //this.dataService.pages = this.dataService.pages.filter(item => item.inspirationCode != this.post.code);
      this.dataService.pages = this.dataService.findPage("inspiration_id",this.post.id,false);


      for(let page of  this.dataService.lookbookPages) {

        this.dataService.pages.push(page);

      }

      console.log('closing edit');
    }




    this.navCtrl.setRoot(CreateNewPage);
  }


  /*

  turnForward(selectedPage,index){
    if(index != 0){
      this.audioService.play('pageTurn');
      selectedPage.show = false;
    }
  }

  turnBack(selectedPage,index){
    if(this.pages.length -1 != index ){
      this.audioService.play('pageTurn');
      this.pages[index + 1].show = true;
    }
  }
  */

  startSlides(){
    this.slides.lockSwipes(false);
    this.slides.slideTo((1), 2000);
    this.slides.lockSwipes(true);
    this.pages[2].show = true;


  }

  goToSlide(page){
    page.show = false;
    this.index = this.slides.getActiveIndex();

    if(this.index == 0){
      console.log('going forward');
      this.forward = true;
    }else if((this.index + 1) == this.pages.length){
      console.log('going back');
      this.forward = false;
    }

    if(this.forward){
      this.audioService.play('pageTurn');
      this.slides.lockSwipes(false);
      this.slides.slideTo((this.index+1), 2000);
      this.slides.lockSwipes(true);

      //after

      this.pages[this.index + 1].show = true;

      if(this.index > 0 && this.index < this.pages.length){
        //before
        this.pages[this.index-1].show = true;
      }

      //this.pages[this.inde]
    }else{

      this.audioService.play('pageTurn');
      this.slides.lockSwipes(false);
      this.slides.slideTo((this.index-1), 2000);
      this.slides.lockSwipes(true);

      if(this.index > 0 ){
        //before
        this.pages[this.index-1].show = true;
      }

    }


  }

  slideChanged() {
    this.index = this.slides.getActiveIndex();
    console.log('Current index is ', this.index);
    console.log('Pages size is ', this.pages.length);

  }
    goBack(){
    this.navCtrl.pop();
  }

}
