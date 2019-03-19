import {Component} from '@angular/core';
import {NavParams, Platform, ViewController} from 'ionic-angular';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import * as _ from 'lodash';
import {FlagContent, ProfileConstants} from '../../app/app.constant';
import {AppGlobalService} from '../../service/app-global.service';
import {CommonUtilService} from '../../service/common-util.service';
import {TelemetryGeneratorService} from '../../service/telemetry-generator.service';
import {Environment, InteractSubtype, InteractType, PageId} from '../../service/telemetry-constants';

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
  };

  constructor(
    private fb: FormBuilder,
    private platform: Platform,
    private viewCtrl: ViewController,
    private navParams: NavParams,
    private appGlobalService: AppGlobalService,
    private commonUtilService: CommonUtilService,
    private telemetryGeneratorService: TelemetryGeneratorService
    ) {
    this.handleDeviceBackButton();
    this.createForm();
    this.content = this.navParams.get('content');
    this.getUserId();
  }

  handleDeviceBackButton() {
    this.backButtonFunc = this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
      this.backButtonFunc();
    }, 10);
  }

  getUserId() {
    if (this.appGlobalService.getSessionData()) {
      this.userId = this.appGlobalService.getSessionData()[ProfileConstants.USER_TOKEN];
    } else {
      this.userId = '';
    }
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
  }

  submit(value) {
    const formValue = Object.assign({}, value, {
      issues: value.issues.map((selected, i) => {
        return {
          name: this.options.issues[i].value,
          selected: selected
        };
      })
    });

    const reasons = [];
    _.forEach(formValue.issues, (issue) => {
      if (issue.selected === true) {
        reasons.push(this.commonUtilService.translateMessage(issue.name));
      }
    });

    if (reasons.length === 0 || this.userId === '') {
      this.commonUtilService.showToast('ERROR_FLAG_CONTENT_MIN_REASON');
    } else {
      const option = {
        contentId: this.content.identifier,
        flagReasons: reasons,
        flaggedBy: this.userId,
        versionKey: this.content.versionKey,
        flags: [formValue.comment]
      };
      const paramsMap = new Map();
      paramsMap['contentType'] = this.content.contentType;
      paramsMap['Reason'] = reasons.join(', ');
      paramsMap['Comment'] = formValue.comment;
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.FLAG_INITIATE,
        Environment.HOME,
        PageId.CONTENT_DETAIL, undefined, paramsMap);

      // this.contentService.flagContent(option).then(() => {
      //   const flagContentParamsMap = new Map();
      //   flagContentParamsMap['contentType'] = this.content.contentType;
      //   this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.FLAG_SUCCESS,
      //     Environment.HOME, PageId.CONTENT_DETAIL, undefined, flagContentParamsMap);
      //   this.viewCtrl.dismiss('flag.success');
      //   this.commonUtilService.showToast('CONTENT_FLAGGED_MSG');
      // })
      //   .catch((data: any) => {
      //     console.log('error:', data);
      //     this.viewCtrl.dismiss();
      //     this.commonUtilService.showToast('CONTENT_FLAG_FAIL');
      //   });
    }
  }

}
