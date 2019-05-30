import { ContentDetailsPage } from './../../content-details/content-details';
import { CollectionDetailsEtbPage } from '@app/pages/collection-details-etb/collection-details-etb';
import { ContentType, MimeType, MenuOverflow } from '@app/app/app.constant';
import { OverflowMenuComponent } from '@app/pages/profile';
import { CommonUtilService, TelemetryGeneratorService } from '@app/service';
import { SbPopoverComponent } from '../../../component/popups/sb-popover/sb-popover';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NavController, PopoverController, Popover, Events } from 'ionic-angular';
import { InteractType, TelemetryObject, Content, ContentDelete } from 'sunbird-sdk';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { InteractSubtype, Environment, PageId, ActionButtonType } from '@app/service/telemetry-constants';
import { EmitedContents } from '../download-manager.interface';


@Component({
    selector: 'downloads-tab',
    templateUrl: 'downloads-tab.html',
})
export class DownloadsTabPage {

    @Input() downloadedContents: Content[] = [];
    @Output() deleteContents = new EventEmitter();
    @Output() sortCriteriaChanged = new EventEmitter();

    showDeleteButton: Boolean = true;
    showSelectAll: Boolean = true;
    selectedFilter: string = MenuOverflow.DOWNLOAD_FILTERS[0];

    private deleteAllPopupPresent: Boolean = false;
    private selectedContents: ContentDelete[] = [];
    private deleteAllConfirm: Popover;
    private selectedContentsInfo = {
        totalSize: 0,
        count: 0
    };

    constructor(
        private navCtrl: NavController,
        private popoverCtrl: PopoverController,
        private commonUtilService: CommonUtilService,
        private events: Events,
        private telemetryGeneratorService: TelemetryGeneratorService) {
    }

    showDeletePopup(identifier?) {
        if (identifier) {
            this.telemetryGeneratorService.generateInteractTelemetry(InteractType.TOUCH,
                InteractSubtype.DELETE_CLICKED,
                Environment.DOWNLOADS,
                PageId.DOWNLOADS);
            const contentDelete: ContentDelete = {
                contentId: identifier,
                isChildContent: false
            };
            this.selectedContents = [contentDelete];
        }
        this.telemetryGeneratorService.generatePageViewTelemetry(
            identifier ? PageId.SINGLE_DELETE_CONFIRMATION_POPUP : PageId.BULK_DELETE_CONFIRMATION_POPUP, Environment.DOWNLOADS);
        const deleteConfirm = this.popoverCtrl.create(SbPopoverComponent, {
            sbPopoverHeading: this.commonUtilService.translateMessage('DELETE_CONTENT'),
            actionsButtons: [
                {
                    btntext: this.commonUtilService.translateMessage('REMOVE'),
                    btnClass: 'popover-color'
                },
            ],
            icon: null,
            // metaInfo: this.content.contentData.name,
            sbPopoverContent: identifier ? this.commonUtilService.translateMessage('DELETE_CONTENT_WARNING')
                : this.commonUtilService.translateMessage('DELETE_ALL_CONTENT_WARNING')
        }, {
                cssClass: 'sb-popover danger',
            });
        deleteConfirm.present();
        deleteConfirm.onDidDismiss((canDelete: any) => {
            switch (canDelete) {
                case undefined:
                    this.unSelectAllContents();
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.CLOSE_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_CONFIRMATION_POPUP);
                    break;
                case null:
                    this.unSelectAllContents();
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.OUTSIDE_POPUP_AREA_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_CONFIRMATION_POPUP);
                    break;
                default:
                    const valuesMap = {};
                    valuesMap['type'] = ActionButtonType.POSITIVE;
                    this.telemetryGeneratorService.generateInteractTelemetry(
                        InteractType.TOUCH,
                        InteractSubtype.ACTION_BUTTON_CLICKED,
                        Environment.DOWNLOADS,
                        PageId.SINGLE_DELETE_CONFIRMATION_POPUP, undefined,
                        valuesMap);
                    this.deleteContent();
                    break;
            }
        });
    }

    private deleteContent() {
        const emitedContents: EmitedContents = {
            selectedContentsInfo: this.selectedContentsInfo,
            selectedContents : this.selectedContents
        };
        this.deleteContents.emit(emitedContents);
    }

    showSortOptions() {
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
        sortOptions.present();
        sortOptions.onDidDismiss((selectedSort: any) => {
            if (selectedSort) {
                const sortattribute = JSON.parse(selectedSort);
                if (sortattribute.content !== this.selectedFilter) {
                    this.selectedFilter = sortattribute.content;
                    this.sortCriteriaChanged.emit(sortattribute);
                }
                if (this.deleteAllPopupPresent) {
                    this.deleteAllConfirm.dismiss(null);
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
    }

    unSelectAllContents() {
        this.downloadedContents.forEach(element => {
            element['isSelected'] = false;
        });
        this.showDeleteButton = true;
        this.showSelectAll = true;
        if (this.deleteAllPopupPresent) {
            this.deleteAllConfirm.dismiss(null);
        }
        this.selectedContents = [];
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
            if (this.deleteAllPopupPresent) {
                this.deleteAllConfirm.dismiss(null);
            }
        }
    }

    private deleteAllContents() {
        this.selectedContentsInfo = {
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
                this.selectedContentsInfo.totalSize += element.sizeOnDevice;
                this.selectedContents.push(contentDelete);
            }
        });
        this.selectedContentsInfo.count = this.selectedContents.length;
        this.events.publish('selectedContents:changed', {
            selectedContents: this.selectedContentsInfo
        });
        if (!this.deleteAllPopupPresent) {
            this.telemetryGeneratorService.generatePageViewTelemetry(PageId.BULK_DELETE_POPUP, Environment.DOWNLOADS);
            this.deleteAllConfirm = this.popoverCtrl.create(SbGenericPopoverComponent, {
                // sbPopoverHeading: this.commonUtilService.translateMessage('ALERT'),
                sbPopoverMainTitle: this.commonUtilService.translateMessage('ITEMS_SELECTED'),
                selectedContents: this.selectedContentsInfo,
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
            this.deleteAllConfirm.present();
            this.deleteAllPopupPresent = true;
        }
        this.deleteAllConfirm.onDidDismiss((cancelBtnClicked: any) => {
            this.deleteAllPopupPresent = false;
            const valuesMap = {};
            if (cancelBtnClicked == null) {                                 /* -cancelBtnClicked = null */
                this.unSelectAllContents();
                this.telemetryGeneratorService.generateInteractTelemetry(
                    InteractType.TOUCH,
                    InteractSubtype.POPUP_DISMISSED,
                    Environment.DOWNLOADS,
                    PageId.BULK_DELETE_POPUP);
                return;
            } else if (cancelBtnClicked) {                                  /* -cancelBtnClicked = true */
                valuesMap['type'] = ActionButtonType.NEGATIVE;
                this.unSelectAllContents();
            } else {                                                        /* -cancelBtnClicked = false (Delete all items) */
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
        const objectType = this.telemetryGeneratorService.isCollection(content.mimeType) ? content.contentData.contentType
            : ContentType.RESOURCE;
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
