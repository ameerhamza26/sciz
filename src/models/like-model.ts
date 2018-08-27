/**
 * Created by mikkytaryan on 11/09/2017.
 */

export class Like {

  constructor(public id:any,
              public account_id:number,
              public creationCode:any,
              public liked:boolean,
              public imageUrl:string
             ) {

    this.id = id;
    this.account_id = account_id;
    this.creationCode = creationCode;
    this.liked = liked;
    this.imageUrl = imageUrl;

  }

}
