import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, Platform, LoadingController, NavController } from 'ionic-angular';
import { AppHeaderService } from '@app/service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'certsvalidation',
    templateUrl: 'certsvalidation.html',
  })
export class CertsValidationPage {
    sourceUrl: SafeResourceUrl;
    loading: any;
    headerObservable: any;
    backButtonFunc: any;
    url: string;

    @ViewChild('certsframe') iframe: ElementRef;
    showIframe: Boolean = false;

    constructor(
        private navParams: NavParams,
        private loadingCtrl: LoadingController,
        private headerService: AppHeaderService,
        private platform: Platform,
        private navCtrl: NavController,
        private domSanitizer: DomSanitizer,
    ) {}

    async ionViewWillEnter() {
        this.headerService.showHeaderWithBackButton();
        await this.createAndPresentLoadingSpinner();
        this.headerObservable = this.headerService.headerEventEmitted$.subscribe(eventName => {
            this.handleHeaderEvents(eventName);
        });
        this.registerDeviceBackButton();
        this.url = this.navParams.get('validationUrl');
        this.sourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);
        this.showIframe = true;
    }

    private async createAndPresentLoadingSpinner() {
        this.loading = this.loadingCtrl.create({
          showBackdrop: true,
          spinner: 'crescent'
        });

        await this.loading.present();
    }

    private handleHeaderEvents($event) {
        switch ($event.name) {
          case 'back':
            setTimeout(() => {
              this.handleBackButton();
            }, 100);
            break;
        }
    }

    registerDeviceBackButton() {
        this.backButtonFunc = this.platform.registerBackButtonAction(() => {
          this.handleBackButton();
        }, 10);
    }

    handleBackButton() {
        // const length = this.iframe.nativeElement.contentWindow.location.href.split('/').length;
        // if (this.iframe.nativeElement.contentWindow.location.href.split('/')[length - 1].startsWith('consumption') ||
        //   this.iframe.nativeElement.contentWindow.history.length === 1) {
        //   this.navCtrl.pop();
        //   this.backButtonFunc();
        // } else {
        //   this.iframe.nativeElement.contentWindow.history.go(-1);
        // }
        this.navCtrl.pop();
    }

    onLoad() {
        const element = this.iframe.nativeElement;
        if (element) {
          if (element.contentDocument.documentElement.getElementsByTagName('body')[0].innerHTML.length !== 0 && this.loading) {
            const appData = {
                // appName: this.appName
            };
            element.contentWindow.postMessage(appData, '*');
            this.loading.dismissAll();
          }
          if (element.contentDocument.documentElement.getElementsByTagName('body').length === 0 ||
            element['contentWindow'].location.href.startsWith('chrome-error:')
          ) {
            this.onError();
          }
        }
      }

    onError() {
      if (this.loading) {
        this.loading.dismissAll();
      }
    //   this.faq.url = 'file:///android_asset/www/assets/faq/consumption-faqs.html?selectedlang=en&randomid=' + Math.random();
    //   this.sourceUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.url);
    }

}
