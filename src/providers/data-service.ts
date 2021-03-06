import { Injectable,OnDestroy } from '@angular/core';
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
import {ErrorHandlerProvider} from "./error-handler/error-handler";

import { HttpService } from "./http.service";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

/*
Generated class for the DataServiceProvider provider.
See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular DI.
*/

@Injectable()
export class DataService {
  apiUrl = this.appSettings.getApiURl();
  raveURL = this.appSettings.getRaveURL();
  stripeURL = this.appSettings.getStripeURL();
  stripePK = this.appSettings.getStripePK();
  ravePaymentLinkURL = this.appSettings.getRavePaymentLinkURL();
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

  constructor(public http: Http, private _httpService: HttpService,
    public appSettings: AppSettings, public userService: UserService,
    private errorHandler: ErrorHandlerProvider
  ) {
    this.loadData();
  }

  loadData() {
    this.coverImage = 'assets/images/placeholder.png';
    this.getInspirationTags();
  }

  filterItems(searchTerm) {
    return this.users.filter((item) => {
      return (
        (item.type3.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.type2.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
        || (item.city.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
      )
    });
  }

  filter4Tag(searchTerm) {
    return this.users.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  createBranchLink(model_type,type_id,type_image,social_type, message, model){
    var model_type = model_type; // magazine,item,profile
    var type_id = type_id; // magazine,item,profile ID
    var type_image = type_image;
    var social_type = social_type;
    var parameters = JSON.stringify({
      type: model_type,
      type_id: type_id,
      type_image: type_image,
      social_type: social_type,
      message: message,
      custom_obj : model
    });

    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'branchCreateLink';

    return this.http.post(url, body, options).map(response => response.json());
  }

  getUsers(name) {

    console.log('getUsers', + name)

    let getUrl = 'getUsers/'+name;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  reloadUsers() {
    this.users.length = 0;
    return this.http.get(this.apiUrl + 'getUsers').map(res => res.json());
  }

  getUserById(userid) {
    let getUrl = 'get/' + userid;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getUserByCode(code) {
    console.log(code)
    let getUrl = 'getUserByCode/' + code;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getInspirationsByPageId(pageId) : Observable<any> {
    let getUrl = 'getInspiration/' + pageId;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getCreationById(id) : Observable<any> {
    let getUrl = 'getCreationsById/'+id;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getSizesByUserCode(code) : Observable<any> {
    let getUrl = 'getSizeByUserCode/'+code;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getInspirations(offset,limit) : Observable<any> {
    let getUrl = 'getInspirations/'+offset+'/'+limit;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });

    // this.posts = [];
    // this.posts.length = 0;
    //   this.http.get(this.apiUrl + 'getInspirations').map(res => res.json()).subscribe(data => {
    //     if(data.status){
    //         for (let inspiration of data.result) {
    //             let image =  inspiration.image;
    //             inspiration.image = image;
    //             inspiration.likes = 0; // magazine likes - random for testing
    //             this.getImageUrl(inspiration.image,inspiration);
    //             /* inspirationPages.forEach((page, index) => {
    //                  pageLikes = this.likes.filter(item => item.creationCode == page.code);
    //                  console.log("PAGE LIKES");
    //                  console.log(pageLikes);
    //                  console.log(pageLikes.length);
    //                  inspiration.likes = pageLikes.length;
    //              }); */
    //             this.posts.push(inspiration);
    //         }
    //         this.getPages();
    //     }
    //     else {
    //         this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataInspiration[0].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataInspiration[0].msg);
    //     }
    // });

  }

  getInspirationTags() {
    this.tags.length = 0;
    this.http.get(this.apiUrl + 'getInspirationTags').map(res => res.json()).subscribe(data => {
      if(data.status){
        // console.log(data);
        for (let tag of data.result) {

          let newTag = new Tag(tag.id, tag.code, tag.taggedUser);
          this.tags.push(newTag);
        }
      }
      else
      {
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataInspiration[1].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataInspiration[1].msg);
      }
    });
  }

  getPages() {
    let post;
    let pageLikes;
    this.pages.length = 0;

    this.http.get(this.apiUrl + 'getPages').map(res => res.json()).subscribe(data => {
      if(data.status){
        for (let page of data.result) {
          let image =  page.image;
          page.image = image;
          this.getImageUrl(page.image,page);
          post = this.findInspiration("id",page.inspiration_id);
          console.log(post);
          // get page likes
          pageLikes = this.allLikes.filter(item => item.creationCode == 'inspirationpage'+page.id);
          console.log(pageLikes);

          pageLikes.forEach((like) => {
            if(like.liked == true) {
              if (post.length != 0){
                post[0].likes++
              }
            }
          });
          this.pages.push(page);
        }
      }
      else{
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataPage[0].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataPage[0].msg);
      }


    });

  }

  getCreationByUser(userId) : Observable<any> {
    let getUrl = 'getCreations/'+userId;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getCreationsByType(type) : Observable<any> {
    let getUrl = 'getCreationsByType/'+type;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getCreations() {

    this.creations.length = 0;

    this.http.get(this.apiUrl + 'getCreations').map(res => res.json()).subscribe(data => {
      if(data.status) {
        for (let creation of data.result) {

          let image =  creation.image;
          creation.image = image;
          this.getImageUrl(image,creation);
          this.creations.push(creation);

        }
      }
      else {
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataCreation[0].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataCreation[0].msg);
      }


    });

  }

  reloadCreations() {
    this.creations.length = 0;
    return this.http.get(this.apiUrl + 'getCreations').map(res => res.json());
  }

  getLikesByUser(userId)  : Observable<any> {
    let getUrl = 'getLikes/'+userId;
    return this._httpService.getRequest(getUrl)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getLikes() {
    this.likes = new Array<Like>();
    this.likes.length = 0;
    this.userProfileLikes.length = 0;
    console.log(this.me)
    // console.log(this.me.code);
    var parameters = JSON.stringify({
      userCode: this.me.id
    });

    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'getLikes';

    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {
      if(data.status) {
        for (let like of data.result) {
          if(like.creationCode.substr(0,15) !== "inspirationpage") {
            console.log("Get like creation", like);
            let temp = this.creations.filter(item => item.id == like.creationCode.substr(8))[0];
            if(temp.image){
              this.getImageUrl(temp.image,like);
            }
          }
          else {
            console.log("Get like page",like.creationCode.substr(15));
            let temp = this.findPage("id",like.creationCode.substr(15))[0];
            if(temp!= undefined && temp.image){
              this.getImageUrl(temp.image,like);
              console.log(temp.image);
            }
          }
          this.likes.push(like);
        }
        //  console.log("LIKES");
        //console.log(this.likes);
      }
      else {
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataLike[0].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataLike[0].msg);
      }

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
        if(data.status) {
          //  console.log(data);
          for (let like of data.result) {
            this.allLikes.push(like);
          }
          resolve(true);
        }
        else {
          this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.serviceStatus.dataLike[0].title,ErrorHandlerProvider.MESSAGES.serviceStatus.dataLike[0].msg);
          reject();
        }

      });
    });
  }

  likeInspirationPage(body): Observable<any>  {
    let url = 'inspirationpage/like';
    return this._httpService.postRequest(url,body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  saveLike(likeToUpload) {

    // console.log(likeToUpload);
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
        //  console.log('like saved');
      } else {
        //console.log('like not saved');
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.like[0].title,ErrorHandlerProvider.MESSAGES.error.like[0].msg);
      }



    });


  }

