import { IonicPage } from "ionic-angular/navigation/ionic-page";
import { Component } from '@angular/core';
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ViewController } from "ionic-angular/navigation/view-controller";
import { UsersnClassesComponent } from "../usersnclasses/usersnclass.component";

@Component({
    selector:'menu-overflow',
    templateUrl:'menu.overflow.html'})

export class OverflowMenuComponent{
    items:Array<string>;
    constructor(public navCtrl : NavController,public navParams : NavParams,public viewCtrl:ViewController){
        this.items= this.navParams.get("list");
    }

    close(event,i){
        this.viewCtrl.dismiss(JSON.stringify({"content":event.target.innerText,
                               "index":i}));
        this.navCtrl.push(UsersnClassesComponent);
    }
}