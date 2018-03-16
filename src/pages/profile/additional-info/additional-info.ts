import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'additional-info',
  templateUrl: 'additional-info.html'
})
export class AdditionalInfoComponent {
  tabBarElement: any;
  isNewForm: boolean = true;
  additionalInfoForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.additionalInfoForm = this.fb.group({
      name: ['', Validators.required],
      lastName: [''],
      languages: ['', Validators.required],
      emailId: [''],
      phone: ['', Validators.required],
      description: [''],
      subjects: [''],
      gender: [''],
      dob: [''],
      grade: [''],
      currentLoc: [''],
      facebookLink: [''],
      twitterLink: [''],
      linkedInLink: [''],
      blogLink: ['']
    });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.additionalInfoForm.value;
    console.log("Event", event);
  }

}