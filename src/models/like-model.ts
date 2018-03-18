/**
 * Created by mikkytaryan on 11/09/2017.
 */

export class Like {

  constructor(public id:any,
              public userCode:any,
              public creationCode:any,
              public liked:boolean
             ) {

    this.id = id;
    this.userCode = userCode;
    this.creationCode = creationCode;
    this.liked = liked;

  }

}
