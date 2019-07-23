import { FormGroup, FormBuilder } from '@angular/forms';
import {Component, Inject, ViewChild} from '@angular/core';
import {NavParams, ViewController, Platform, Select} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import { CommonUtilService } from '@app/service/common-util.service';
import {FilterValue
} from 'sunbird-sdk';

@Component({
    selector: 'explore-books-sort',
    templateUrl: 'explore-books-sort.html'
})
export class ExploreBooksSort {

    @ViewChild('boardSelect') boardSelect: Select;
    @ViewChild('mediumSelect') mediumSelect: Select;

    categories;
    backButtonFunc = undefined;
    sortForm: FormGroup;
    searchForm: FormGroup;
    boardList: Array<FilterValue>;
    mediumList: Array<FilterValue>;
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
    private fb: FormBuilder
    ) {
        this.initForm();
    }
    ionViewDidLoad() {
        this.backButtonFunc = this.platform.registerBackButtonAction(() => {
            this.boardSelect.close();
            this.mediumSelect.close();
            this.viewCtrl.dismiss(null);
            this.backButtonFunc();
        }, 10);
    }
    initForm() {
        this.searchForm = this.navParams.get('searchForm');
        this.boardList = this.navParams.get('boardList');
        this.mediumList = this.navParams.get('mediumList');
        this.sortForm = this.fb.group({
            board: [this.searchForm.value.board || []],
            medium: [this.searchForm.value.medium || []]
        });
    }

    dismiss() {
        if ((this.sortForm.value.board !== this.searchForm.value.board) || (this.sortForm.value.medium !== this.searchForm.value.medium)) {
            this.viewCtrl.dismiss(this.sortForm.value);
        } else {
            this.viewCtrl.dismiss(null);
        }
    }

    onWillDismiss() {
      if (this.backButtonFunc) {
        this.backButtonFunc();
      }
    }
}
