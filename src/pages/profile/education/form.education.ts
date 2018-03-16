import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

export class FormEducation {
  tabBarElement: any;
  isNewForm: boolean = true;
  educationForm: FormGroup;
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.educationForm = this.fb.group({
      degree: ['', Validators.required],
      instituteName: ['', Validators.required],
      yop: [''],
      percentage: [''],
      grade: [''],
      board: ['']
    });
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.educationForm.value;
    console.log("Event", event);
  }

}