  updateAvailability(creationCode, availability) {


    let getUrl = 'updateAvailability';
    let body = {
      creationCode: creationCode,
      availability: availability
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });

    // var parameters = JSON.stringify({
    //   creationCode: creationCode,
    //   availability: availability
    // });

    // let body: string = parameters,
    //   type: string = "application/json",
    //   headers: any = new Headers({ 'Content-Type': type }),
    //   options: any = new RequestOptions({ headers: headers }),
    //   url: any = this.apiUrl + 'updateAvailability';


    // this.http.post(url, body, options).map(response => response.json()).subscribe(data => {

    //   if (data.message == "Successful") {
    //    // console.log('availability saved');
    //   } else {
    //       this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.availability[0].title,ErrorHandlerProvider.MESSAGES.error.availability[0].msg);
    //   }

    // });


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

    console.log("Update creation, ",creation);

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

  // Smelly code
  loadIllustratorPosts() {
    for (let inspiration of this.posts) {

      if (inspiration.userCode == this.me.code) {

        this.illustratorPosts.push(inspiration);
      }
    }

    //  console.log('Loaded Illustrator posts');
    // console.log(this.illustratorPosts);
  }

  tagInspiration(tag) {

    console.log("Tag inspiration,", tag);
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
      if(data.status) {
        for (let sizeFile of data.result) {
          this.sizes.push(sizeFile);
        }
      }
      else
      {
        this.errorHandler.throwError(ErrorHandlerProvider.MESSAGES.error.file[0].title,ErrorHandlerProvider.MESSAGES.error.file[0].msg);
      }


    });

  }

  updateInspiration(code, inspiration, inspirationPages) {
    console.log("Update inspiration method");
    console.log(inspiration);
    var parameters = JSON.stringify({
      code: code,
      inspiration: inspiration,
      // inspirationPages: inspirationPages
    });
    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'updateInspiration';

    return this.http.post(url, body, options).map(response => response.json());
  }

  updateInspirationPages(inspiration_id,inspirationPages){
    var parameters = JSON.stringify({
      inspiration_id: inspiration_id,
      inspirationPages: inspirationPages
    });
    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'updatePages';

    return this.http.post(url, body, options).map(response => response.json());
  }

  updateProfile(user) {
    console.log("Update profile,",user);

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

  forgotPassword(email) {
    let getUrl = 'forgotpassword';
    let body = {
      email: email
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  verifyToken(token) {
    let getUrl = 'verifytoken';
    let body = {
      token: token
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  resetPassword(token, password) {
    let getUrl = 'resetpassword';
    let body = {
      token: token,
      password: password
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  saveSize(sizeFile) {

    console.log(sizeFile)
    let getUrl = 'saveSize';
    let body = {
      sizeFile: sizeFile
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  getImageUrl(imageName,object){
    console.log("GET IMAGE URL");
    var parameters = JSON.stringify({
      imageName: imageName
    });

    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'getImageLink';

    this.http.post(url, body, options).map(response => response.json()).subscribe(data => {
      console.log("image url", data.imageUrl);
      object.imageUrl = data.imageUrl;
    });
  }

  updateSize(sizeFile) {
    let getUrl = 'updateSize';
    let body = {
      sizeFile: sizeFile
    }
    return this._httpService.postRequest(getUrl, body)
    .map((res: Response) => res)
    .catch((error: any) => {
      return Observable.throw(error);
    });
  }

  saveNewInspiration(inspiration, inspirationPages) {

    console.log("SAVE NEW INSPIRATION POST METHOD");
    console.log(inspiration);
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

    console.log("Save image");
    //console.log(imageData);
    console.log(imageName);
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

  savePageImage(imageCode, imageData, imageName) {

    console.log("Save image");
    //console.log(imageData);
    console.log(imageName);
    var parameters = JSON.stringify({
      imageData: imageData,
      imageName: imageName,
      imageCode: imageCode
    });

    let body: string = parameters,
    type: string = "application/json",
    headers: any = new Headers({ 'Content-Type': type }),
    options: any = new RequestOptions({ headers: headers }),
    url: any = this.apiUrl + 'uploadImage';


    return this.http.post(url, body, options).map(response => response.json());
  }

  /*
  Don't need it now
  generateCode(type) {

  //new user code

  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 80; i++) {
  text += possible.charAt(Math.floor(Math.random() * possible.length));
}

text = type + text;

return text;


} */

/**
* **************************
* FIND METHODS TO KEEP ALL FILTER STUFF ON ONE PLACE
*/

/**
*  Find inspiration in list by key,value
* @param key
* @param value
* @param is_equal
* @returns {Post[]}
*/
findInspiration(key,value,is_equal = true){
  // console.log("FIND POST");
  var postFound ;
  if(is_equal)
  postFound = this.posts.filter(item => item[key] == value);
  else
  postFound = this.posts.filter(item => item[key] != value);
  return postFound;
}

/**
*  Find page in list by key,value
* @param key
* @param value
* @param is_equal
* @returns {Page[]}
*/
findPage(key,value,is_equal = true){
  //console.log("FIND PAGE");
  var pageFound ;
  if(is_equal)
  pageFound =this.pages.filter(item => item[key] == value);
  else
  pageFound =  this.pages.filter(item => item[key] != value);
  return pageFound;

}

getPagesByInspirationId(id) {
  let getUrl = 'getPages/'+id;
  return this._httpService.getRequest(getUrl)
  .map((res: Response) => res)
  .catch((error: any) => {
    return Observable.throw(error);
  });
}

checkLikedByMe(userid,pageids) : Observable<any>  {
  let getUrl = 'checkinspiration/like';
  let body = {
    userid: userid,
    pageids: pageids
  }
  return this._httpService.postRequest(getUrl, body)
  .map((res: Response) => res)
  .catch((error: any) => {
    return Observable.throw(error);
  });
}

checkLikedByMeCreation(userid,creationid) : Observable<any>  {
  let getUrl = 'checkcreation/like';
  let body = {
    userid: userid,
    creationid: creationid
  }
  return this._httpService.postRequest(getUrl, body)
  .map((res: Response) => res)
  .catch((error: any) => {
    return Observable.throw(error);
  });
}

}
