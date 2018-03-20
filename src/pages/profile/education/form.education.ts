import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-education',
  templateUrl: 'form.education.html'
})

export class FormEducation implements OnInit{
  tabBarElement: any;
  isNewForm: boolean = true;
  educationForm: FormGroup;
  formDetails: any = [];
  constructor(public navCtrl: NavController, public fb: FormBuilder, public navParams: NavParams) {
    //Need to hide bottom tab
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm');
    this.formDetails = this.navParams.get('formDetails');
    
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  ngOnInit() {
    this.educationForm = this.fb.group({
      degree: [(this.formDetails.degree) ? this.formDetails.degree : '', Validators.required],
      instituteName: [(this.formDetails.name) ? this.formDetails.name : '', Validators.required],
      yop: [(this.formDetails.yearOfPassing) ? this.formDetails.yearOfPassing : ''],
      percentage: [(this.formDetails.percentage) ? this.formDetails.percentage : ''],
      grade: [(this.formDetails.grade) ? this.formDetails.grade : ''],
      board: [(this.formDetails.boardOrUniversity) ? this.formDetails.boardOrUniversity : '']
    });
  }

  onSubmit(event) {
    let formVal = this.educationForm.value;
    console.log("Event", event);
  }

}