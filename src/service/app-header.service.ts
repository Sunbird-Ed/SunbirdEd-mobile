import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { defaultThrottleConfig } from 'rxjs/operators/throttle';

@Injectable()
export class AppHeaderService {

    constructor() { }

    private headerEvent = new Subject<any>();
    headerEventEmitted$ = this.headerEvent.asObservable();

    private headerConfig =  new Subject<any>();
    headerConfigEmitted$ = this.headerConfig.asObservable();


    private sideMenuItemEvent = new Subject<any>();
    sideMenuItemEventEmitted$ = this.sideMenuItemEvent.asObservable();

    sidebarEvent(name: any) {
        this.headerEvent.next(name);
    }

    sideMenuItemEvents($event) {
        this.sideMenuItemEvent.next($event);
    }

    getDefaultPageConfig() {
       const defaultConfig  = {
            showHeader : true,
            showBurgerMenu: true,
            pageTitle: '',
            actionButtons: ['search'],
        };
        return defaultConfig;
    }

    hideHeader() {
        const defaultConfig = this.getDefaultPageConfig();
        defaultConfig.showHeader = false;
        defaultConfig.showBurgerMenu = false;
        this.updatePageConfig(defaultConfig);
    }

    showHeaderWithBackButton(iconList?) {
        const defaultConfig = this.getDefaultPageConfig();
        defaultConfig.showHeader = true;
        defaultConfig.showBurgerMenu = false;
        defaultConfig.actionButtons = iconList ? iconList : [];
        this.updatePageConfig(defaultConfig);
    }

    showHeaderWithHomeButton(iconList?) {
        const defaultConfig = this.getDefaultPageConfig();
        defaultConfig.showHeader = true;
        defaultConfig.showBurgerMenu = true;
        defaultConfig.actionButtons = iconList ? iconList : [];
        this.updatePageConfig(defaultConfig);
    }

    updatePageConfig(config) {
        this.headerConfig.next(config);
    }
}
