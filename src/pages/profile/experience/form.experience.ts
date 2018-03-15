import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

export class FormExperience {
  tabBarElement: any;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
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