import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import { AppSettings } from './app-settings';
import { UserService } from './user-service';

//MODELS
import { Post } from '../models/post-model';
import { Page } from '../models/page';
import { Creation } from '../models/creation-model';
import { Size } from '../models/size-model';
import { User } from '../models/user-model';
import { Like } from '../models/like-model';
import { Tag } from '../models/tag-model';



/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DataService {

  apiUrl = this.appSettings.getApiURl();
  me: any;
  permission: any;
  openConversation: any;
  user2Message: any;

  posts: Array<Post> = new Array<Post>();
  tags: Array<Tag> = new Array<Tag>();
  illustratorPosts: Array<Post> = new Array<Post>();
  pages: Array<Page> = new Array<Page>();
  lookbookPages: Array<Page> = new Array<Page>();
  sizes: Array<Size> = new Array<Size>();
  creations: Array<Creation> = new Array<Creation>();
  users: Array<User> = new Array<User>();
  likes: Array<Like> = new Array<Like>();
  allLikes: Array<Like> = new Array<Like>();
  userProfileLikes: Array<Like> = new Array<Like>();

  lookbook: any;
  coverImage: any;

  constructor(public http: Http, public appSettings: AppSettings, public userService: UserService) {
    console.log('Hello DataServiceProvider Provider');
    this.loadData();
  }



  loadData() {

    this.coverImage = 'assets/images/placeholder.png';

    this.getUsers();
    this.getInspirations();
    this.getInspirationTags();
    this.getCreations();
  }

  filterItems(searchTerm) {

    return this.users.filter((item) => {
      return ((item.type3.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.type2.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.city.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      );
    });

  }

  filter4Tag(searchTerm) {

    return this.users.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  createBranchLink(model_type,type_id,type_image,social_type){
      var model_type = model_type; // magazine,item,profile
      var type_id = type_id; // magazine,item,profile ID
      var type_image = type_image;
      var social_type = social_type;
      var parameters = JSON.stringify({
          type: model_type,
          type_id: type_id,
          type_image: type_image,
          social_type: social_type
      });

      let body: string = parameters,
          type: string = "application/json",
          headers: any = new Headers({ 'Content-Type': type }),
          options: any = new RequestOptions({ headers: headers }),
          url: any = this.apiUrl + 'branchCreateLink';

      return this.http.post(url, body, options).map(response => response.json());
  }

  getUsers() {

    this.users.length = 0;

    this.http.get(this.apiUrl + 'getUsers').map(res => res.json()).subscribe(data => {

      for (let user of data) {

        let image = this.apiUrl + "images/" + user.image;
        user.image = image;
        this.users.push(user);
      }

      console.log(this.users);

    });

  }

  reloadUsers() {
    this.users.length = 0;
    return this.http.get(this.apiUrl + 'getUsers').map(res => res.json());
  }


  getInspirations() {

    this.posts = [];
    this.posts.length = 0;
      let pageLikes;
      let inspirationPages;
      this.http.get(this.apiUrl + 'getInspirations').map(res => res.json()).subscribe(data => {
      for (let inspiration of data) {
        let image = this.apiUrl + "images/" + inspiration.image;
        inspiration.image = image;
        inspiration.likes = 0; // magazine likes - random for testing
       /* inspirationPages.forEach((page, index) => {
            pageLikes = this.likes.filter(item => item.creationCode == page.code);
            console.log("PAGE LIKES");
            console.log(pageLikes);
            console.log(pageLikes.length);
            inspiration.likes = pageLikes.length;
        }); */
          this.posts.push(inspiration);
      }

     // console.log(this.posts);

      this.getPages();

    });

  }

  getInspirationTags() {
    console.log("INSPIRATION TAGS");
    this.tags.length = 0;

    this.http.get(this.apiUrl + 'getInspirationTags').map(res => res.json()).subscribe(data => {

      console.log(data);
      for (let tag of data) {

        let newTag = new Tag(this.generateCode('tag'), tag.code, tag.taggedUser);
        this.tags.push(newTag);
      }

     console.log(this.tags);
    });

  }

  getPages() {

    let post;
    let pageLikes;
    this.pages.length = 0;

    this.http.get(this.apiUrl + 'getPages').map(res => res.json()).subscribe(data => {
      for (let page of data) {
        let image = this.apiUrl + "images/" + page.image;
        page.image = image;
        post = this.posts.filter(item => item.code == page.inspirationCode);
        console.log(post);
          // get page likes
          pageLikes = this.allLikes.filter(item => item.creationCode == page.code);
          console.log("page likes");
          console.log(pageLikes);
          pageLikes.forEach((like,index) => {
            if(like.liked == true) {
                post[0].likes++
            }
          });
          this.pages.push(page);
      }

    });

  }
  getCreations() {

    this.creations.length = 0;

    this.http.get(this.apiUrl + 'getCreations').map(res => res.json()).subscribe(data => {

      for (let creation of data) {

        let image = this.apiUrl + "images/" + creation.image;
        creation.image = image;
        this.creations.push(creation);

      }

    });

  }

  reloadCreations() {
    this.creations.length = 0;
    return this.http.get(this.apiUrl + 'getCreations').map(res => res.json());
  }

  getLikes() {

    this.likes.length = 0;
    this.userProfileLikes.length = 0;
    console.log(this.me.code);
    var parameters = JSON.stringify({
      userCode: this.me.code
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'getLikes';

    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {
      for (let like of data.result) {
              this.likes.push(like);
      }
      console.log("LIKES");
      console.log(this.likes);
    });
  }

  getAllLikes() {
    return new Promise((resolve,reject)=>{
        this.allLikes.length = 0;
        var parameters = JSON.stringify({
            userCode: 0
        });

        let body: string = parameters,
            type: string = "application/json",
            headers: any = new Headers({ 'Content-Type': type }),
            options: any = new RequestOptions({ headers: headers }),
            url: any = this.apiUrl + 'getLikes';

        this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

            console.log(data);
            for (let like of data.result) {
                this.allLikes.push(like);
            }
            resolve(true);
        });
      });
}



  saveLike(likeToUpload) {

    console.log(likeToUpload);
    var parameters = JSON.stringify({
      newLike: likeToUpload
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'saveLike';


    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

      if (data.message == "Successful") {
        console.log('like saved');
      } else {
        console.log('like not saved');
      }



    });


  }

  updateAvailability(creationCode, availability) {


    var parameters = JSON.stringify({
      creationCode: creationCode,
      availability: availability
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'updateAvailability';


    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

      if (data.message == "Successful") {
        console.log('availability saved');
      } else {
        console.log('availability not saved');
      }

    });


  }

  saveCreation(creation) {

    console.log(creation);

    var parameters = JSON.stringify({
      creation: creation
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'saveCreation';


    return this.http.post(url, body, options).map(response => response.json());

  }



  updateCreation(creation) {

    console.log(creation);

    var parameters = JSON.stringify({
      creation: creation
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'updateCreation';

    return this.http.post(url, body, options).map(response => response.json());

  }


  login(userLogin, userHash) {

    var parameters = JSON.stringify({
      email: userLogin,
      password: userHash
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'login';

    return this.http.post(url, body, options).map(response => response.json());

  }

  loadIllustratorPosts() {
    for (let inspiration of this.posts) {

      if (inspiration.accountCode == this.me.code) {

        this.illustratorPosts.push(inspiration);
      }
    }

    console.log('Loaded Illustrator posts');
    console.log(this.illustratorPosts);
  }




  tagInspiration(tag) {

    var parameters = JSON.stringify({
      tag: tag
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'tagInspiration';


    return this.http.post(url, body, options).map(response => response.json());

  }


  getSizeFile() {

    this.sizes.length = 0;

    var parameters = JSON.stringify({
      userCode: this.me.code
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'getSizeFile';


    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

      for (let sizeFile of data.result) {
        this.sizes.push(sizeFile);
      }

    });

  }

  updateInspiration(code, inspiration, inspirationPages) {
    var parameters = JSON.stringify({
      code: code,
      inspiration: inspiration,
      inspirationPages: inspirationPages
    });
    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'updateInspiration';

    return this.http.post(url, body, options).map(response => response.json());
  }

  updateProfile(user) {


    var parameters = JSON.stringify({
      user: user
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'updateServiceProfile';


    return this.http.post(url, body, options).map(response => response.json());

  }


  saveSize(sizeFile) {

    var parameters = JSON.stringify({
      sizeFile: sizeFile
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'saveSize';


    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

      if (data.message == "Successful") {
        console.log('size file saved');
      } else {
        console.log('image not saved');
      }

    });

  }

  updateSize(sizeFile) {


    var parameters = JSON.stringify({
      sizeFile: sizeFile
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'updateSize';


    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

      if (data.message == "Successful") {
        console.log('profile saved');
      } else {
        console.log('profile not saved');
      }

    });


  }

  saveNewInspiration(inspiration, inspirationPages) {

    var parameters = JSON.stringify({
      inspiration: inspiration,
      inspirationPages: inspirationPages
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'saveNewInspiration';


    return this.http.post(url, body, options).map(response => response.json());

  }

  deleteInspiration(inspiration) {

    var parameters = JSON.stringify({
      inspiration: inspiration
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'deleteInspiration';


    return this.http.post(url, body, options).map(response => response.json());

  }

  saveImage(imageData, imageName) {

    var parameters = JSON.stringify({
      imageData: imageData,
      imageName: imageName
    });

    let body: string = parameters,
      type: string = "application/json",
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.apiUrl + 'uploadImage';


    return this.http.post(url, body, options).map(response => response.json());
  }

  generateCode(type) {

    //new user code

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 80; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    text = type + text;

    return text;


  }



}
