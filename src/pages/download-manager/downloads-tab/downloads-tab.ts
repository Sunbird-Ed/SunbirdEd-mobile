import { MenuOverflow } from '../../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService } from '@app/service';
import { SbPopoverComponent } from '../../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject, Input, EventEmitter, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { ContentRequest, ContentService } from 'sunbird-sdk';
import { downloadsDummyData } from '../downloads-spec.data';
import { Content, ContentDelete } from 'sunbird-sdk';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';


@Component({
    selector: 'downloads-tab',
    templateUrl: 'downloads-tab.html',
})
export class DownloadsTabPage {

    @Input() downloadedContents: Content[] = [];
    @Output() deleteContents = new EventEmitter();
    @Output() sortCriteriaChanged = new EventEmitter();
    showLoader = false;
    selectedContents: ContentDelete[] = [];
    showDeleteButton: Boolean = true;
    deletePopupPresent: Boolean = false;
    showSelectAll: Boolean = true;
    selectedFilter: string = MenuOverflow.DOWNLOAD_FILTERS[0];


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private popoverCtrl: PopoverController,
        private commonUtilService: CommonUtilService,
        private viewCtrl: ViewController,
    ) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DownloadManagerTabsPage');
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
            const contentDelete: ContentDelete = {
                contentId: identifier,
                isChildContent: false
            };
            this.selectedContents = [contentDelete];
        }
        const confirm = this.popoverCtrl.create(SbPopoverComponent, {
            sbPopoverHeading: this.commonUtilService.translateMessage('DELETE_CONTENT'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('REMOVE'),
                    btnClass: 'popover-color'
                },
            ],
            icon: null,
            // metaInfo: this.content.contentData.name,
            sbPopoverContent: this.commonUtilService.translateMessage('DELETE_CONTENT_WARNING')
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
        console.log('deleteContent called', this.selectedContents);
        this.deleteContents.emit(this.selectedContents);
    }

    showSortMenu(event) {
        const dropdown = this.popoverCtrl.create(OverflowMenuComponent, {
            list: MenuOverflow.DOWNLOAD_FILTERS
        }, {
            cssClass: 'box download-popover'
        });
        dropdown.present({
            ev: event
        });
        dropdown.onDidDismiss((element: any) => {
            console.log('dropdown selected', JSON.parse(element));
            if (element) {
                this.sortCriteriaChanged.emit(JSON.parse(element));
                this.selectedFilter = JSON.parse(element).content;
            }
        });
    }

    selectAllContents() {
        this.downloadedContents.forEach(element => {
            element['isSelected'] = true;
        });
        this.showDeleteButton = false;
        this.showSelectAll = false;
        this.deleteAllContents();
        console.log('after select all', this.downloadedContents);
    }

    unSelectAllContents() {
        this.downloadedContents.forEach(element => {
            element['isSelected'] = false;
        });
        this.showDeleteButton = true;
        this.showSelectAll = true;
        console.log('after un select all', this.downloadedContents);
    }

    toggleContentSelect(event, idx) {
        this.downloadedContents[idx]['isSelected'] = !this.downloadedContents[idx]['isSelected'];
        const selectedContents = (this.downloadedContents.filter((element) => element['isSelected']));
        if (selectedContents.length) {
            if (selectedContents.length === this.downloadedContents.length) {
                this.showSelectAll = false;
            } else {
                this.showSelectAll = true;
            }
            this.showDeleteButton = false;
            this.deleteAllContents();
        } else {
            this.showDeleteButton = true;
        }
    }

    deleteAllContents() {
        const deleteConfirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
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
            cssClass: 'sb-popover danger sb-dw-delete-popover',
            showBackdrop: false,
            enableBackdropDismiss: false
        });
        if (!this.deletePopupPresent) {
            deleteConfirm.present({
                ev: event
            });
            this.deletePopupPresent = true;
        }
        deleteConfirm.onDidDismiss((leftBtnClicked: any) => {
            this.deletePopupPresent = false;
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
                    if (element['isSelected']) {
                        const contentDelete: ContentDelete = {
                            contentId: element.identifier,
                            isChildContent: false
                        };
                        this.selectedContents.push(contentDelete);
                    }
                });
                this.showDeletePopup();
            }
        });
    }

}
