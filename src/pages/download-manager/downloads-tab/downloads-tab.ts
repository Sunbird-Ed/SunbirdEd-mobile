import { DownloadManagerPageInterface } from '../download-manager.interface';
import { MenuOverflow } from '../../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService } from '@app/service';
import { SbPopoverComponent } from '../../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ContentRequest, ContentService, Content } from 'sunbird-sdk';
import { downloadsDummyData } from '../downloads-spec.data';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';

/**
 * Generated class for the DownloadManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'downloads-tab',
    templateUrl: 'downloads-tab.html',
})
export class DownloadsTabPage {

    // @Input() downloadedContentList: Content[];
    @Input() downloadedContents: any;
    showLoader = false;
    selectedContents: string[] = [];
    showDeleteButton: Boolean = true;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private translate: TranslateService,
        private ngZone: NgZone,
        private popoverCtrl: PopoverController,
        private commonUtilService: CommonUtilService,
        private viewCtrl: ViewController,
    ) {
        // this.downloadedContentList = downloadsDummyData;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DownloadManagerPage');
    }

    showDeletePopup(identifier?) {
        // this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
        //   InteractSubtype.KEBAB_MENU_CLICKED,
        //   Environment.HOME,
        //   PageId.CONTENT_DETAIL,
        //   undefined,
        //   undefined,
        //   this.objRollup,
        //   this.corRelationList);
        if (identifier) {
            this.selectedContents = [identifier];
        }
        const confirm = this.popoverCtrl.create(SbPopoverComponent, {
            sbPopoverHeading: this.commonUtilService.translateMessage('DELETE'),
            // sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_DELETE'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('REMOVE'),
                    btnClass: 'popover-color'
                },
            ],
            icon: null,
            // metaInfo: this.content.contentData.name,
            sbPopoverContent: 'deleting content will remove the content from the device',
        }, {
                cssClass: 'sb-popover danger',
            });
        confirm.present({
            ev: event
        });
        confirm.onDidDismiss((canDelete: any) => {
            if (canDelete) {
                this.deleteContent();
                this.viewCtrl.dismiss();
            }
        });
    }

    deleteContent() {
        // const deleteList = [];
        // this.downloadedContents.forEach(element => {
        //     if (element.isSelected) {
        //         deleteList.push(element.identifier);
        //     }
        // });
        console.log('deleteContent called', this.selectedContents);
    }

    showOverflowMenu(event) {
        this.popoverCtrl.create(OverflowMenuComponent, {
            list: MenuOverflow.DOWNLOAD_FILTERS
        }, {
                cssClass: 'box'
            }).present({
                ev: event
            });
    }

    selectAllContents() {
        console.log('selectAllContents clicked');
        this.downloadedContents.forEach(element => {
            element.isSelected = true;
        });
        this.showDeleteButton = false;
        this.deleteAllContents();
        console.log('after select all', this.downloadedContents);
    }

    unSelectAllContents() {
        console.log('unSelectAllContents clicked');
        this.downloadedContents.forEach(element => {
            element.isSelected = false;
        });
        this.showDeleteButton = true;
        console.log('after un select all', this.downloadedContents);
    }

    toggleContentSelect(event, idx) {
        console.log('toggleContentSelect clicked event', event);
        console.log('toggleContentSelect clicked idx', idx);
        this.downloadedContents[idx]['isSelected'] = !this.downloadedContents[idx]['isSelected'];
        // const selectedContents = (this.downloadedContents.filter((element) => element.isSelected));
        // if (selectedContents.length) {
        //     this.showDeleteButton = false;
        //     this.deleteAllContents();
        // } else {
        //     this.showDeleteButton = true;
        // }
    }

    deleteAllContents() {
        const confirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
            // sbPopoverHeading: this.commonUtilService.translateMessage('ALERT'),
            sbPopoverMainTitle: this.commonUtilService.translateMessage('REMOVE_FROM_DEVICE'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('CANCEL'),
                    btnClass: 'sb-btn sb-btn-sm  sb-btn-outline-info'
                }, {
                    btntext: this.commonUtilService.translateMessage('DELETE'),
                    btnClass: 'popover-color'
                }
            ],
            showHeader: false,
            icon: null
        }, {
                cssClass: 'sb-popover',
            });
        confirm.present({
            ev: event
        });
        confirm.onDidDismiss((leftBtnClicked: any) => {
            console.log('leftBtnClicked', leftBtnClicked);
            if (leftBtnClicked == null) {
                this.unSelectAllContents();
                console.log('dismiss');
                return;
            } else if (leftBtnClicked) {
                this.unSelectAllContents();
                console.log('delete cancel');
            } else {
                console.log('delete confirm');
                this.selectedContents = [];
                this.downloadedContents.forEach(element => {
                    if (element.isSelected) {
                        this.selectedContents.push(element.identifier);
                    }
                });
                this.showDeletePopup();
            }
        });
    }

}
