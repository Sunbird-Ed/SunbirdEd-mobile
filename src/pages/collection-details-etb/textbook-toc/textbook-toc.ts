import { Environment, PageId } from '@app/service/telemetry-constants';
import { AppHeaderService } from './../../../service/app-header.service';
// import { TelemetryGeneratorService, AppHeaderService } from '@app/service';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Platform, ScrollEvent } from 'ionic-angular';


@Component({
    selector: 'textbook-toc',
    templateUrl: 'textbook-toc.html',
})
export class TextBookTocPage {

    headerObservable: any;
    backButtonFunc = undefined;
    childrenData: Array<any>;
    shownGroup: any;
    activeMimeTypeFilter = ['all'];

    @ViewChild('stickyPillsRef') stickyPillsRef: ElementRef;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public headerService: AppHeaderService,
        private platform: Platform,
        // private telemetryGeneratorService: TelemetryGeneratorService
        ) {
        this.childrenData = this.navParams.get('childrenData');
    }

    ionViewDidLoad() {
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

    onScroll(event: ScrollEvent) {
    if (event.scrollTop >= 205) {
        (this.stickyPillsRef.nativeElement as HTMLDivElement).classList.add('sticky');
        return;
    }

    (this.stickyPillsRef.nativeElement as HTMLDivElement).classList.remove('sticky');
    }

}
