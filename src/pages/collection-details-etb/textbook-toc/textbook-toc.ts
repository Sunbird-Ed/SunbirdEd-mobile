import { TextbookTocService } from './../textbook-toc-service';
import { Environment, PageId } from '@app/service/telemetry-constants';
import { AppHeaderService } from './../../../service/app-header.service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, ScrollEvent, PopoverController } from 'ionic-angular';
import { SbGenericPopoverComponent } from '@app/component/popups/sb-generic-popup/sb-generic-popover';
import { CommonUtilService } from '@app/service/common-util.service';


@Component({
    selector: 'textbook-toc',
    templateUrl: 'textbook-toc.html',
})
export class TextBookTocPage {

    static pageName = 'TextBookTocPage';

    headerObservable: any;
    backButtonFunc = undefined;
    childrenData: Array<any>;
    // shownGroup: any;
    dismissCallback: Function;
    activeMimeTypeFilter = ['all'];

    @ViewChild('stickyPillsRef') stickyPillsRef: ElementRef;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public headerService: AppHeaderService,
        private platform: Platform,
        private commonUtilService: CommonUtilService,
        private popoverCtrl: PopoverController,
        private textbookTocService: TextbookTocService
        // private telemetryGeneratorService: TelemetryGeneratorService
        ) {

        this.childrenData = this.navParams.get('childrenData');
    }

    ionViewDidLoad() {
        this.dismissCallback = this.navParams.get('dismissCallback');
    }

    ionViewWillEnter() {
        console.log('in TOC page', this.childrenData);
        this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
            this.handleHeaderEvents(eventName);
        });
        this.headerService.showHeaderWithBackButton();
        this.backButtonFunc = this.platform.registerBackButtonAction(() => {
            // this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME, false);
            this.handleBackButton();
            this.backButtonFunc();
        }, 10);
        this.textbookTocService.setTextbookIds({contentId: undefined, rootUnitId: undefined});
    }

    ionViewWillLeave() {
        this.headerObservable.unsubscribe();
    }

    handleBackButton() {
        console.log('TOC handleBackButton');
        this.navCtrl.pop();
    }

    handleHeaderEvents($event) {
        switch ($event.name) {
            case 'back':
                // this.telemetryGeneratorService.generateBackClickedTelemetry(PageId.COLLECTION_DETAIL, Environment.HOME, true);
                this.handleBackButton();
                break;
        }
    }

    showCommingSoonPopup(childData: any) {
        if (childData.contentData.mimeType === 'application/vnd.ekstep.content-collection' && !childData.children) {
            const popover = this.popoverCtrl.create(SbGenericPopoverComponent, {
                sbPopoverHeading: this.commonUtilService.translateMessage('CONTENT_COMMING_SOON'),
                sbPopoverMainTitle: this.commonUtilService.translateMessage('CONTENT_IS_BEEING_ADDED') + childData.contentData.name,
                actionsButtons: [
                    {
                        btntext: this.commonUtilService.translateMessage('OKAY'),
                        btnClass: 'popover-color'
                    }
                ],
            }, {
                cssClass: 'sb-popover warning',
            });
            popover.present({
                ev: event
            });
        }
    }

    async onUnitClick(item) {
        console.log('onUnitClick', item);
        // await this.navCtrl.pop();
        // this.dismissCallback();
    }

    setContentId(id: string) {
        console.log('collection first child', id);
        // if (this.navCtrl.getActive().component['pageName'] === 'TextBookTocPage') {
        //   const values = new Map();
        //   values['unitClicked'] = id;
        //    this.telemetryService.generateInteractTelemetry(
        //     InteractType.TOUCH,
        //     InteractSubtype.UNIT_CLICKED,
        //     Environment.HOME,
        //     PageId.TEXTBOOK_TOC,
        //     undefined,
        //     values
        //   );
        // }

        this.textbookTocService.setTextbookIds({rootUnitId: id, contentId: id});
        this.navCtrl.pop();
    }

}
