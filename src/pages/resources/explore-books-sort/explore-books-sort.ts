import { ProfileConstants } from '@app/app';
import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, Inject} from '@angular/core';
import {NavParams, ViewController, Platform} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { CommonUtilService } from '@app/service/common-util.service';
import { FrameworkDetailsRequest, FrameworkCategoryCodesGroup, FrameworkService, ProfileService,
    Profile, Framework, FrameworkUtilService } from 'sunbird-sdk';

@Component({
    selector: 'explore-books-sort',
    templateUrl: 'explore-books-sort.html'
})
export class ExploreBooksSort {

    profile: Profile;
    categories;
    backButtonFunc = undefined;
    sortForm: FormGroup;
    searchForm: FormGroup;
    boardList: Array<any>;
    mediumList: Array<any>;
    boardOptions = {
        title: this.commonUtilService.translateMessage('BOARD_OPTION_TEXT'),
        cssClass: 'select-box'
    };
    mediumOptions = {
        title: this.commonUtilService.translateMessage('MEDIUM_OPTION_TEXT'),
        cssClass: 'select-box'
    };

 constructor(
    public viewCtrl: ViewController,
    private navParams: NavParams,
    private platform: Platform,
    private commonUtilService: CommonUtilService,
    private fb: FormBuilder,
    private translate: TranslateService,
    @Inject('FRAMEWORK_SERVICE') private frameworkService: FrameworkService,
    @Inject('PROFILE_SERVICE') private profileService: ProfileService,
    @Inject('FRAMEWORK_UTIL_SERVICE') private frameworkUtilService: FrameworkUtilService
    ) {
        this.initForm();
    }
    ionViewDidLoad() {
        this.backButtonFunc = this.platform.registerBackButtonAction(() => {
            this.viewCtrl.dismiss(null);
            this.backButtonFunc();
        });
        this.profileService.getActiveSessionProfile({requiredFields: ProfileConstants.REQUIRED_FIELDS})
        .toPromise()
        .then((response: any) => {
            this.profile = response;
            this.getFrameworkDetails();
        }).catch(() => {
            this.profile = undefined;
        });
    }
    initForm() {
        this.searchForm = this.navParams.get('searchForm');
        console.log('searchForm', this.searchForm);
        this.sortForm = this.fb.group({
            board: [this.searchForm.value.board || []],
            medium: [this.searchForm.value.medium || []]
        });
    }
    getFrameworkDetails() {
        const frameworkDetailsRequest: FrameworkDetailsRequest = {
            frameworkId: this.profile.syllabus[0] ? this.profile.syllabus[0] : '',
            requiredCategories: FrameworkCategoryCodesGroup.DEFAULT_FRAMEWORK_CATEGORIES
        };
        this.frameworkService.getFrameworkDetails(frameworkDetailsRequest).toPromise()
        .then((framework: Framework) => {
            this.categories = framework.categories;
            this.boardList = this.categories.find((f) => f.code === 'board').terms;
            this.mediumList = this.categories.find((f) => f.code === 'medium').terms;
        }).catch(error => {
            console.error('Error', error);
            // this.commonUtilService.showToast('NEED_INTERNET_TO_CHANGE');
        });

    }
    dismiss() {
        if ((this.sortForm.value.board !== this.searchForm.value.board) || (this.sortForm.value.medium !== this.searchForm.value.medium)) {
            this.viewCtrl.dismiss(this.sortForm.value);
        } else {
            this.viewCtrl.dismiss(null);
        }
    }
}
