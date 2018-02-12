import { Component } from "@angular/core";
import { SuperTabsController } from 'ionic2-super-tabs';
import {SuperTabs} from "ionic2-super-tabs";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { UsersComponent } from "./users/users.component";
import { ClassesComponent } from "./classes/classes.component";
@Component({
    selector:'page-usernclass',
    templateUrl:'usersnclasses.html'})
export class UsersnClassesComponent{

    page1: any = UsersComponent;
    page2: any = ClassesComponent;
  
    showIcons: boolean = true;
    showTitles: boolean = true;
    pageTitle: string = 'Full Height';
  
    constructor(public navCtrl: NavController, private navParams: NavParams, private superTabsCtrl: SuperTabsController) {
      const type = navParams.get('type');
      
    }
  
    ngAfterViewInit() {
    }
  
    onTabSelect(tab: { index: number; id: string; }) {
      console.log(`Selected tab: `, tab);
    }
  
}