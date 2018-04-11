import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { UserProfileService } from 'sunbird';
import { ProfilePage } from './../profile';

@Component({
  selector: 'additional-info',
  templateUrl: 'additional-info.html'
})
export class AdditionalInfoComponent {
  tabBarElement: any;
  isNewForm: boolean = true;
  additionalInfoForm: FormGroup;
  userId: string;
  profile: any = {};
  languageList: Array<String> = ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Marathi", "Punjabi", "Tamil", "Telugu"];
  subjectList: Array<String> = ["Assamese", "Bengali", "English", "Gujarati", "Hindi", "Kannada", "Marathi", "Punjabi", "Tamil", "Telugu"];
  gradeList: Array<String> = [
    "Kindergarten", 
    "Grade 1", 
    "Grade 2",
    "Grade 3",
    "Grade 4", 
    "Grade 5",
    "Grade 6",
    "Grade 7",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12"
  ];
  constructor(public navCtrl: NavController,
    public fb: FormBuilder,
    public navParams: NavParams,
    public userProfileService: UserProfileService
  ) {
    this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    this.isNewForm = this.navParams.get('addForm') || true;
    this.userId =  this.navParams.get('userId');
    this.profile =  this.navParams.get('profile');

    this.additionalInfoForm = this.fb.group({
      firstName: [this.profile.firstName ? this.profile.firstName : '', Validators.required],
      lastName: [this.profile.lastName ? this.profile.lastName : ''],
      languages: [this.profile.language ? this.profile.language : [], Validators.required],
      emailId: [this.profile.email ? this.profile.email : ''],
      phone: [this.profile.phone ? this.profile.phone : '', [Validators.required, Validators.minLength(8)]],
      description: [this.profile.profileSummary ? this.profile.profileSummary : ''],
      subjects: [this.profile.subject ? this.profile.subject : []],
      gender: [this.profile.gender ? this.profile.gender : ''],
      dob: [this.profile.dob ? this.profile.dob : ''],
      grade: [this.profile.grade ? this.profile.grade : []],
      currentLoc: [this.profile.location ? this.profile.location : ''],
      facebookLink: [''],
      twitterLink: [''],
      linkedInLink: [''],
      blogLink: ['']
    });
    if(this.profile.webPages.length) {
      this.profile.webPages.forEach(element => {
        if(element.type === 'fb') {
          this.additionalInfoForm.patchValue({
            facebookLink: element.url
          })
        } else if(element.type === "twitter") {
          this.additionalInfoForm.patchValue({
            twitterLink: element.url
          })
        } else if(element.type === "in") {
          this.additionalInfoForm.patchValue({
            linkedInLink: element.url
          })
        } else {
          this.additionalInfoForm.patchValue({
            blogLink: element.url
          })
        }
      });
    }
  }

  ionViewWillEnter() {
    this.tabBarElement.style.display = 'none';
  }
 
  ionViewWillLeave() {
    this.tabBarElement.style.display = 'flex';
  }

  onSubmit(event) {
    let formVal = this.additionalInfoForm.value;
    let req = {
      userId: this.userId,
      firstName: formVal.firstName,
      language: formVal.languages,
      phone: formVal.phone
    }
    console.log("REQ", req);
    this.userProfileService.updateUserInfo(req,
      res => {
        console.log("Response", res);
        this.navCtrl.setRoot(ProfilePage);
      },
      err => {
        console.log("Error", err);
      })
  }

}