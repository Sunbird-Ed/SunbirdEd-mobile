import {
  ContentService,
  InteractType,
  InteractSubtype,
  PageId,
  Environment
} from 'sunbird';
import {
  Component
} from '@angular/core';
import {
  NavParams,
  ViewController,
  Platform} from "ionic-angular";
import {
  FormBuilder,
  FormGroup,
  FormArray
} from '@angular/forms';
import * as _ from 'lodash';
import {
  ProfileConstants,
  FlagContent
} from '../../app/app.constant';
import { AppGlobalService } from '../../service/app-global.service';
import { CommonUtilService } from '../../service/common-util.service';
import { TelemetryGeneratorService } from '../../service/telemetry-generator.service';

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
    private appGlobalService: AppGlobalService,
    private commonUtilService:CommonUtilService,
    private telemetryGeneratorService:TelemetryGeneratorService) {
    this.handleDeviceBackButton();
    this.createForm();
    this.content = this.navParams.get("content");
    this.getUserId();
  }

  handleDeviceBackButton(){
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
  };

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
    _.forEach(formValue.issues, (value) => {
      if (value.selected === true) {
        reasons.push(this.commonUtilService.translateMessage(value.name))
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
      }
      let paramsMap = new Map();
      paramsMap["contentType"] = this.content.contentType;
      paramsMap["Reason"] = reasons.join(", ");
      paramsMap["Comment"] = formValue.comment;
      this.telemetryGeneratorService.generateInteractTelemetry(
        InteractType.TOUCH,
        InteractSubtype.FLAG_INITIATE,
        Environment.HOME,
        PageId.CONTENT_DETAIL, undefined,paramsMap);

      this.contentService.flagContent(option, () => {
        let paramsMap = new Map();
        paramsMap["contentType"] = this.content.contentType;
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH, InteractSubtype.FLAG_SUCCESS, Environment.HOME, PageId.CONTENT_DETAIL, undefined, paramsMap);
        this.viewCtrl.dismiss('flag.success');
        this.commonUtilService.showToast('CONTENT_FLAGGED_MSG');
      },
        (data: any) => {
          console.log('error:', data);
          this.viewCtrl.dismiss();
          this.commonUtilService.showToast('CONTENT_FLAG_FAIL');
        })
    }
  }

}
