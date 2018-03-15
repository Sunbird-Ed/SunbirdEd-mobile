import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

export class FormEducation {
  tabBarElement: any;
  isNewForm: boolean = true;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(values) {
    // this.navCtrl.push(UserPage);
  }

}