import { ContentService, AuthService, TelemetryService, InteractType, InteractSubtype, PageId, Environment } from 'sunbird';
import { Component, NgModule } from '@angular/core';
import { NavParams, ViewController, Platform, ToastController } from "ionic-angular";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { generateInteractTelemetry} from '../../app/telemetryutil';
import { ProfileConstants, FlagContent } from '../../app/app.constant';

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
      { name: FlagContent.FLAG_REASONS_LABLE[0], value: FlagContent.FLAG_REASONS_VALUE[0], selected: false, id: 1 },
      { name: FlagContent.FLAG_REASONS_LABLE[1], value: FlagContent.FLAG_REASONS_VALUE[1], selected: false, id: 2 },
      { name: FlagContent.FLAG_REASONS_LABLE[2], value: FlagContent.FLAG_REASONS_VALUE[2], selected: false, id: 3 },
      { name: FlagContent.FLAG_REASONS_LABLE[3], value: FlagContent.FLAG_REASONS_VALUE[3], selected: false, id: 4 }
    ]
  }

  constructor(private fb: FormBuilder,
    private platform: Platform,
    private viewCtrl: ViewController,
    private contentService: ContentService,
    private navParams: NavParams,
    private translate: TranslateService,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private telemetryService : TelemetryService) {
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
        this.userId = res[ProfileConstants.USER_TOKEN] ? res[ProfileConstants.USER_TOKEN] : '';
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
          name: this.options.issues[i].value,
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

    if (reasons.length === 0 || this.userId === '') {
      this.showMessage(this.translateLangConst('ERROR_FLAG_CONTENT_MIN_REASON'))
    } else {
      const option = {
        contentId: this.content.identifier,
        flagReasons: reasons,
        flaggedBy: this.userId,
        versionKey: this.content.versionKey,
        flags: [formValue.comment]
      }
      let paramsMap = new Map();
      paramsMap["contentType"] = this.content.contentType;
      paramsMap["Reason"] = reasons.join(", ");
      paramsMap["Comment"] = formValue.comment;
      this.telemetryService.interact(generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.FLAG_INITIATE,
        Environment.HOME,
        PageId.CONTENT_DETAIL, paramsMap,
        undefined,
        undefined
      ));

      console.log('reasons==>>', option);
      this.contentService.flagContent(option, (res: any) => {
        console.log('success:', res);
        let paramsMap = new Map();
        paramsMap["contentType"] = this.content.contentType;
        this.telemetryService.interact(generateInteractTelemetry(
          InteractType.TOUCH,
          InteractSubtype.FLAG_SUCCESS,
          Environment.HOME,
          PageId.CONTENT_DETAIL, paramsMap,
          undefined,
          undefined
        ));
        this.viewCtrl.dismiss('flag.success');
        this.showMessage(this.translateLangConst('CONTENT_FLAGGED_MSG'));
      },
        (data: any) => {
          console.log('error:', data);
          this.viewCtrl.dismiss();
          this.showMessage(this.translateLangConst('CONTENT_FLAG_FAIL'));
        })
    }
  }

  /**
   * 
   * @param {string} constant 
   */
  translateLangConst(constant: string) {
    let msg = '';
    this.translate.get(constant).subscribe(
      (value: any) => {
        msg = value;
      }
    );
    return msg;
  }
}
