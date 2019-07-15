import { Injectable, Inject } from '@angular/core';
import { Profile, ProfileType, SharedPreferences, AuthService, ProfileSession } from 'sunbird-sdk';
import { PreferenceKey, initTabs, GUEST_STUDENT_TABS, GUEST_TEACHER_TABS } from '@app/app';
import { TabsPage } from '@app/pages/tabs/tabs';
import { AppGlobalService } from '../app-global.service';
import { ContainerService } from '../container.services';
import { Events, App } from 'ionic-angular';

@Injectable()
export class ProfileSwitchHandler {
    constructor(@Inject('SHARED_PREFERENCES') private preferences: SharedPreferences,
        @Inject('AUTH_SERVICE') private authService: AuthService,
        private container: ContainerService,
        private events: Events,
        private appGlobalService: AppGlobalService,
        private app: App,
    ) {
    }
    public switchUser(selectedProfile) {
        if (this.appGlobalService.isUserLoggedIn()) {
            this.authService.resignSession().subscribe();
            splashscreen.clearPrefs();
        }
        setTimeout(() => {
            if (selectedProfile.profileType === ProfileType.STUDENT) {
                initTabs(this.container, GUEST_STUDENT_TABS);
                this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.STUDENT).toPromise().then();
            } else {
                initTabs(this.container, GUEST_TEACHER_TABS);
                this.preferences.putString(PreferenceKey.SELECTED_USER_TYPE, ProfileType.TEACHER).toPromise().then();
            }
            this.events.publish('refresh:profile');
            this.events.publish(AppGlobalService.USER_INFO_UPDATED);
            this.appGlobalService.setSelectedUser(undefined);
            this.app.getRootNav().setRoot(TabsPage);
        }, 1000);
    }
}
