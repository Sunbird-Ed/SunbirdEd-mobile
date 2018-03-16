import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'page-experience',
  templateUrl: 'form.experience.html'
})

export class FormExperience {
  tabBarElement: any;
  isNewForm: boolean = true;
  experienceForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.experienceForm = this.fb.group({
      jobName: [''],
      org: ['', Validators.required],
      position: [''],
      subjects: ['', Validators.required],
      isCurrentJob: [''],
      fromDate: [''],
      toDate: ['']
    });
   }

   ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }

  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.experienceForm.value;
    console.log("Event", event);
  }


}