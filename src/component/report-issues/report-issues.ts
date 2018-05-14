import { ContentService, AuthService } from 'sunbird';
import { Component, NgModule } from '@angular/core';
import { NavParams, ViewController, Platform, ToastController } from "ionic-angular";
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

/**
 * Generated class for the ReportIssuesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report-issues',
  templateUrl: 'report-issues.html'
})
export class ReportIssuesComponent {

  backButtonFunc = undefined;
  reportIssues: FormGroup;
  content: any;
  userId: string;

  options = {
    issues: [
      { name: 'OPTION_COPYRIGHT_VIOLATION', selected: false, id: 1 },
      { name: 'OPTION_INAPPROPRIATE_CONTENT', selected: false, id: 2 },
      { name: 'OPTION_PRIVACY_VIOLATION', selected: false, id: 3 },
      { name: 'OPTION_OTHER', selected: false, id: 4 }
    ]
  }

  constructor(private fb: FormBuilder,
    private platform: Platform,
    private viewCtrl: ViewController,
    private contentService: ContentService,
    private navParams: NavParams,
    private translate: TranslateService,
    private authService: AuthService,
    private toastCtrl: ToastController) {
    console.log('Hello ReportIssuesComponent Component');
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
    this.createForm();
    this.content = this.navParams.get("content");
    this.getUserId();
  }

  getUserId() {
    this.authService.getSessionData((data: string) => {
      let res = JSON.parse(data);
      console.log('auth service...', res);
      if (res === undefined || res === "null") {
        this.userId = '';
      } else {
        this.userId = res["userToken"] ? res["userToken"] : '';
      }
    });
  }

  buildIssueList() {
    const arr = this.options.issues.map(issue => {
      return this.fb.control(issue.selected);
    });
    return this.fb.array(arr);
  }

  createForm() {
    this.reportIssues = this.fb.group({
      issues: this.buildIssueList(),
      comment: ['']
    });
  }
  get issues(): FormArray {
    return this.reportIssues.get('issues') as FormArray;
  };

  extractFormValues() {

  }

  showMessage(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  submit(value) {
    const formValue = Object.assign({}, value, {
      issues: value.issues.map((selected, i) => {
        return {
          name: this.options.issues[i].name,
          selected: selected
        }
      })
    });

    let reasons = [];
    _.forEach(formValue.issues, (value, key) => {
      if (value.selected === true) {
        reasons.push(this.translateLangConst(value.name))
      }
    });

    if (formValue.comment === '' && reasons.length === 0) {
      this.showMessage(this.translateLangConst('ERROR_FLAG_CONTENT_MIN_REASON'))
    } else {
      const option = {
        contentId: this.content.identifier,
        flagReasons: [formValue.comment],
        flaggedBy: this.userId,
        versionKey: this.content.versionKey,
        flags: reasons
      }
      console.log('api request...', option);
      this.contentService.flagContent(option, (res: any) => {
        console.log('success:', res);
      },
        (error: any) => {
          console.log('error:', error);
        })
    }
  }

  /**
   * 
   * @param {string} constant 
   */
  translateLangConst(constant: string) {
    console.log('constant...', constant);
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
        // return value;
      }
    );
    return msg;
  }
}
