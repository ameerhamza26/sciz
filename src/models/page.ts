/**
 * Created by mikkytaryan on 6/08/2017.
 */
export class Page {

    public liked = false;

  constructor(public id:any,
              public inspirationCode :any,
              public code:string,
              public image:any
            ) {

    this.id = id;
    this.code = code;
    this.inspirationCode = inspirationCode;
    this.image = image;



  }

}
