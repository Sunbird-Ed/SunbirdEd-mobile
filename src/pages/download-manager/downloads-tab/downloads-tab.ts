import { ContentDetailsPage } from './../../content-details/content-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentType, MimeType } from '@app/app/app.constant';
import { MenuOverflow } from '../../../app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { SbPopoverComponent } from '../../../component/popups/sb-popover/sb-popover';
import { Component, NgZone, Inject, Input, EventEmitter, Output } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Popover, Events } from 'ionic-angular';
import { ContentRequest, ContentService, InteractType, TelemetryObject } from 'sunbird-sdk';
import { downloadsDummyData } from '../downloads-spec.data';
import { Content, ContentDelete } from 'sunbird-sdk';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { InteractSubtype, Environment, PageId, ActionButtonType } from '@app/service/telemetry-constants';


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
    deleteAllConfirm: Popover;


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private popoverCtrl: PopoverController,
        private commonUtilService: CommonUtilService,
        private viewCtrl: ViewController,
        private events: Events,
        private telemetryGeneratorService: TelemetryGeneratorService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DownloadManagerTabsPage');
    }

    showDeletePopup(identifier?) {
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            InteractSubtype.DELETE_CLICKED,
            Environment.DOWNLOADS,
            PageId.DOWNLOADS);
        if (identifier) {
            const contentDelete: ContentDelete = {
                contentId: identifier,
                isChildContent: false
            };
            this.selectedContents = [contentDelete];
        }
        this.telemetryGeneratorService.generatePageViewTelemetry(PageId.SINGLE_DELETE_POPUP, Environment.DOWNLOADS);
        const deleteConfirm = this.popoverCtrl.create(SbPopoverComponent, {
            sbPopoverHeading: this.commonUtilService.translateMessage('DELETE_CONTENT'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('REMOVE'),
                    btnClass: 'popover-color'
                },
            ],
            icon: null,
            // mshowDeletePopupshowDeletePopupetaInfo: this.content.contentData.name,
            sbPopoverContent: identifier ? this.commonUtilService.translateMessage('DELETE_CONTENT_WARNING')
                : this.commonUtilService.translateMessage('DELETE_ALL_CONTENT_WARNING')
        }, {
                cssClass: 'sb-popover danger',
            });
        deleteConfirm.present({
            ev: event
        });
        deleteConfirm.onDidDismiss((canDelete: any) => {
            switch (canDelete) {
                case undefined:
                    this.unSelectAllContents();
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.CLOSE_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_POPUP);
                    break;
                case null:
                    this.unSelectAllContents();
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.OUTSIDE_POPUP_AREA_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_POPUP);
                    break;
                default:
                    const valuesMap = {};
                    valuesMap['type'] = ActionButtonType.POSITIVE;
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.ACTION_BUTTON_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_POPUP, undefined,
                        valuesMap);
                    this.deleteContent();
                    break;
            }
        });
    }

    deleteContent() {
        console.log('deleteContent called', this.selectedContents);
        this.deleteContents.emit(this.selectedContents);
    }

    showSortOptions(event) {
        this.telemetryGeneratorService.generateInteractTelemetry(
            InteractType.TOUCH,
            InteractSubtype.SORT_OPTION_CLICKED,
            Environment.DOWNLOADS,
            PageId.DOWNLOADS);
        const sortOptions = this.popoverCtrl.create(OverflowMenuComponent, {
            list: MenuOverflow.DOWNLOAD_FILTERS
        }, {
                cssClass: 'box download-popover'
            });
        sortOptions.present({
            ev: event
        });
        sortOptions.onDidDismiss((selectedSort: any) => {
            if (selectedSort) {
                const sortattribute = JSON.parse(selectedSort);
                if (sortattribute.content !== this.selectedFilter) {
                    this.selectedFilter = sortattribute.content;
                    this.sortCriteriaChanged.emit(sortattribute);
                }
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
        if (this.deleteAllConfirm) {
            this.deleteAllConfirm.dismiss(null);
        }
        this.selectedContents = [];
        console.log('after un select all', this.downloadedContents);
    }

    toggleContentSelect(event, idx) {
        // this.downloadedContents[idx]['isSelected'] = !this.downloadedContents[idx]['isSelected'];
        this.downloadedContents[idx]['isSelected'] = event.value;
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
            this.deleteAllConfirm.dismiss(null);
        }
    }

    deleteAllContents() {
        console.log('in deleteallcontents', this.selectedContents);
        const selectedContentsInfo = {
            totalSize: 0,
            count: 0
        };
        this.selectedContents = [];
        this.downloadedContents.forEach(element => {
            if (element['isSelected']) {
                const contentDelete: ContentDelete = {
                    contentId: element.identifier,
                    isChildContent: false
                };
                selectedContentsInfo.totalSize += element.sizeOnDevice;
                this.selectedContents.push(contentDelete);
            }
        });
        selectedContentsInfo.count = this.selectedContents.length;
        this.events.publish('selectedContents:changed', {
            selectedContents: selectedContentsInfo
        });
        if (!this.deletePopupPresent) {
            this.deleteAllConfirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
                // sbPopoverHeading: this.commonUtilService.translateMessage('ALERT'),
                sbPopoverMainTitle: this.commonUtilService.translateMessage('ITEMS_SELECTED'),
                selectedContents: selectedContentsInfo,
                actionsButtons: [
                    {
                        btntext: this.commonUtilService.translateMessage('CANCEL_LOWER_CASE'),
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
            this.deleteAllConfirm.present({
                ev: event
            });
            this.deletePopupPresent = true;
        }
        this.deleteAllConfirm.onDidDismiss((leftBtnClicked: any) => {
            this.deletePopupPresent = false;
            const valuesMap = {};
            if (leftBtnClicked == null) {
                this.unSelectAllContents();
                return;
            } else if (leftBtnClicked) {
                valuesMap['type'] = ActionButtonType.NEGATIVE;
                this.unSelectAllContents();
            } else {
                valuesMap['type'] = ActionButtonType.POSITIVE;
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.ACTION_BUTTON_CLICKED,
                    Environment.DOWNLOADS,
                    PageId.BULK_DELETE_POPUP, undefined,
                    valuesMap);
                this.showDeletePopup();
            }
            this.telemetryGeneratorService.generateInteractTelemetry(
                InteractType.TOUCH,
                InteractSubtype.ACTION_BUTTON_CLICKED,
                Environment.DOWNLOADS,
                PageId.BULK_DELETE_POPUP, undefined,
                valuesMap);
        });
    }

    navigateToDetailsPage(content) {
        const objectType = this.telemetryGeneratorService.isCollection(content.mimeType) ? content.contentType : ContentType.RESOURCE;
        const telemetryObject: TelemetryObject = new TelemetryObject(content.identifier, objectType, content.contentData.pkgVersion);
        this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
            InteractSubtype.CONTENT_CLICKED,
            Environment.DOWNLOADS,
            PageId.DOWNLOADS,
            telemetryObject);
        if (!this.selectedContents.length) {
            switch (content.mimeType) {

                case MimeType.COLLECTION: this.navCtrl.push(CollectionDetailsEtbPage, { content: content });
                    break;
                default: this.navCtrl.push(ContentDetailsPage, { content: content });
            }
        }

    }

}
